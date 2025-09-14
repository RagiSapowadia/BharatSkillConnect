const mongoose = require("mongoose");
const LiveSession = require("../models/LiveSession");

const liveSessions = [
  {
    courseId: "course1", // This will be replaced with actual course ID after seeding courses
    teacherId: "instructor1",
    title: "Introduction to Web Development - Live Q&A",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    startTime: "14:00",
    endTime: "15:30",
    zoomOrAgoraLink: "https://zoom.us/j/123456789",
    status: "upcoming",
  },
  {
    courseId: "course1",
    teacherId: "instructor1",
    title: "Advanced React Patterns",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    startTime: "16:00",
    endTime: "17:30",
    zoomOrAgoraLink: "https://zoom.us/j/987654321",
    status: "upcoming",
  },
  {
    courseId: "course2",
    teacherId: "instructor2",
    title: "Python Data Analysis Workshop",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    startTime: "10:00",
    endTime: "12:00",
    zoomOrAgoraLink: "https://zoom.us/j/456789123",
    status: "upcoming",
  },
  {
    courseId: "course2",
    teacherId: "instructor2",
    title: "Machine Learning Fundamentals",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    startTime: "15:00",
    endTime: "16:30",
    zoomOrAgoraLink: "https://zoom.us/j/789123456",
    status: "completed",
    recordingUrl: "https://example.com/recordings/ml-fundamentals.mp4",
  },
  {
    courseId: "course1",
    teacherId: "instructor1",
    title: "Live Coding Session - Building a Portfolio",
    date: new Date(), // Today
    startTime: "18:00",
    endTime: "19:30",
    zoomOrAgoraLink: "https://zoom.us/j/321654987",
    status: "live",
  },
];

async function seedLiveSessions() {
  try {
    require("dotenv").config();
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding live sessions");

    // First, get the actual course IDs from the database
    const Course = require("../models/Course");
    const courses = await Course.find({}, "_id title");

    if (courses.length === 0) {
      console.log("No courses found. Please seed courses first.");
      process.exit(1);
    }

    // Get user IDs for instructors
    const User = require("../models/User");
    const johnDoe = await User.findOne({ name: "John Doe" });
    const janeSmith = await User.findOne({ name: "Jane Smith" });

    if (!johnDoe || !janeSmith) {
      console.log("Instructors not found. Please seed users first.");
      process.exit(1);
    }

    // Update live sessions with actual course IDs and teacher IDs
    const updatedLiveSessions = liveSessions.map((session, index) => {
      const course = courses[index % courses.length]; // Cycle through available courses
      const teacherId = session.teacherId === "instructor1" ? johnDoe._id : janeSmith._id;
      return {
        ...session,
        courseId: course._id,
        teacherId: teacherId,
      };
    });

    await LiveSession.deleteMany({});
    console.log("Deleted existing live sessions");

    await LiveSession.insertMany(updatedLiveSessions);
    console.log("Seeded live sessions successfully");

    // Display the seeded sessions
    const seededSessions = await LiveSession.find().populate("courseId", "title");
    console.log("\nSeeded Live Sessions:");
    seededSessions.forEach((session, index) => {
      console.log(`${index + 1}. ${session.title}`);
      console.log(`   Course: ${session.courseId.title}`);
      console.log(`   Date: ${session.date.toDateString()}`);
      console.log(`   Time: ${session.startTime} - ${session.endTime}`);
      console.log(`   Status: ${session.status}`);
      console.log("");
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding live sessions:", error);
    process.exit(1);
  }
}

seedLiveSessions();
