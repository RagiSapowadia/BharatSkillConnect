const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    duration: {
        type: Number, // Changed from endTime to duration
        required: true,
    },
    zoomOrAgoraLink: {
        type: String,
        required: true,
    },
    zoomStartLink: { // Added a new field for the instructor's Zoom link
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'completed'],
        default: 'upcoming',
    },
    recordingUrl: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('LiveSession', liveSessionSchema);
