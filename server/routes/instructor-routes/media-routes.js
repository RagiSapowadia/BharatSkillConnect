const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("File upload request received:", req.file);
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log("Cloudinary not configured, using local file path");
      
      // Return local file info for development
      const result = {
        url: `http://localhost:5000/uploads/${req.file.filename}`,
        public_id: req.file.filename,
        secure_url: `http://localhost:5000/uploads/${req.file.filename}`
      };
      
      res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      // Use Cloudinary if configured
      const result = await uploadMediaToCloudinary(req.file.path);
      res.status(200).json({
        success: true,
        data: result,
      });
    }
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ 
      success: false, 
      message: "Error uploading file: " + e.message 
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assest Id is required",
      });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message: "Assest deleted successfully from cloudinary",
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    console.log("Bulk upload request received:", req.files);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No files uploaded" 
      });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log("Cloudinary not configured, using local file paths");
      
      // Return local file info for development
      const results = req.files.map(file => ({
        url: `http://localhost:5000/uploads/${file.filename}`,
        public_id: file.filename,
        secure_url: `http://localhost:5000/uploads/${file.filename}`
      }));
      
      res.status(200).json({
        success: true,
        data: results,
      });
    } else {
      // Use Cloudinary if configured
      const uploadPromises = req.files.map((fileItem) =>
        uploadMediaToCloudinary(fileItem.path)
      );

      const results = await Promise.all(uploadPromises);

      res.status(200).json({
        success: true,
        data: results,
      });
    }
  } catch (event) {
    console.error("Bulk upload error:", event);
    res.status(500).json({ 
      success: false, 
      message: "Error in bulk uploading files: " + event.message 
    });
  }
});

module.exports = router;
