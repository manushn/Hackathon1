const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
require('dotenv').config()


const doctorSchema = require("../../models/DoctorSchema");
const DoctorSchema = require("../../models/DoctorSchema");

const patientSchema = require("../../models/PatientSchema");
const PatientSchema = require("../../models/PatientSchema");

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

router.post("/patient-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ emessage: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; 

  otpStore[email] = { otp, expiresAt };

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your One Time Password For MCare.",
      text: `Your One Time Password For MCare is : ${otp}.\n Don't share your OTP with any one.\nIf it is not done by you please feel free to contact us. We are always for you☺️.`,
    });

    return res.status(200).json({ success: true});
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ emessage: "Error sending email" });
  }
});

router.post("/verify-otp", async (req, res) => {

  try{

    const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ emessage: "Email and OTP are required" });
  }

  const sOtp = otpStore[email];
  if (!sOtp) {
    return res.status(400).json({ emessage: "No OTP found for this email." });
  }

  if (Date.now() > sOtp.expiresAt) {
    delete otpStore[email];
    return res.status(203).json({ emessage: "OTP expired. Please use Resend Option." });
  }

  
  if (sOtp.otp !== otp) {
    return res.status(203).json({ emessage: "Invalid OTP" });
  }
  
  delete otpStore[email];

  const user = await PatientSchema.findOne({ email: email.trim() });
  if (!user) {
    return res.status(203).json({ patient:[] });
  } 
  
  return res.status(200).json({ patient:user});

  }catch(err){
    console.log("Error in verify otp:",err)
    return res.status(500).json({ emessage: "Server error in verifying otp " });
  }
  
});

router.post("/register-patient", async (req, res) => {
  try {
    const { patient_name, age, email, contact_no, address } = req.body;

    if (!patient_name || !age || !email || !contact_no || !address) {
      return res.status(203).json({ emessage: "All fields are required" });
    }

   
    const Isemail = await PatientSchema.findOne({ email });
    if (Isemail) {
      token = jwt.sign(
      { id: Isemail._id, email: Isemail.email },
      process.env.JWT_SECRET,
      { expiresIn: "12hr" }
    );

    const encryptedToken = CryptoJS.AES.encrypt(token, process.env.CRYPTO_KEY).toString();  


    return res.status(201).json({ token:encryptedToken, success:true, role:"patient",username:email });
    }


    const newPatient = new PatientSchema({
      patient_name,
      age,
      email,
      contact_no,
      address,
    });

    await newPatient.save();

    token = jwt.sign(
      { id: newPatient._id, email: newPatient.email ,role:"patient"},
      process.env.JWT_SECRET,
      { expiresIn: "12hr" }
    );

    const encryptedToken = CryptoJS.AES.encrypt(token, process.env.CRYPTO_KEY).toString();  


    return res.status(201).json({ token:encryptedToken, success:true, role:"patient" ,username:email});
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/doctor-otp", async (req, res) => {
  const { doc_id } = req.body;

  if (!doc_id) {
    return res.status(203).json({ emessage: "Doctor ID is required" });
  }

  try {
    
    const user = await DoctorSchema.findOne({ doc_id: doc_id.trim() });
    if (!user) {
      return res.status(203).json({ emessage: "Enter a valid Doctors Id" });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; 

    
    otpStore[doc_id] = { otp, expiresAt };

    
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Your One Time Password For MCare.",
      text: `Your One Time Password For MCare is: ${otp}. Don't share your OTP with anyone. If this wasn't you, please contact us immediately.`,
    });

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ emessage: "Error sending email" });
  }
});




router.post("/login-otp", async (req, res) => {
  try {
    const { doc_id, otp } = req.body;

    if (!doc_id || !otp) {
      return res.status(203).json({ emessage: "Email and OTP are required" });
    }

    const user = await DoctorSchema.findOne({ doc_id: doc_id.trim() });
    if (!user) {
      return res.status(203).json({ emessage: "User not found" });
    }

    const sOtp = otpStore[doc_id];
    if (!sOtp) {
      return res.status(400).json({ emessage: "No OTP found for this Doctor." });
    }

    if (Date.now() > sOtp.expiresAt) {
      delete otpStore[doc_id];
      return res.status(203).json({ emessage: "OTP expired. Please use Resend Option." });
    }

    
    if (sOtp.otp !== otp) {
      return res.status(400).json({ emessage: "Invalid OTP" });
    }

    
    delete otpStore[doc_id];

    
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "12hr" }
    );

    const encryptedToken = CryptoJS.AES.encrypt(token, process.env.CRYPTO_KEY).toString();


    return res.status(200).json({
      success: true,
      message: "Login successful",
      token:encryptedToken,
      role:user.role
    });

  } catch (error) {
    console.error("Login OTP Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
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
