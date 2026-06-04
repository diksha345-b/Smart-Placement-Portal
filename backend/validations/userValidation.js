const { body } = require('express-validator');

const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 1, max: 80 }).withMessage('Invalid name'),
  body('phone').optional().trim().isLength({ max: 20 }).withMessage('Invalid phone'),
  body('college').optional().trim().isLength({ max: 120 }),
  body('degree').optional().trim().isLength({ max: 120 }),
  body('graduationYear')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1950, max: 2100 })
    .withMessage('Invalid graduation year'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('skills.*').optional().isString().trim(),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio too long'),
  body('company').optional().trim().isLength({ max: 120 }),
];

module.exports = { updateProfileValidation };
