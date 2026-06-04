const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Strip sensitive fields before returning a user object to the client.
 */
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
};

// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, company } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // Admin accounts cannot be self-registered through this endpoint.
  const safeRole = role === 'hr' ? 'hr' : 'student';

  const user = await User.create({
    name,
    email,
    password,
    role: safeRole,
    company: safeRole === 'hr' ? company : undefined,
  });

  const token = generateToken(user);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Registration successful',
    data: { user: sanitizeUser(user), token },
  });
});

// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated');
  }

  const token = generateToken(user);

  return sendSuccess(res, {
    message: 'Login successful',
    data: { user: sanitizeUser(user), token },
  });
});

// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    message: 'Current user',
    data: { user: sanitizeUser(req.user) },
  });
});

module.exports = { register, login, getMe, sanitizeUser };
