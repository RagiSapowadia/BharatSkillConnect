const express = require("express");
const router = express.Router();
const liveSessionController = require("../controllers/live-session-controller");
const authenticate = require("../middleware/auth-middleware");

router.get("/", liveSessionController.getAllLiveSessions);
router.get("/update-status", liveSessionController.updateSessionStatus);
router.post("/create", authenticate, liveSessionController.createLiveSession);
router.get("/course/:courseId", authenticate, liveSessionController.getLiveSessionsByCourse);
router.put("/:sessionId/status", authenticate, liveSessionController.updateLiveSessionStatus);
router.get("/upcoming/:userId", authenticate, liveSessionController.getUpcomingSessionsForStudent);

module.exports = router;
