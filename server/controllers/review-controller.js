const Review = require("../models/Review");
const Course = require("../models/Course");
const User = require("../models/User");

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body;
    const studentId = req.user._id;

    // Check if user is enrolled in the course
    const Enrollment = require("../models/Enrollment");
    const enrollment = await Enrollment.findOne({ userId: studentId, courseId });
    
    if (!enrollment) {
      return res.status(403).json({ 
        success: false, 
        message: "You must be enrolled in this course to review it" 
      });
    }

    // Check if user has already reviewed this course
    const existingReview = await Review.findOne({ courseId, studentId });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already reviewed this course" 
      });
    }

    const newReview = new Review({
      courseId,
      studentId,
      rating,
      review,
    });

    await newReview.save();

    // Update course average rating
    await updateCourseRating(courseId);

    // Populate user details
    await newReview.populate("studentId", "name email");

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add review" 
    });
  }
};

// Get reviews for a course
exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ courseId })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments({ courseId });
    const averageRating = await Review.aggregate([
      { $match: { courseId: courseId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
        },
        averageRating: averageRating[0]?.avgRating || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch reviews" 
    });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;
    const studentId = req.user._id;

    const existingReview = await Review.findOne({ _id: reviewId, studentId });
    if (!existingReview) {
      return res.status(404).json({ 
        success: false, 
        message: "Review not found or unauthorized" 
      });
    }

    existingReview.rating = rating;
    existingReview.review = review;
    await existingReview.save();

    // Update course average rating
    await updateCourseRating(existingReview.courseId);

    res.json({
      success: true,
      data: existingReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update review" 
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const studentId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, studentId });
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: "Review not found or unauthorized" 
      });
    }

    const courseId = review.courseId;
    await Review.findByIdAndDelete(reviewId);

    // Update course average rating
    await updateCourseRating(courseId);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete review" 
    });
  }
};

// Helper function to update course average rating
async function updateCourseRating(courseId) {
  try {
    const averageRating = await Review.aggregate([
      { $match: { courseId: courseId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    await Course.findByIdAndUpdate(courseId, {
      averageRating: averageRating[0]?.avgRating || 0,
      totalReviews: await Review.countDocuments({ courseId })
    });
  } catch (error) {
    console.error("Error updating course rating:", error);
  }
}
