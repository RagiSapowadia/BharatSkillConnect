const Enrollment = require("../../models/Enrollment");
const Course = require("../../models/Course");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const enrollments = await Enrollment.find({
      userId: studentId,
      paymentStatus: "success",
    });

    const courseIds = enrollments.map(enrollment => enrollment.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { getCoursesByStudentId };
