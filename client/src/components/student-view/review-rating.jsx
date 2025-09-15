import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "@/hooks/use-toast";

const ReviewRating = ({ courseId, courseTitle }) => {
  const { auth } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    review: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/reviews/course/${courseId}`);
      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setAverageRating(response.data.data.averageRating);
        setTotalReviews(response.data.data.pagination.totalReviews);
        
        // Check if user has already reviewed
        const userReviewExists = response.data.data.reviews.find(
          review => review.studentId._id === auth.user._id
        );
        setUserReview(userReviewExists || null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmitReview = async () => {
    if (newReview.rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/reviews/add", {
        courseId,
        rating: newReview.rating,
        review: newReview.review.trim(),
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Review submitted successfully",
        });
        setNewReview({ rating: 0, review: "" });
        setShowReviewForm(false);
        fetchReviews();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async () => {
    if (newReview.rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(`/reviews/${userReview._id}`, {
        rating: newReview.rating,
        review: newReview.review.trim(),
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Review updated successfully",
        });
        setShowReviewForm(false);
        fetchReviews();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      const response = await axiosInstance.delete(`/reviews/${userReview._id}`);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Review deleted successfully",
        });
        setUserReview(null);
        setNewReview({ rating: 0, review: "" });
        fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange(star)}
            className={`${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } transition-transform`}
            disabled={readonly}
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Course Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </p>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-8">{star}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-2">
              {!userReview ? (
                <Button
                  onClick={() => {
                    setNewReview({ rating: 0, review: "" });
                    setShowReviewForm(true);
                  }}
                  className="w-full"
                >
                  Write a Review
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Your Review:</p>
                  <div className="flex items-center gap-2">
                    {renderStars(userReview.rating)}
                    <span className="text-sm font-medium">{userReview.rating}/5</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNewReview({
                          rating: userReview.rating,
                          review: userReview.review || "",
                        });
                        setShowReviewForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDeleteReview}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {userReview ? "Update Your Review" : "Write a Review"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rating</Label>
              <StarRating
                rating={newReview.rating}
                onRatingChange={handleRatingChange}
              />
            </div>
            <div>
              <Label htmlFor="review">Review (Optional)</Label>
              <Textarea
                id="review"
                value={newReview.review}
                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                placeholder="Share your thoughts about this course..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={userReview ? handleUpdateReview : handleSubmitReview}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : userReview ? "Update Review" : "Submit Review"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setNewReview({ rating: 0, review: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Recent Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.studentId.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.review && (
                    <p className="text-gray-700 mt-2">{review.review}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewRating;
