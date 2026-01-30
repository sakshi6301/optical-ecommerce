const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rightEye: {
    sphere: Number,
    cylinder: Number,
    axis: Number,
    add: Number
  },
  leftEye: {
    sphere: Number,
    cylinder: Number,
    axis: Number,
    add: Number
  },
  pupillaryDistance: Number,
  prescriptionDate: Date,
  doctorName: String,
  notes: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);