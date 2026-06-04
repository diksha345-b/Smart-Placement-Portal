const express = require('express');
const { uploadResume, downloadResume } = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume: uploadMiddleware } = require('../middleware/upload');

const router = express.Router();

router.use(protect, authorize('student'));

router.post('/upload', uploadMiddleware, uploadResume);
router.get('/download', downloadResume);

module.exports = router;
