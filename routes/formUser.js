const express = require("express");
const router = express.Router();
const User = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
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
    res.status(200).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "User already existed" });
    // res.status(500).json({ message: "Error creating user" });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  console.log("user in db found:", user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Wrong password" });
  }

  // Generate the JWT token
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  // Respond with token and username
  res.status(200).json({ 
    token, 
    "username": user.username // Include the username
  });
});

module.exports = router;



