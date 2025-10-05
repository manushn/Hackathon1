const express = require("express");
const router = express.Router();
const Appointment = require("../../models/AppoinmentsSchema");
const DoctorSchedule = require("../../models/DoctorScheduleSchema");
const Doctor = require("../../models/DoctorSchema");
const patient = require("../../models/PatientSchema");
const nodemailer = require("nodemailer");

require('dotenv').config()


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});



router.post("/book-appointment", async (req, res) => {
    try{
        const {doc_id,date,slot,patientemail}=req.body;

        if(!doc_id || !date || !slot || !patientemail){
            return res.status(203).json({ emessage: "All fields are required" });
        }

        let preschedule = await DoctorSchedule.findOne({ doctorId: doc_id.trim(), date: date.trim() });
        
        if (!preschedule) {
            const newDoctorSchedule = new DoctorSchedule({
                doctorId: doc_id.trim(),
                date: date.trim(),
                slot1Remaining: 36,
                slot2Remaining:60
            });
            
            preschedule=await newDoctorSchedule.save();
            preschedule = await DoctorSchedule.findOne({ doctorId: doc_id.trim(), date: date.trim() });
        }
        if(slot==="10:00 AM - 01:00 PM"){
            if(preschedule.slot1Remaining<=0){
                return res.status(203).json({ emessage: "No slots available in this time range. Please choose another slot." });
            }
            preschedule.slot1Remaining -= 1;
        }else if(slot==="04:00 PM - 08:00 PM"){
            if(preschedule.slot2Remaining<=0){
                return res.status(203).json({ emessage: "No slots available in this time range. Please choose another slot." });
            }
            preschedule.slot2Remaining -= 1;
        }else{
            return res.status(203).json({ emessage: "Invalid slot selected." });
        }

        await preschedule.save();

        const doctorData = await Doctor.findById(doc_id.trim());
        const patientData = await patient.findOne({email:patientemail.trim()});

        if(!doctorData){
            return res.status(203).json({ emessage: "Doctor not found." });
        }

        if(!patientData){
            return res.status(203).json({ emessage: "Patient not found." });
        }

        const newAppointment = new Appointment({
            doctorId: doc_id.trim(),
            doctor_name: `Dr ${doctorData.first_name} ${doctorData.last_name}`,
            date: date.trim(),
            slotName: slot.trim(),
            patientName: patientData.patient_name,
            patientEmail: patientData.email,
            contactNo: patientData.contact_no,
            address: patientData.address
        });

        let savedappoinment=await newAppointment.save();


        
        await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: patientData.email,
                subject: "Your Appoinment is Scheduled Successfully ",
                text:`Hello ${patientData.patient_name} 👋,\n\nYour appointment with Dr ${doctorData.first_name} ${doctorData.last_name} is scheduled on ${date} during ${slot}.\n\nYour Appoinment id is ${savedappoinment._id}\n\nPlease arrive 10 minutes early and bring any necessary documents.\n\nThank you for choosing our service!\n\nBest regards,\nMCare Team`,
            });


        return res.status(201).json({ success: true });


    }catch(err){
        console.log("Error in booking appointment:", err);
        return res.status(500).json({ emessage: "Server error in booking appointment" });
    }
})
module.exports = router;