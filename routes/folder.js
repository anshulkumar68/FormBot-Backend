const express = require("express");
const router = express.Router();
const Folder = require("../schema/folderSchema");
const authMiddleware = require("../middleware/auth");
const dotenv = require("dotenv");
dotenv.config();

// FOLDER GET
router.get("/", authMiddleware, async (req, res) => {
  try {
    const folders = await Folder.find();
    return res.status(200).json({ folders });
  } catch (error) {
    console.error("error fetching users:", error);
    return res.status(500).json({ message: "failed to fetch users" });
  }
});

// FOLDER GET BY ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    
    return res.status(200).json({ folder });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "failed to fetch users" });
  }
});

// FOLDER CREATION
router.post("/", authMiddleware, async (req, res) => {
  const { foldername } = req.body;
  const userId = req.user.id; //  Use the user ID from the request object set by the authMiddleware

  // if folder exist
  const isFolderExist = await Folder.findOne({ foldername });
  if (isFolderExist) {
    return res.status(400).json({ message: "folder already exist" });
  }

  try {
    const folder = await Folder.create({
      foldername,
      userId,
    });
    return res.status(200).json({ message: "folder created", folder });
  } catch (error) {
    return res.status(500).json({ message: "error creating folder", error });
  }
});

//   FOLDER DELETION
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const folder = await Folder.findById(id);
  const userId = req.user.id;

  try{
    if (!folder) {
      return res.status(404).json({ message: "folder not found" });
    }
    if (userId !== folder.userId.toString()) {
      return res
        .status(403)
        .json({ message: "not authorized to delete this folder" });
    }
  
    await Folder.deleteOne({ _id: id });
    res.status(200).json({ message: "Folder Deleted" });
  }
  catch(error){
    return res.status(500).json({ message: "error deleting folder", error });
  }
});

module.exports = router;
