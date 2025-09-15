// server/routes/liveSessionRoutes.js
const express = require('express');
const LiveSession = require('../models/liveSessionModel');
const User = require('../models/userModel');
const { createZoomMeeting } = require('../helpers/zoomHelper');

const router = express.Router();

// Route to create a new live session
router.post('/create', async (req, res) => {
    try {
        const { courseId, title, date, startTime, duration, teacherId } = req.body;

        // Find the teacher's email to be the Zoom host
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ message: 'Teacher not found or is not a teacher.' });
        }

        // Combine date and time to create a valid ISO 8601 format
        const startDateTime = new Date(`${date}T${startTime}:00.000+05:30`); // Example timezone for India

        // Use the Zoom helper to create the meeting and get the links
        const zoomLinks = await createZoomMeeting({
            topic: title,
            startTime: startDateTime.toISOString(),
            duration: parseInt(duration),
            hostEmail: teacher.email
        });

        // Create a new live session document with the generated Zoom links
        const newLiveSession = await LiveSession.create({
            courseId,
            title,
            date,
            startTime,
            duration,
            teacherId,
            zoomOrAgoraLink: zoomLinks.joinUrl, // Save the join URL for students
            zoomStartLink: zoomLinks.startUrl, // Save the start URL for the teacher
        });

        res.status(201).json({
            message: 'Live session created successfully',
            liveSession: newLiveSession,
        });

    } catch (error) {
        console.error('Error creating live session:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add other live session routes as needed (get, update, delete, etc.)
// ...

module.exports = router;
