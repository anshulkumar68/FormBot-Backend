const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const formSchema = new mongoose.Schema(
{
  formId:{
    type: String,  
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
    formname: {
      type: String,
      required: true, 
      unique: true,
    },
    fields: [
      {
        fieldId: {
          type: String,
          required: true, 
          unique: true,   
        },
        type: {
          type: String,
          required: true, 
          // enum: ["text", "number", "email", "date", "rating", "phone"], 
        },
        value: {
          type: mongoose.Schema.Types.Mixed, 
          required: true, 
        },
      },
    ], 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true, 
    },
  }
);

module.exports = mongoose.model("Form", formSchema);

