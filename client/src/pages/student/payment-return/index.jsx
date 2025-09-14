import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/api/axiosInstance";

export default function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // Stripe payment
      axiosInstance
        .get(`/payments/stripe/checkout-success?session_id=${sessionId}`)
        .then((res) => {
          if (res.data.success) {
            toast.success("Payment successful! You now have access to the course.");
            navigate(`/course-details/${res.data.courseId}`);
          } else {
            toast.error("Payment verification failed.");
            navigate("/courses");
          }
        })
      
        .catch(() => {
          toast.error("Payment verification failed.");
          navigate("/courses");
        });
    } else {
      // No session_id, fallback
      navigate("/courses");
    }
  }, [searchParams, navigate]);

  return <div className="p-8 text-center text-lg">Processing your payment...</div>;
}