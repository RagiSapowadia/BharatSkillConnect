const LiveSession = require('../models/LiveSession');
const Course = require('../models/Course');
const User = require('../models/User');
const { createZoomMeeting } = require('../helpers/zoomHelper');

// Get all live sessions
exports.getAllLiveSessions = async (req, res) => {
  try {
    const sessions = await LiveSession.find().populate('courseId', 'title').sort({ date: 1, startTime: 1 });
    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get live sessions.' });
  }
};

// Create a new live session
exports.createLiveSession = async (req, res) => {
  try {
    const { courseId, teacherId, title, date, startTime, duration } = req.body;

    // Get teacher details for Zoom meeting
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    // Calculate endTime from startTime and duration for overlap check
    const [startHours, startMinutes] = startTime.split(':');
    const sessionDate = new Date(date);
    const startDateTime = new Date(sessionDate);
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
    const endTime2 = endDateTime.toTimeString().slice(0, 5); // HH:MM format

    // Check for overlapping sessions for the teacher
    const overlappingSession = await LiveSession.findOne({
      teacherId,
      date: sessionDate,
      $or: [
        { startTime: { $lt: endTime2, $gte: startTime } },
        { endTime: { $lte: endTime2, $gt: startTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime2 } }
      ]
    });

    if (overlappingSession) {
      return res.status(400).json({ message: 'Overlapping live session exists for this teacher.' });
    }

    // Create Zoom meeting automatically
    let zoomJoinUrl = null;
    let zoomStartUrl = null;

    try {
      // Combine date and startTime for Zoom meeting
      const [hours, minutes] = startTime.split(':');
      const meetingDateTime = new Date(sessionDate);
      meetingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const zoomMeeting = await createZoomMeeting({
        topic: title,
        startTime: meetingDateTime.toISOString(),
        duration: duration,
        hostEmail: teacher.email
      });

      zoomJoinUrl = zoomMeeting.joinUrl;
      zoomStartUrl = zoomMeeting.startUrl;
    } catch (zoomError) {
      console.error('Failed to create Zoom meeting:', zoomError);
      // Continue without Zoom integration if it fails
    }

    // Calculate endTime from startTime and duration
    const [startHours2, startMinutes2] = startTime.split(':');
    const startDateTime2 = new Date(sessionDate);
    startDateTime2.setHours(parseInt(startHours2), parseInt(startMinutes2), 0, 0);
    const endDateTime2 = new Date(startDateTime2.getTime() + duration * 60000);
    const endTime = endDateTime2.toTimeString().slice(0, 5); // HH:MM format

    const liveSession = new LiveSession({
      courseId,
      teacherId,
      title,
      date: sessionDate,
      startTime,
      duration,
      zoomOrAgoraLink: zoomJoinUrl || 'Zoom meeting link will be provided soon',
      zoomStartLink: zoomStartUrl || 'Instructor start link will be provided soon',
      status: 'upcoming',
    });

    await liveSession.save();

    res.status(201).json({
      success: true,
      data: liveSession,
      zoomCreated: !!zoomJoinUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create live session.' });
  }
};

// Get all live sessions for a course
exports.getLiveSessionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const sessions = await LiveSession.find({ courseId }).sort({ date: 1, startTime: 1 });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get live sessions.' });
  }
};

// Get upcoming live sessions for a student (enrolled courses)
exports.getUpcomingSessionsForStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    // Assuming Enrollment model exists and has userId and courseId
    const Enrollment = require('../models/Enrollment');
    const enrollments = await Enrollment.find({ userId });
    const courseIds = enrollments.map(e => e.courseId);

    const now = new Date();
    const sessions = await LiveSession.find({
      courseId: { $in: courseIds },
      date: { $gte: now },
      status: { $in: ['upcoming', 'live'] }
    }).sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get upcoming sessions.' });
  }
};

// Update live session status (e.g., to live or completed)
exports.updateLiveSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, recordingUrl } = req.body;

    const session = await LiveSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Live session not found.' });
    }

    session.status = status;
    if (recordingUrl) {
      session.recordingUrl = recordingUrl;
    }

    await session.save();

    res.json({ success: true, data: session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update live session.' });
  }
};
