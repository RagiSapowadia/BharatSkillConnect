const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  progressId: String, // userId_courseId
  userId: String,
  courseId: String,
  completedLessons: [String], // array of lessonIds
  percentage: Number,
});

try {
  module.exports = mongoose.model("Progress", ProgressSchema);
} catch {
  module.exports = mongoose.model("Progress", ProgressSchema);
}
