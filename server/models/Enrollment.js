const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  enrollmentId: String,
  userId: String,
  courseId: String,
  paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  enrolledAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
