const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['student', 'hr', 'admin'];

/**
 * Resume sub-document embedded on the student user. Stores the uploaded
 * file reference plus the analysis output from the resume service.
 */
const resumeSchema = new mongoose.Schema(
  {
    fileName: { type: String },
    filePath: { type: String },
    originalName: { type: String },
    score: { type: Number, default: 0 },
    skills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    uploadedAt: { type: Date },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password by default
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'student',
    },
    // Student profile fields
    phone: { type: String, trim: true },
    college: { type: String, trim: true },
    degree: { type: String, trim: true },
    graduationYear: { type: Number },
    skills: { type: [String], default: [] },
    bio: { type: String, maxlength: 500 },
    // HR / company field
    company: { type: String, trim: true },
    // Embedded resume + analysis
    resume: { type: resumeSchema, default: undefined },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving when it has been modified.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare a plain password against the stored hash.
userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.ROLES = ROLES;

module.exports = mongoose.model('User', userSchema);
