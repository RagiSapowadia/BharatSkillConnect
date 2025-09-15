const express = require("express");
const router = express.Router();
const { sendMessage, getCourseMessages, getUserConversations, markAsRead } = require("../controllers/message-controller");
const authenticate = require("../middleware/auth-middleware");

// All routes require authentication
router.use(authenticate);

// Send a message
router.post("/send", sendMessage);

// Get messages for a specific course
router.get("/course/:courseId", getCourseMessages);

// Get all conversations for a user
router.get("/conversations", getUserConversations);

// Mark message as read
router.put("/read/:messageId", markAsRead);

module.exports = router;
