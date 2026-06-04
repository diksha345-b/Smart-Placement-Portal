const express = require('express');
const {
  getUsers,
  toggleUserStatus,
  deleteUser,
  getAllJobs,
  deleteAnyJob,
  getAnalytics,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);

router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteAnyJob);

module.exports = router;
