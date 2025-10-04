const mongoose = require("mongoose");

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  slot1Remaining: { type: Number, default: 36 },  
  slot2Remaining: { type: Number, default: 60 },  
}, { timestamps: true });



module.exports = mongoose.model("DoctorSchedule", doctorScheduleSchema);
