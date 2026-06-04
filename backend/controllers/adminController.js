const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

// @route   GET /api/admin/users
// @access  Private (admin)
// Supports ?role=&search=&page=&limit=
const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    message: 'Users fetched',
    data: { users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
  });
});

// @route   PATCH /api/admin/users/:id/status
// @access  Private (admin)
// Activate / deactivate a user account.
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Cannot change an admin account status');

  user.isActive = !user.isActive;
  await user.save();

  return sendSuccess(res, {
    message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
    data: { user },
  });
});

// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Cannot delete an admin account');

  await user.deleteOne();
  // Cascade: remove their applications and, for HR, their jobs + those jobs' applications.
  await Application.deleteMany({ student: user._id });
  if (user.role === 'hr') {
    const jobs = await Job.find({ postedBy: user._id }).select('_id');
    const jobIds = jobs.map((j) => j._id);
    await Job.deleteMany({ postedBy: user._id });
    await Application.deleteMany({ job: { $in: jobIds } });
  }

  return sendSuccess(res, { message: 'User deleted', data: { id: req.params.id } });
});

// @route   GET /api/admin/jobs
// @access  Private (admin)
const getAllJobs = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    Job.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('postedBy', 'name company email'),
    Job.countDocuments(),
  ]);

  return sendSuccess(res, {
    message: 'Jobs fetched',
    data: { jobs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
  });
});

// @route   DELETE /api/admin/jobs/:id
// @access  Private (admin)
const deleteAnyJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  await job.deleteOne();
  await Application.deleteMany({ job: job._id });
  return sendSuccess(res, { message: 'Job deleted', data: { id: req.params.id } });
});

// @route   GET /api/admin/analytics
// @access  Private (admin)
// Aggregated platform metrics for the dashboard charts.
const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalStudents,
    totalHR,
    totalJobs,
    openJobs,
    totalApplications,
    statusBreakdown,
    jobsByType,
    recentApplications,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'hr' }),
    Job.countDocuments(),
    Job.countDocuments({ status: 'Open' }),
    Application.countDocuments(),
    Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Job.aggregate([{ $group: { _id: '$jobType', count: { $sum: 1 } } }]),
    Application.find().sort({ createdAt: -1 }).limit(5).populate('student', 'name').populate('job', 'title'),
  ]);

  // Normalize aggregation output into chart-friendly arrays.
  const statusData = ['Shortlisted', 'Under Review', 'Rejected'].map((s) => ({
    name: s,
    value: (statusBreakdown.find((x) => x._id === s) || {}).count || 0,
  }));

  const jobTypeData = jobsByType.map((x) => ({ name: x._id, value: x.count }));

  return sendSuccess(res, {
    message: 'Platform analytics',
    data: {
      stats: {
        totalUsers,
        totalStudents,
        totalHR,
        totalJobs,
        openJobs,
        totalApplications,
      },
      statusData,
      jobTypeData,
      recentApplications,
    },
  });
});

module.exports = {
  getUsers,
  toggleUserStatus,
  deleteUser,
  getAllJobs,
  deleteAnyJob,
  getAnalytics,
};
