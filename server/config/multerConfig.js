import multer from "multer";
import path from "path";
import fs from "fs";

// Temporary upload directory
const TMP_UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(TMP_UPLOAD_DIR)) {
  fs.mkdirSync(TMP_UPLOAD_DIR, { recursive: true });
}

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TMP_UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

/* ---------------- IMAGE FILTER ---------------- */
function imageFileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png, or .webp files allowed!"), false);
  }
}

/* ---------------- VIDEO FILTER ---------------- */
function videoFileFilter(req, file, cb) {
  const allowed = ["video/mp4", "video/mov", "video/avi", "video/mkv"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
}

// Limits
const imageLimits = { fileSize: 5 * 1024 * 1024 };        // 5MB
const videoLimits = { fileSize: 500 * 1024 * 1024 };     // 500MB

// Export two upload middlewares
export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: imageLimits,
});

export const uploadVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: videoLimits,
});
