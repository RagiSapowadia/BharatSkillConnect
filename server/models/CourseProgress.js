const mongoose = require("mongoose");

const LectureProgressSchema = new mongoose.Schema({
  lectureId: String,
  viewed: Boolean,
  dateViewed: Date,
});

const CourseProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  completed: Boolean,
  completionDate: Date,
  lecturesProgress: [LectureProgressSchema],
  completedLessons: [String],
  percentage: { type: Number, default: 0 },
});

module.exports = mongoose.model("CourseProgress", CourseProgressSchema);
