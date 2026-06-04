const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { sanitizeUser } = require('./authController');

// Fields a user is allowed to update on their own profile.
const PROFILE_FIELDS = [
  'name',
  'phone',
  'college',
  'degree',
  'graduationYear',
  'skills',
  'bio',
  'company',
];

// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  PROFILE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  return sendSuccess(res, {
    message: 'Profile updated',
    data: { user: sanitizeUser(user) },
  });
});

// @route   GET /api/users/resume-score
// @access  Private (student)
const getResumeScore = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return sendSuccess(res, {
    message: 'Resume analysis',
    data: { resume: user.resume || null },
  });
});

module.exports = { updateProfile, getResumeScore };
