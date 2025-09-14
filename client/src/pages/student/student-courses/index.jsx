import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
    console.log(response);
  }
  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
            studentBoughtCoursesList.map((course) => (
              <Card key={course._id || course.courseId} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0 flex-grow">
                  <div className="relative">
                    <img
                      src={course?.image || course?.courseImage || 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Course+Image'}
                      alt={course?.title}
                      className="h-48 w-full object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Course+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        {course?.level || 'Course'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2 text-gray-900 line-clamp-2">{course?.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {course?.instructorName || 'Instructor'}
                    </p>
                    {course?.category && (
                      <p className="text-xs text-gray-500 mb-3">{course.category}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() =>
                      navigate(`/course-progress/${course?._id || course?.courseId}`)
                    }
                    className="flex-1 bg-gray-900 hover:bg-gray-800"
                  >
                    <Watch className="mr-2 h-4 w-4" />
                    Start Watching
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No courses found</div>
              <Button 
                onClick={() => navigate('/courses')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Courses
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentCoursesPage;
