const express = require('express');
const { updateProfile, getResumeScore } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileValidation } = require('../validations/userValidation');

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfileValidation, validate, updateProfile);
router.get('/resume-score', authorize('student'), getResumeScore);

module.exports = router;
