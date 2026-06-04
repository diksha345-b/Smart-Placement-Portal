const express = require('express');
const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { applyValidation, updateStatusValidation } = require('../validations/applicationValidation');

const router = express.Router();

router.use(protect);

router.get('/mine', authorize('student'), getMyApplications);
router.post('/:jobId', authorize('student'), applyValidation, validate, applyToJob);

router.get('/job/:jobId', authorize('hr', 'admin'), getJobApplicants);
router.patch('/:id/status', authorize('hr', 'admin'), updateStatusValidation, validate, updateApplicationStatus);

module.exports = router;
