const User = require('../models/User');
const Prescription = require('../models/Prescription');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId, 
      req.body, 
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPrescription = async (req, res) => {
  try {
    const prescription = new Prescription({ ...req.body, user: req.user.userId });
    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.userId, isActive: true });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};