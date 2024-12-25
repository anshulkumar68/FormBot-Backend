const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    foldername: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Folder', folderSchema)