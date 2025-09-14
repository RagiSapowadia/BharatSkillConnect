const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

function flattenLessonIdsFromCourse(courseDoc) {
  if (Array.isArray(courseDoc?.modules) && courseDoc.modules.length > 0) {
    return courseDoc.modules.flatMap((m) => (m.lessons || []).map((l) => l.lessonId));
  }
  if (Array.isArray(courseDoc?.curriculum) && courseDoc.curriculum.length > 0) {
    return courseDoc.curriculum.map((_, idx) => `lecture-${idx + 1}`);
  }
  return [];
}

function computePercentage(progress, totalLessons) {
  if (!totalLessons || totalLessons <= 0) return 0;
  const completedCount = (progress.completedLessons || []).length;
  return Math.min(100, Math.round((completedCount / totalLessons) * 100));
}

//mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
        completedLessons: [lectureId],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      if (!progress.completedLessons?.includes(lectureId)) {
        progress.completedLessons = [...(progress.completedLessons || []), lectureId];
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const allLessonIds = flattenLessonIdsFromCourse(course);
    const totalLessons = allLessonIds.length;

    progress.percentage = computePercentage(progress, totalLessons);
    if (progress.percentage === 100) {
      progress.completed = true;
      progress.completionDate = new Date();
    }
    await progress.save();

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//get current course progress
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Check both StudentCourses and Enrollment models for course purchase
    const studentPurchasedCourses = await StudentCourses.findOne({ userId });
    const enrollment = await require("../../models/Enrollment").findOne({
      userId,
      courseId,
      paymentStatus: "success"
    });

    const isCurrentCoursePurchasedByCurrentUserOrNot =
      (studentPurchasedCourses?.courses?.findIndex(
        (item) => item.courseId === courseId
      ) > -1) || !!enrollment;

    if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchased: false,
        },
        message: "You need to purchase this course to access it.",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    const courseDetails = await Course.findById(courseId);
    const allLessonIds = flattenLessonIdsFromCourse(courseDetails || {});
    const totalLessons = allLessonIds.length;

    if (!currentUserCourseProgress || currentUserCourseProgress?.lecturesProgress?.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails,
          progress: [],
          isPurchased: true,
          percentage: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
        percentage: computePercentage(currentUserCourseProgress, totalLessons),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//reset course progress

const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
};
