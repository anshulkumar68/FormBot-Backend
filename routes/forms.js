const express = require("express");
const router = express.Router();
const Form = require("../schema/formSchema");
const authMiddleware = require("../middleware/auth");
const dotenv = require("dotenv");
dotenv.config();

// FORM CREATION
router.post("/", authMiddleware, async (req, res) => {
  const { formname, fields } = req.body;
  console.log("backend payload:", req.body);
  const userId = req.user.id; // use the userId from request
  // Validate the input
  if (!formname || !fields || !userId) {
    return res
      .status(400)
      .json({ error: "formname, fields are required" });
  }
  try {
    const newForm = new Form({
      formname,
      fields,
      userId,
    });
    await newForm.save();
    res.status(200).json({ message: "form created successfully", newForm });
  } catch (err) {
    console.error("error creating form:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET FORM
router.get("/", authMiddleware, async(req, res)=>{
    const userId= req.user.id;

    try{
        const forms = await Form.find({formname});
        return res.status(200).json({ forms });
    }catch (error) {
        console.error("error fetching form:", error);
        return res.status(500).json({ message: "failed to fetch form", error : {error} });
      }
})

// DELETE FIELD
router.delete("/form/:formId/field/:fieldId", authMiddleware, async (req, res) => {
    const { formId, fieldId } = req.params;
    console.log("Form ID:", formId); // Should log the value from the request URL
    console.log("Field ID:", fieldId);  
    const form = await Form.findById(formId);
    const userId = req.user.id;
    
    try{
      if (!form) {
        return res.status(404).json({ message: "form not found" });
      }

      const updatedFields = form.fields.filter((field) => field.fieldId !== fieldId);

      form.fields = updatedFields;
      await form.save();
      res.status(200).json({ message: "form deleted", form });
    }
    catch(error){
      return res.status(500).json({ message: "error deleting form", error });
    }
  });

module.exports = router;
