const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  doc_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  profile_url:{
    type:String,
    default:"/upload/defauladoc.png"
  },
  prefix: {
    type: String,
    default: "Dr"
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone_no: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    min: 0
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: "doctor",
    enum: ["doctor", "admin"] 
  }
}, { timestamps: true });

module.exports = mongoose.model("Doctor", DoctorSchema);
