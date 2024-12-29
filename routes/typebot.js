const express = require("express");
const router = express.Router();
const Forms = require("../schema/typebotSchema");
const authMiddleware = require("../middleware/auth");
const dotenv = require("dotenv");
const typebotSchema = require("../schema/typebotSchema");
dotenv.config();

// FORM CREATION
router.post("/", authMiddleware, async(req, res)=>{
    const {formname, bubbleText, images, inputText, number, email, phone, date, rating, buttons} = req.body;
    console.log("backend:",req.body);
    const userId = req.user.id; // use the userId from request
    try{
        const typebot = await Forms.create({
            formname,
            bubbleText:req.body.Text,
            images:req.body.Images,
            inputText:req.body.Input_Text,
            number:req.body.Number,
            email:req.body.Email,
            phone:req.body.Phone,     
            date:req.body.Date, 
            rating:req.body.Rating,
            buttons:req.body.Buttons,
            userId,
        });
        // await Forms.save();
        res.status(200).json({message: 'form created successfully', formId: typebot._id})
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "error creating form", error : error.message });
    }
})

module.exports = router;