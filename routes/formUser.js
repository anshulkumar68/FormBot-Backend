const express = require("express");
const router = express.Router();
const User = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/auth");
dotenv.config();

// SIGN UP
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({ message: "User already exist" });
  }

  //encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //creating user
  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(200).json({ message: "user created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "user already existed" });
    // res.status(500).json({ message: "Error creating user" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  console.log("user in db found:", user);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "wrong password" });
  }

  // Generate the JWT token
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  // Respond with token and username
  res.status(200).json({
    token,
    username: user.username, // Include the username
  });
});

// CREDENTIALS UPDATE
router.post("/update", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { username, email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (username) {
      user.username = username;
      //  res.status(200).json({message : "username updated successfully"})
    }
    if (email) {
      user.email = email;
      //  res.status(200).json({message : "email updated successfully"})
    }
    if (oldPassword || newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(404).json({ message: "incorrect old password" });
      }

      if (oldPassword === newPassword) {
        return res.status(401).json({ message: "password can't be same" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }
    await user.save();
    res.status(200).json({message : "user updated successfully"});

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "error updating field", error });
  }
});

module.exports = router;
