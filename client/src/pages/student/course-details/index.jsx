import { AuthContext } from "@/context/auth-context";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { StudentContext } from "@/context/student-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import VideoPlayer from "@/components/video-player";
import { Button } from "@/components/ui/button";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentNotification, setShowPaymentNotification] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    try {
      setLoadingState(true);
      // Use the URL parameter id instead of context
      const courseId = id;
      
      if (!courseId) {
        console.error("No course ID provided");
        setStudentViewCourseDetails(null);
        return;
      }

      // Only check purchase info if authenticated
      if (auth?.authenticate && auth?.user?._id) {
        const checkCoursePurchaseInfoResponse = await checkCoursePurchaseInfoService(
          courseId,
          auth.user._id
        );
        if (checkCoursePurchaseInfoResponse?.success && checkCoursePurchaseInfoResponse?.data) {
          navigate(`/course-progress/${courseId}`);
          return;
        }
      }

      const response = await fetchStudentViewCourseDetailsService(courseId);
      if (response?.success) {
        setStudentViewCourseDetails(response?.data);
      } else {
        setStudentViewCourseDetails(null);
      }
    } catch (err) {
      console.error("Failed to load course details", err);
      setStudentViewCourseDetails(null);
    } finally {
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    // Check if user is authenticated
    if (!auth?.user?._id) {
      alert("Please log in to purchase this course");
      return;
    }

    // Check if course data is available
    if (!studentViewCourseDetails?._id || !studentViewCourseDetails?.pricing) {
      alert("Course information is not available. Please try again.");
      return;
    }

    // Prevent multiple clicks
    if (isProcessingPayment) {
      return;
    }

    setIsProcessingPayment(true);

    // Only Stripe logic
    try {
      console.log("Creating Stripe checkout session...", {
        amount: Number(studentViewCourseDetails?.pricing) || 0,
        courseId: studentViewCourseDetails?._id,
        courseTitle: studentViewCourseDetails?.title,
        userId: auth?.user?._id,
      });

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/payments/stripe/checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("accessToken"))}`
        },
        body: JSON.stringify({
          amount: Number(studentViewCourseDetails?.pricing) || 0,
          courseId: studentViewCourseDetails?._id,
          courseTitle: studentViewCourseDetails?.title,
          userId: auth?.user?._id,
        }),
      });
      
      const data = await res.json();
      console.log("Stripe response:", data);
      
      if (data?.success && data?.url) {
        // Open Stripe payment page in new tab
        window.open(data.url, '_blank', 'noopener,noreferrer');
        setShowPaymentNotification(true);
        // Auto-hide notification after 5 seconds
        setTimeout(() => setShowPaymentNotification(false), 5000);
        return;
      }
      
      alert(`Payment initialization failed: ${data.message || "Please try again."}`);
    } catch (e) {
      console.error("Stripe payment error:", e);
      alert("Payment error occurred. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (id) {
      fetchStudentViewCourseDetails();
    }
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
    }
  }, [location.pathname, setStudentViewCourseDetails]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-4xl">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">{studentViewCourseDetails?.title}</h1>
            <p className="text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed">{studentViewCourseDetails?.subtitle}</p>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-300">Created by</span>
                <span className="font-semibold">{studentViewCourseDetails?.instructorName || studentViewCourseDetails?.teacherId?.name || "Instructor"}</span>
              </div>
              {studentViewCourseDetails?.date && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Created on</span>
                  <span className="font-medium">{studentViewCourseDetails?.date.split("T")[0]}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-300" />
                <span className="font-medium">{studentViewCourseDetails?.primaryLanguage}</span>
              </div>
              {Array.isArray(studentViewCourseDetails?.students) && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">
                    {studentViewCourseDetails?.students.length} {studentViewCourseDetails?.students.length <= 1 ? "Student" : "Students"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <main className="flex-1 px-4 lg:px-0">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">What you&apos;ll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(studentViewCourseDetails?.objectives || "")
                  .split(",")
                  .filter(Boolean)
                  .map((objective, index) => (
                    <li key={`obj-${index}`} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{studentViewCourseDetails?.description}</p>
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                  <li
                    key={`cur-${index}`}
                    className={`${curriculumItem?.freePreview ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-60"} flex items-center gap-3 p-2 rounded-lg transition-colors`}
                    onClick={curriculumItem?.freePreview ? () => handleSetFreePreview(curriculumItem) : null}
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{curriculumItem?.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
        <aside className="w-full lg:w-96 xl:w-[420px] px-4 lg:px-0">
          <Card className="sticky top-4 shadow-lg">
            <CardContent className="p-6">
              <div className="aspect-video mb-6 rounded-lg overflow-hidden bg-gray-100">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum?.[getIndexOfFreePreviewUrl]?.videoUrl || ""
                      : ""
                  }
                  width="100%"
                  height="100%"
                />
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">₹{studentViewCourseDetails?.pricing}</span>
                  <span className="text-sm text-gray-500 line-through">₹{Math.round(studentViewCourseDetails?.pricing * 1.5)}</span>
                </div>
                <p className="text-sm text-green-600 font-medium mt-1">Limited time offer!</p>
              </div>
              <Button 
                onClick={handleCreatePayment} 
                className="w-full h-12 text-lg font-semibold"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Processing..." : "Enroll Now"}
              </Button>
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">30-day money-back guarantee</p>
              </div>
            </CardContent>
          </Card>
        </aside>
        </div>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[95vw] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="100%"
              height="100%"
            />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 mb-3">Available Previews:</h4>
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, idx) => (
                <div
                  key={`preview-${idx}`}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">{filteredItem?.title}</p>
                </div>
              ))}
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Notification */}
      {showPaymentNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-medium">Payment page opened in new tab!</span>
          <button 
            onClick={() => setShowPaymentNotification(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentViewCourseDetailsPage;
