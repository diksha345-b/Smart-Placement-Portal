const mongoose = require('mongoose');

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const JOB_STATUS = ['Open', 'Closed'];

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 5000,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    jobType: {
      type: String,
      enum: JOB_TYPES,
      default: 'Full-time',
    },
    salaryRange: {
      type: String,
      trim: true,
    },
    experienceLevel: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: JOB_STATUS,
      default: 'Open',
    },
    // HR user who created the job.
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Text index to support keyword search on listings.
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

jobSchema.statics.JOB_TYPES = JOB_TYPES;
jobSchema.statics.JOB_STATUS = JOB_STATUS;

module.exports = mongoose.model('Job', jobSchema);
