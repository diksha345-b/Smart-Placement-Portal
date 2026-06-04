const mongoose = require('mongoose');

const APPLICATION_STATUS = ['Rejected', 'Under Review', 'Shortlisted'];

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Snapshot of the candidate skills at apply time (from their resume/profile).
    candidateSkills: {
      type: [String],
      default: [],
    },
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: APPLICATION_STATUS,
      default: 'Under Review',
    },
    coverNote: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// A student can only apply to a given job once.
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

applicationSchema.statics.APPLICATION_STATUS = APPLICATION_STATUS;

module.exports = mongoose.model('Application', applicationSchema);
