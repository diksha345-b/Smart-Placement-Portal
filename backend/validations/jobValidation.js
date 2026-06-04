const { body } = require('express-validator');

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];

const createJobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('location').optional().trim().isLength({ max: 120 }),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 5000 })
    .withMessage('Description too long'),
  body('requiredSkills').optional().isArray().withMessage('Required skills must be an array'),
  body('requiredSkills.*').optional().isString().trim(),
  body('jobType').optional().isIn(JOB_TYPES).withMessage('Invalid job type'),
  body('salaryRange').optional().trim().isLength({ max: 60 }),
  body('experienceLevel').optional().trim().isLength({ max: 60 }),
  body('status').optional().isIn(['Open', 'Closed']).withMessage('Invalid status'),
];

// For updates every field is optional, but the same constraints apply.
const updateJobValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 120 }),
  body('company').optional().trim().notEmpty().withMessage('Company cannot be empty'),
  body('location').optional().trim().isLength({ max: 120 }),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty').isLength({ max: 5000 }),
  body('requiredSkills').optional().isArray().withMessage('Required skills must be an array'),
  body('requiredSkills.*').optional().isString().trim(),
  body('jobType').optional().isIn(JOB_TYPES).withMessage('Invalid job type'),
  body('salaryRange').optional().trim().isLength({ max: 60 }),
  body('experienceLevel').optional().trim().isLength({ max: 60 }),
  body('status').optional().isIn(['Open', 'Closed']).withMessage('Invalid status'),
];

module.exports = { createJobValidation, updateJobValidation };
