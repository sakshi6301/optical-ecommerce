const express = require('express');
const { 
  getProfile, 
  updateProfile, 
  addPrescription, 
  getPrescriptions 
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/prescriptions', authenticate, addPrescription);
router.get('/prescriptions', authenticate, getPrescriptions);

module.exports = router;