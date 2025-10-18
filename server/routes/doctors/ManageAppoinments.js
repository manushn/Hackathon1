const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Appointment = require("../../models/AppoinmentsSchema");
const Doctor = require("../../models/DoctorSchema");

require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


router.get("/getappointments", async (req, res) => {
  if (req.tokenData.role !== "doctor") {
    return res.status(400).json({ emessage: "Invalid Access!" });
  }

  try {
    const doctorId = req.tokenData.id;
    const appointments = await Appointment.find({ doctorId })
      .sort({ date: 1, createdAt: -1 });

    res.status(200).json({
      appointments,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      message: "Server error while fetching appointments",
      error: error.message,
    });
  }
});


router.delete("/deleteappointment/:id", async (req, res) => {
  if (req.tokenData.role !== "doctor") {
    return res.status(400).json({ emessage: "Invalid Access!" });
  }

  try {
    const doctorId = req.tokenData.id;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctorId,
    });

    if (!appointment) {
      return res.status(404).json({ emessage: "Appointment not found" });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: appointment.patientEmail,
                subject: "Your Appoinment has Cancelled ! ",
                text:`Hello ${appointment.patientName} 👋,\n\nYour appointment with ${appointment.doctor_name} on ${appointment.date.toISOString().split('T')[0]} during ${appointment.slotName} is unfortunately cancelled by the doctor.\n\nFor any queries please free to contact us ☺️\n\nThank you for choosing our service!\n\nBest regards,\nMCare Team`,
            });

    res.status(200).json({
      message: "Appointment deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


module.exports = router;
