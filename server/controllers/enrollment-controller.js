const Enrollment = require("../models/Enrollment");

const createEnrollment = async (req, res) => {
  try {
    const enrollmentData = req.body;
    const newEnrollment = new Enrollment(enrollmentData);
    const savedEnrollment = await newEnrollment.save();

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: savedEnrollment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create enrollment",
    });
  }
};

const getEnrollmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const enrollments = await Enrollment.find({ userId });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
};

const updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { paymentStatus } = req.body;

    const enrollment = await Enrollment.findOneAndUpdate(
      { enrollmentId },
      { paymentStatus },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enrollment updated",
      data: enrollment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update enrollment",
    });
  }
};

module.exports = {
  createEnrollment,
  getEnrollmentsByUser,
  updateEnrollmentStatus,
};
