const express = require("express");
const {
  getProgress,
  updateProgress,
  markLessonComplete,
} = require("../controllers/progress-controller");

const router = express.Router();

// Get progress for a user and course
router.get("/:userId/:courseId", getProgress);

// Update progress
router.put("/:userId/:courseId", updateProgress);

// Mark lesson as complete
router.post("/:userId/:courseId/complete", markLessonComplete);

module.exports = router;
