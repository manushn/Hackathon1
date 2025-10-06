const express = require("express");
const router = express.Router();

const Doctor = require("../../models/DoctorSchema"); 

const multer = require("multer");
const cloudinary=require("../../config/cloudinary")
const upload = require("../../config/multerConfig");


router.post("/adddoctor", upload.single("profile"), async (req, res) => {
  try {
    let photo_url = "https://res.cloudinary.com/dxpawc7lh/image/upload/v1759649101/defauladoc_edby2z.png";
    let photo_id = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      photo_url = result.secure_url;
      photo_id = result.public_id;
    }

    const { first_name, last_name, city, email, phone_no, experience, degree, specialization } = req.body;

    if (!first_name || !last_name || !city || !email || !phone_no || !experience || !degree || !specialization) {
      return res.status(203).json({ message: "All fields are required" });
    }

    const Isemail = await Doctor.findOne({ email });
    if (Isemail) return res.status(203).json({ emessage: "Email already in use" });

    const Isphone = await Doctor.findOne({ phone_no });
    if (Isphone) return res.status(203).json({ emessage: "Phone number already in use" });

    const lastDoctor = await Doctor.findOne().sort({ doc_id: -1 }).exec();

    let newDocId = "MCARE10001";
    if (lastDoctor && lastDoctor.doc_id) {
      const lastId = lastDoctor.doc_id;
      const numPart = parseInt(lastId.replace("MCARE", ""));
      const nextNum = numPart + 1;
      newDocId = "MCARE" + nextNum;
    }

    const newDoctor = new Doctor({
      doc_id: newDocId,
      prefix: "Dr",
      first_name,
      last_name,
      city,
      email,
      phone_no,
      experience,
      degree,
      specialization,
      role: "doctor",
      profile_url: photo_url,
      cloudinary_id: photo_id,
    });

    await newDoctor.save();

    return res.status(201).json({ message: "Doctor added successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.delete("/deletedoctor/:id", async (req, res) => {
  try {
    
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(400).json({ emessage: "Doctor not found" });
    }

    
     if (doctor.cloudinary_id) {
      await cloudinary.uploader.destroy(doctor.cloudinary_id);
      console.log("Deleted Cloudinary image:", doctor.cloudinary_id);
    }

    
    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Doctor deleted successfully",
      success:true
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting doctor",
      error: error.message
    });
  }
});

router.get("/getdoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find({},"doc_id prefix first_name last_name specialization profile_url").sort({ createdAt: -1 });
    res.status(200).json({doctors:doctors});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/getdoctor/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    res.status(200).json({doctor:doctor});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/searchdoctors", async (req, res) => {
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
    },"doc_id prefix first_name last_name specialization profile_url");
    res.status(200).json({doctors:doctors});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
