const Course = require("../../models/Course");
const Enrollment = require("../../models/Enrollment");
const StudentCourses = require("../../models/StudentCourses");
const LiveSession = require("../../models/LiveSession");
const User = require("../../models/User");

/**
 * Get instructor dashboard statistics
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const getInstructorDashboardStats = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // Get all courses by the instructor
    const instructorCourses = await Course.find({ teacherId: instructorId });

    // Get all course IDs
    const courseIds = instructorCourses.map(course => course._id);

    // Get enrollments for instructor's courses
    const enrollments = await Enrollment.find({ 
      courseId: { $in: courseIds },
      paymentStatus: "success"
    });

    // Get student courses for instructor's courses
    const studentCourses = await StudentCourses.find({
      "courses.courseId": { $in: courseIds }
    });

    // Calculate total students (from both enrollment and student courses)
    const enrollmentStudents = enrollments.length;
    const studentCourseStudents = studentCourses.reduce((total, sc) => {
      return total + sc.courses.filter(c => courseIds.includes(c.courseId)).length;
    }, 0);
    const totalStudents = enrollmentStudents + studentCourseStudents;

    // Calculate total revenue
    const enrollmentRevenue = enrollments.reduce((sum, enrollment) => {
      const course = instructorCourses.find(c => c._id.toString() === enrollment.courseId.toString());
      return sum + (course ? (course.pricing || course.price || 0) : 0);
    }, 0);

    const studentCourseRevenue = studentCourses.reduce((sum, sc) => {
      return sum + sc.courses.reduce((courseSum, course) => {
        if (courseIds.includes(course.courseId)) {
          const instructorCourse = instructorCourses.find(c => c._id.toString() === course.courseId.toString());
          return courseSum + (instructorCourse ? (instructorCourse.pricing || instructorCourse.price || 0) : 0);
        }
        return courseSum;
      }, 0);
    }, 0);

    const totalRevenue = enrollmentRevenue + studentCourseRevenue;

    // Get live sessions for instructor's courses
    const liveSessions = await LiveSession.find({ 
      courseId: { $in: courseIds }
    });

    // Get recent enrollments (last 10)
    const recentEnrollments = await Enrollment.find({ 
      courseId: { $in: courseIds },
      paymentStatus: "success"
    })
    .populate('userId', 'name email')
    .populate('courseId', 'title')
    .sort({ enrolledAt: -1 })
    .limit(10);

    // Get upcoming live sessions
    const upcomingSessions = await LiveSession.find({ 
      courseId: { $in: courseIds },
      status: "upcoming"
    })
    .populate('courseId', 'title')
    .sort({ date: 1 })
    .limit(5);

    // Calculate monthly revenue for the last 6 months
    const monthlyRevenue = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
      
      const monthEnrollments = await Enrollment.find({
        courseId: { $in: courseIds },
        paymentStatus: "success",
        enrolledAt: { $gte: monthStart, $lte: monthEnd }
      });

      const monthRevenue = monthEnrollments.reduce((sum, enrollment) => {
        const course = instructorCourses.find(c => c._id.toString() === enrollment.courseId.toString());
        return sum + (course ? (course.pricing || course.price || 0) : 0);
      }, 0);

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue
      });
    }

    // Get course performance data
    const coursePerformance = instructorCourses.map(course => {
      const courseEnrollments = enrollments.filter(e => e.courseId.toString() === course._id.toString());
      const courseStudentCourses = studentCourses.reduce((total, sc) => {
        return total + sc.courses.filter(c => c.courseId.toString() === course._id.toString()).length;
      }, 0);
      
      return {
        courseId: course._id,
        title: course.title,
        totalStudents: courseEnrollments.length + courseStudentCourses,
        revenue: (courseEnrollments.length + courseStudentCourses) * (course.pricing || course.price || 0),
        rating: course.rating || 4.5,
        image: course.image
      };
    }).sort((a, b) => b.revenue - a.revenue);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalRevenue,
          totalCourses: instructorCourses.length,
          totalLiveSessions: liveSessions.length,
          monthlyRevenue,
          coursePerformance
        },
        recentEnrollments,
        upcomingSessions
      }
    });

  } catch (error) {
    console.error("Error fetching instructor dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};

/**
 * Get instructor's courses with detailed analytics
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const getInstructorCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Get instructor's courses with pagination
    const courses = await Course.find({ teacherId: instructorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const totalCourses = await Course.countDocuments({ teacherId: instructorId });

    // Get analytics for each course
    const coursesWithAnalytics = await Promise.all(
      courses.map(async (course) => {
        // Get enrollments for this course
        const enrollments = await Enrollment.find({ 
          courseId: course._id,
          paymentStatus: "success"
        });

        // Get student courses for this course
        const studentCourses = await StudentCourses.find({
          "courses.courseId": course._id
        });

        const totalStudents = enrollments.length + studentCourses.reduce((total, sc) => {
          return total + sc.courses.filter(c => c.courseId.toString() === course._id.toString()).length;
        }, 0);

        const revenue = totalStudents * (course.pricing || course.price || 0);

        // Get live sessions for this course
        const liveSessions = await LiveSession.find({ courseId: course._id });

        return {
          ...course.toObject(),
          analytics: {
            totalStudents,
            revenue,
            liveSessions: liveSessions.length,
            rating: course.rating || 4.5
          }
        };
      })
    );

    const totalPages = Math.ceil(totalCourses / limitNum);

    res.status(200).json({
      success: true,
      data: coursesWithAnalytics,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCourses,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      }
    });

  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructor courses"
    });
  }
};

module.exports = {
  getInstructorDashboardStats,
  getInstructorCourses
};
