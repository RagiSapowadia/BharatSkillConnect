const express = require("express");
const {
  createEnrollment,
  getEnrollmentsByUser,
  updateEnrollmentStatus,
} = require("../controllers/enrollment-controller");

const router = express.Router();

// Create a new enrollment
router.post("/", createEnrollment);

// Get enrollments for a user
router.get("/user/:userId", getEnrollmentsByUser);

// Update enrollment status
router.put("/:enrollmentId", updateEnrollmentStatus);

module.exports = router;
