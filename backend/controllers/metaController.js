const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { ALL_SKILLS } = require('../utils/skills');

// @route   GET /api/meta/skills
// @access  Public
// Exposes the known skill list so the frontend can power skill pickers.
const getSkills = asyncHandler(async (req, res) => {
  return sendSuccess(res, { message: 'Skills', data: { skills: ALL_SKILLS } });
});

module.exports = { getSkills };
