const express=require('express');
const router=express.Router();
const Doctor=require('../../models/DoctorSchema');

router.get("/csearchdoctors", async (req, res) => {
  try {
    const query = req.query.query;
    if(!query || query.trim()===""){
      return res.status(400).json({doctors:[]});
    }
  
    const doctors = await Doctor.find({
      $or: [
          { first_name: { $type: "string", $regex: query, $options: "i" } },
          { last_name: { $type: "string", $regex: query, $options: "i" } },
          { specialization: { $type: "string", $regex: query, $options: "i" } }

      ]
    },"doc_id prefix first_name last_name specialization profile_url experience");
    res.status(200).json({doctors:doctors});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports=router;
