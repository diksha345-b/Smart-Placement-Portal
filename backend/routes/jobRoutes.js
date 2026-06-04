const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createJobValidation, updateJobValidation } = require('../validations/jobValidation');

const router = express.Router();

router.use(protect);

// HR's own jobs (declared before '/:id' so it is not treated as an id).
router.get('/hr/mine', authorize('hr'), getMyJobs);

router.get('/', getJobs);
router.post('/', authorize('hr'), createJobValidation, validate, createJob);

router.get('/:id', getJobById);
router.put('/:id', authorize('hr', 'admin'), updateJobValidation, validate, updateJob);
router.delete('/:id', authorize('hr', 'admin'), deleteJob);

module.exports = router;
