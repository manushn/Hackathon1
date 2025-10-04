const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  doctor_name: { type: String, required: true },
  date: { type: Date, required: true },
  slotName: { type: String, required: true }, 
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
