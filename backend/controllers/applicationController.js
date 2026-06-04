const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { evaluateApplication } = require('../services/matchService');

// @route   POST /api/applications/:jobId
// @access  Private (student)
// Applies the smart shortlisting logic and stores match score + status.
const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');
  if (job.status === 'Closed') throw new ApiError(400, 'This job is no longer accepting applications');

  const student = await User.findById(req.user._id);

  // Candidate skills come from resume analysis merged with profile skills.
  const candidateSkills = student.skills || [];
  if (candidateSkills.length === 0) {
    throw new ApiError(
      400,
      'Upload your resume or add skills to your profile before applying'
    );
  }

  const existing = await Application.findOne({ job: jobId, student: student._id });
  if (existing) throw new ApiError(409, 'You have already applied to this job');

  const { matchScore, status, matchedSkills, missingSkills } = evaluateApplication(
    candidateSkills,
    job.requiredSkills
  );

  const application = await Application.create({
    job: jobId,
    student: student._id,
    candidateSkills,
    matchScore,
    matchedSkills,
    missingSkills,
    status,
    coverNote: req.body.coverNote,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Application submitted',
    data: { application },
  });
});

// @route   GET /api/applications/mine
// @access  Private (student)
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .sort({ createdAt: -1 })
    .populate('job', 'title company location jobType status');

  return sendSuccess(res, { message: 'Your applications', data: { applications } });
});

// @route   GET /api/applications/job/:jobId
// @access  Private (hr owner / admin)
// Returns applicants for a job, sorted by match score (best first).
const getJobApplicants = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');

  if (req.user.role !== 'admin' && job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only view applicants for your own jobs');
  }

  const applications = await Application.find({ job: jobId })
    .sort({ matchScore: -1, createdAt: -1 })
    .populate('student', 'name email phone college degree graduationYear skills resume');

  return sendSuccess(res, {
    message: 'Applicants fetched',
    data: { job: { _id: job._id, title: job.title, requiredSkills: job.requiredSkills }, applications },
  });
});

// @route   PATCH /api/applications/:id/status
// @access  Private (hr owner / admin)
// Lets HR manually override the auto-assigned status (shortlist/reject).
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id).populate('job', 'postedBy title');
  if (!application) throw new ApiError(404, 'Application not found');

  if (
    req.user.role !== 'admin' &&
    application.job.postedBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'You can only update applications for your own jobs');
  }

  application.status = status;
  await application.save();

  return sendSuccess(res, { message: 'Application status updated', data: { application } });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};
