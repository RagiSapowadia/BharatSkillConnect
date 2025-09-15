import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchStudentViewCourseListService } from "@/services";
import { useNavigate } from "react-router-dom";

// Static fallback courses defined outside the component to avoid re-creating
// the array on every render (which caused the effect to re-run endlessly)
const FALLBACK_COURSES = [
  {
    _id: "fallback1",
    title: "Web Development Fundamentals",
    instructorName: "John Doe",
    image: "/assets/web-dev.jpg",
    pricing: 99,
    level: "beginner",
    category: "Web Development"
  },
  {
    _id: "fallback2",
    title: "Data Science with Python",
    instructorName: "Jane Smith",
    image: "/assets/data-science.jpg",
    pricing: 120,
    level: "intermediate",
    category: "Data Science"
  },
  {
    _id: "fallback3",
    title: "Machine Learning A-Z",
    instructorName: "Jane Smith",
    image: "/assets/ml.jpg",
    pricing: 150,
    level: "advanced",
    category: "Machine Learning"
  },
  {
    _id: "fallback4",
    title: "React for Beginners",
    instructorName: "John Doe",
    image: "/assets/react.jpg",
    pricing: 89,
    level: "beginner",
    category: "Web Development"
  }
];

function FeaturedCoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading featured courses...");
      // Load only 4 courses for featured section
      const query = new URLSearchParams({
        limit: "4",
        page: "1"
      });
      console.log("Query parameters:", query.toString());
      const res = await fetchStudentViewCourseListService(query);
      console.log("API Response:", res);

      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        console.log("Courses loaded successfully:", res.data.length);
        setCourses(res.data);
      } else {
        console.log("No courses found from API, using fallback data");
        // Use fallback data if API fails or returns no courses
        setCourses(FALLBACK_COURSES);
      }
    } catch (error) {
      console.error("Error loading featured courses:", error);
      console.log("Using fallback data due to API error");
      // Use fallback data if API fails
      setCourses(FALLBACK_COURSES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  function handleCourseClick(courseId) {
    navigate(`/course/details/${courseId}`);
  }

  function handleViewAll() {
    navigate("/courses");
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Featured Courses</h2>
            <p className="text-xl text-gray-600">Handpicked courses from our expert instructors</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleViewAll} 
            className="hidden sm:flex border-gray-300 hover:bg-gray-100" 
            data-testid="button-view-all-courses"
          >
            View All Courses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border animate-pulse h-80">
                <div className="h-44 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            courses.map((course) => (
              <CourseCard
                key={course._id}
                id={course._id}
                title={course.title}
                instructor={course.instructorName || "Instructor"}
                instructorAvatar={course.instructorAvatar}
                thumbnail={course.image}
                price={Number(course.pricing) || 0}
                originalPrice={Number(course.pricing) ? Number(course.pricing) * 1.3 : 0}
                rating={course.rating || 4.8}
                studentCount={(course.students && course.students.length) || Math.floor(Math.random() * 100) + 1}
                duration={course.duration || `${Math.floor(Math.random() * 20) + 5} hours`}
                level={course.level || "beginner"}
                onClick={() => handleCourseClick(course._id)}
              />
            ))
          )}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button 
            onClick={handleViewAll} 
            className="bg-gray-900 hover:bg-gray-800 text-white"
            data-testid="button-view-all-courses-mobile"
          >
            View All Courses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCoursesSection;


