const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { analyzeResume } = require('../services/resumeService');

// @route   POST /api/resume/upload
// @access  Private (student)
// Expects a multipart form with a single `resume` PDF (handled by upload middleware).
const uploadResume = asyncHandler(async (req, res) => {
  const filePath = req.file.path;

  let analysis;
  try {
    analysis = await analyzeResume(filePath);
  } catch (err) {
    // Clean up the saved file if parsing failed.
    fs.unlink(filePath, () => {});
    throw new ApiError(400, 'Could not read the PDF. Please upload a valid resume.');
  }

  const user = await User.findById(req.user._id);

  // Remove a previously uploaded resume file to avoid orphaned uploads.
  if (user.resume && user.resume.filePath && fs.existsSync(user.resume.filePath)) {
    fs.unlink(user.resume.filePath, () => {});
  }

  user.resume = {
    fileName: req.file.filename,
    filePath,
    originalName: req.file.originalname,
    score: analysis.score,
    skills: analysis.skills,
    missingSkills: [], // populated per-job when applying; kept empty here
    suggestions: analysis.suggestions,
    uploadedAt: new Date(),
  };

  // Merge detected skills into the student's profile skills (unique).
  const merged = new Set([...(user.skills || []), ...analysis.skills]);
  user.skills = Array.from(merged);

  await user.save();

  return sendSuccess(res, {
    message: 'Resume uploaded and analyzed',
    data: {
      resume: {
        score: analysis.score,
        skills: analysis.skills,
        missingSkills: user.resume.missingSkills,
        suggestions: analysis.suggestions,
        originalName: req.file.originalname,
        uploadedAt: user.resume.uploadedAt,
      },
    },
  });
});

// @route   GET /api/resume/download
// @access  Private (student)
const downloadResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.resume || !user.resume.filePath || !fs.existsSync(user.resume.filePath)) {
    throw new ApiError(404, 'No resume on file');
  }
  return res.download(user.resume.filePath, user.resume.originalName || 'resume.pdf');
});

module.exports = { uploadResume, downloadResume };
