const express = require('express');
const router = express.Router();
const liveSessionController = require('../controllers/live-session-controller');
const authenticate = require('../middleware/auth-middleware');

// Get all live sessions (public - no auth required)
router.get('/', liveSessionController.getAllLiveSessions);

// Instructor routes (require authentication)
router.post('/create', authenticate, liveSessionController.createLiveSession);
router.get('/course/:courseId', authenticate, liveSessionController.getLiveSessionsByCourse);
router.put('/:sessionId/status', authenticate, liveSessionController.updateLiveSessionStatus);

// Student routes (require authentication)
router.get('/upcoming/:userId', authenticate, liveSessionController.getUpcomingSessionsForStudent);

module.exports = router;
