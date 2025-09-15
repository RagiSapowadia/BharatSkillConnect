const express = require("express");
const router = express.Router();
const { getInstructorDashboardStats, getInstructorCourses } = require("../../controllers/instructor-controller/dashboard-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");

// Get instructor dashboard statistics
router.get("/dashboard/:instructorId", authenticateMiddleware, getInstructorDashboardStats);

// Get instructor's courses with analytics
router.get("/courses/:instructorId", authenticateMiddleware, getInstructorCourses);

module.exports = router;
