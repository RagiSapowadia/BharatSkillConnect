const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  lessonId: String,
  type: { type: String, enum: ["video", "pdf"] },
  title: String,
  fileUrl: String,
  duration: Number, // in minutes
});

const ModuleSchema = new mongoose.Schema({
  moduleId: String,
  title: String,
  lessons: [LessonSchema],
});

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number, // legacy field
  pricing: Number, // used by client/controllers
  subtitle: String,
  objectives: String, // comma separated string for now
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  thumbnailUrl: String, // legacy field
  image: String, // used by client
  category: String,
  level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  primaryLanguage: String,
  modules: [ModuleSchema],
  isPublished: Boolean,
  curriculum: [
    new mongoose.Schema({
      title: String,
      videoUrl: String,
      freePreview: { type: Boolean, default: false },
      public_id: String,
      type: { type: String, enum: ["video", "pdf"], default: "video" },
      fileUrl: String,
      duration: Number,
    }, { _id: false })
  ],
  date: { type: Date, default: Date.now },
  students: [
    new mongoose.Schema({
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      studentName: String,
      studentEmail: String,
      paidAmount: Number,
    }, { _id: false })
  ],
});

module.exports = mongoose.model("Course", CourseSchema);
