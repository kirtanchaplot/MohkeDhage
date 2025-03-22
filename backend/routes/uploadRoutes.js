import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// Ensure 'uploads' folder exists manually before running the server

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = ["jpeg", "jpg", "png", "webp"];
  const extname = path.extname(file.originalname).toLowerCase().replace(".", "");
  const mimetype = file.mimetype;

  if (filetypes.includes(extname) && mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG, or WEBP images are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ Added Try-Catch for Better Error Handling
router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    try {
      if (err) {
        console.error("Multer Error:", err.message);
        return res.status(400).json({ message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      res.status(200).json({
        message: "Image uploaded successfully",
        // image: req.file.path,
        image: `/uploads/${path.basename(req.file.path)}`,
      });
    } catch (error) {
      console.error("Unexpected Error:", error.message);
      res.status(500).json({ message: "Server error. Try again later." });
    }
  });
});

export default router;




