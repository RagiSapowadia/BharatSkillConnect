let Progress;
try {
  Progress = require("../models/Progress");
} catch {
  Progress = require("../models/Progress");
}

const getProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
    });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { completedLessons, percentage } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { userId, courseId },
      { completedLessons, percentage },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Progress updated",
      data: progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
    });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { lessonId } = req.body;

    const progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      const newProgress = new Progress({
        userId,
        courseId,
        completedLessons: [lessonId],
        percentage: 0, // Will be calculated later
      });
      await newProgress.save();
      return res.status(200).json({
        success: true,
        message: "Lesson marked complete",
        data: newProgress,
      });
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lesson marked complete",
      data: progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to mark lesson complete",
    });
  }
};

module.exports = {
  getProgress,
  updateProgress,
  markLessonComplete,
};
