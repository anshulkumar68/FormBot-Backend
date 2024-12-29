const mongoose = require("mongoose");

const typebotSchema = new mongoose.Schema({
    formname: {
        type: String,
      },
    bubbleText:{
        type : String,
    },
    images:{
        type : String,
    },
    inputText:{
        type : String,
    },
    number:{
        type : Number,
    },
    email:{
        type : String,
    },
    phone:{
        type : Number,
    },
    date:{
        type : Date,
    },
    rating:{
        type : Number,
        min: 0,
        max: 5,
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    fileId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "file",  
    }
})

module.exports = mongoose.model("Forms", typebotSchema)