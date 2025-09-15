const express = require("express");
const router = express.Router();
const { addReview, getCourseReviews, updateReview, deleteReview } = require("../controllers/review-controller");
const authenticate = require("../middleware/auth-middleware");

router.use(authenticate);

router.post("/add", addReview);
router.get("/course/:courseId", getCourseReviews);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;
