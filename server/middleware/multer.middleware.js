import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// FIX: original filter only allowed videos — thumbnails were silently rejected.
// Now two separate middleware instances: one for videos, one for images.

export const uploadVideo = multer({
  storage,
  limits: { fileSize: 3000 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowed = /mp4|mkv|mov|avi/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only video files are allowed (mp4, mkv, mov, avi)"));
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB for images
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = /image\/(jpeg|jpg|png|webp)/.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files are allowed (jpg, png, webp)"));
  },
});

// Use uploadVideo for subsection routes, uploadImage for thumbnail / profile picture routes
// Example in your router:
//   router.post("/createSubSection", auth, isInstructor, uploadVideo.single("video"), createSubSection)
//   router.post("/createCourse",     auth, isInstructor, uploadImage.single("thumbnail"), createCourse)
//   router.put("/updateDisplayPicture", auth, uploadImage.single("displayPicture"), updateDisplayPicture)