const Message = require("../models/Message");
const User = require("../models/User");
const Course = require("../models/Course");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, courseId, message, messageType = "text" } = req.body;
    const senderId = req.user._id;

    // Verify both users are enrolled in the course
    const Enrollment = require("../models/Enrollment");
    const senderEnrollment = await Enrollment.findOne({ userId: senderId, courseId });
    const receiverEnrollment = await Enrollment.findOne({ userId: receiverId, courseId });

    if (!senderEnrollment || !receiverEnrollment) {
      return res.status(403).json({ 
        success: false, 
        message: "Both users must be enrolled in the course to send messages" 
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      courseId,
      message,
      messageType,
    });

    await newMessage.save();

    // Populate sender and receiver details
    await newMessage.populate("senderId", "name email");
    await newMessage.populate("receiverId", "name email");

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message" 
    });
  }
};

// Get messages for a course
exports.getCourseMessages = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Verify user is enrolled in the course
    const Enrollment = require("../models/Enrollment");
    const enrollment = await Enrollment.findOne({ userId, courseId });
    
    if (!enrollment) {
      return res.status(403).json({ 
        success: false, 
        message: "User not enrolled in this course" 
      });
    }

    const messages = await Message.find({ courseId })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch messages" 
    });
  }
};

// Get conversations for a user
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all courses user is enrolled in
    const Enrollment = require("../models/Enrollment");
    const enrollments = await Enrollment.find({ userId }).populate("courseId", "title");

    const courseIds = enrollments.map(e => e.courseId._id);

    // Get all messages for these courses
    const messages = await Message.find({ 
      courseId: { $in: courseIds },
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    // Group messages by course
    const conversations = {};
    messages.forEach(message => {
      const courseId = message.courseId._id.toString();
      if (!conversations[courseId]) {
        conversations[courseId] = {
          course: message.courseId,
          messages: [],
          unreadCount: 0
        };
      }
      conversations[courseId].messages.push(message);
      if (!message.isRead && message.receiverId._id.toString() === userId) {
        conversations[courseId].unreadCount++;
      }
    });

    res.json({
      success: true,
      data: Object.values(conversations),
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch conversations" 
    });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Message not found" 
      });
    }

    if (message.receiverId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized to mark this message as read" 
      });
    }

    message.isRead = true;
    await message.save();

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to mark message as read" 
    });
  }
};
