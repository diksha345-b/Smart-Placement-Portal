const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Ensure the uploads directory exists.
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const MAX_FILE_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB || 5);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const userId = req.user ? req.user._id : 'anon';
    const ext = path.extname(file.originalname);
    const unique = `${userId}-${Date.now()}${ext}`;
    cb(null, `resume-${unique}`);
  },
});

// Only allow PDF files.
const fileFilter = (req, file, cb) => {
  const isPdf =
    file.mimetype === 'application/pdf' &&
    path.extname(file.originalname).toLowerCase() === '.pdf';
  if (!isPdf) {
    return cb(new ApiError(400, 'Only PDF files are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});

/**
 * Wrap multer's single-file middleware so multer errors (e.g. file too large)
 * are converted to our standard ApiError shape.
 */
const uploadResume = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, `File too large. Max size is ${MAX_FILE_SIZE_MB}MB`));
      }
      return next(err);
    }
    if (!req.file) {
      return next(new ApiError(400, 'Resume file is required'));
    }
    next();
  });
};

module.exports = { uploadResume, UPLOAD_DIR };
