const Job = require('../models/Job');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Build a Mongo filter + pagination options from query params.
 */
const buildListOptions = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 9, 1), 50);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// @route   GET /api/jobs
// @access  Private (any authenticated user)
// Supports ?search=&jobType=&status=&page=&limit=
const getJobs = asyncHandler(async (req, res) => {
  const { search, jobType, status } = req.query;
  const { page, limit, skip } = buildListOptions(req.query);

  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }
  if (jobType) filter.jobType = jobType;
  if (status) filter.status = status;

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('postedBy', 'name company'),
    Job.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    message: 'Jobs fetched',
    data: {
      jobs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  });
});

// @route   GET /api/jobs/:id
// @access  Private
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name company');
  if (!job) throw new ApiError(404, 'Job not found');

  let hasApplied = false;
  if (req.user.role === 'student') {
    const existing = await Application.findOne({ job: job._id, student: req.user._id });
    hasApplied = Boolean(existing);
  }

  return sendSuccess(res, {
    message: 'Job fetched',
    data: { job, hasApplied },
  });
});

// @route   POST /api/jobs
// @access  Private (hr)
const createJob = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    postedBy: req.user._id,
    company: req.body.company || req.user.company,
  };
  const job = await Job.create(payload);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Job created',
    data: { job },
  });
});

/**
 * Confirm the requesting HR owns the job (or is an admin).
 */
const ensureCanManage = (job, user) => {
  if (user.role === 'admin') return;
  if (job.postedBy.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You can only manage jobs you posted');
  }
};

// @route   PUT /api/jobs/:id
// @access  Private (hr owner / admin)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  ensureCanManage(job, req.user);

  const updatable = [
    'title',
    'company',
    'location',
    'description',
    'requiredSkills',
    'jobType',
    'salaryRange',
    'experienceLevel',
    'status',
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) job[field] = req.body[field];
  });

  await job.save();
  return sendSuccess(res, { message: 'Job updated', data: { job } });
});

// @route   DELETE /api/jobs/:id
// @access  Private (hr owner / admin)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  ensureCanManage(job, req.user);

  await job.deleteOne();
  // Remove related applications.
  await Application.deleteMany({ job: job._id });

  return sendSuccess(res, { message: 'Job deleted', data: { id: req.params.id } });
});

// @route   GET /api/jobs/hr/mine
// @access  Private (hr)
// Returns the HR user's jobs with application counts.
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 }).lean();

  const counts = await Application.aggregate([
    { $match: { job: { $in: jobs.map((j) => j._id) } } },
    { $group: { _id: '$job', count: { $sum: 1 } } },
  ]);
  const countMap = counts.reduce((acc, c) => {
    acc[c._id.toString()] = c.count;
    return acc;
  }, {});

  const withCounts = jobs.map((j) => ({ ...j, applicantCount: countMap[j._id.toString()] || 0 }));

  return sendSuccess(res, { message: 'Your jobs', data: { jobs: withCounts } });
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs };
