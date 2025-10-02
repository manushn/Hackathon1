const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");

const doctorSchema = require("../../models/DoctorSchema");

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "justfriend.chatapp@gmail.com",
    pass: "mjqk fipp vdro lknw",
  },
});

router.post("/addadmindoctor", async (req, res) => {
  try {
    const {doc_id,first_name,last_name,age,city,email,phone_no,experience,degree,specialization,} = req.body;

    if(!doc_id||!first_name||!last_name||!age||!city||!email||!phone_no||!experience||!degree||!specialization){
        return res.status(203).json({emessage:"All fields are required"})
    }

    const emailExist = await doctorSchema.findOne({ email });
    if (emailExist) {
      return res.status(203).json({ emessage: "Email already in use" });
    }

    
    const phoneExist = await doctorSchema.findOne({ phone_no });
    if (phoneExist) {
      return res.status(203).json({ emessage: "Phone number already in use" });
    }

    const newDoctor = new doctorSchema({
      doc_id,
      prefix: "Dr", 
      first_name,
      last_name,
      age,
      city,
      email,
      phone_no,
      experience,
      degree,
      specialization,
      role: "admin", 
    });

    await newDoctor.save();

    return res.status(201).json({ message: "Admin doctor added successfully",});
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
