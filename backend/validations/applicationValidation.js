const { body, param } = require('express-validator');

const applyValidation = [
  param('jobId').isMongoId().withMessage('Invalid job id'),
  body('coverNote').optional().trim().isLength({ max: 1000 }).withMessage('Cover note too long'),
];

const updateStatusValidation = [
  param('id').isMongoId().withMessage('Invalid application id'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Rejected', 'Under Review', 'Shortlisted'])
    .withMessage('Invalid status'),
];

module.exports = { applyValidation, updateStatusValidation };
