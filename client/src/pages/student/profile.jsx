import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchStudentBoughtCoursesService, updateUserProfileService } from "@/services";

function StudentProfilePage() {
  const { auth, setAuth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: auth?.user?.name || "",
    email: auth?.user?.email || "",
    phone: auth?.user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: auth?.user?.name || "",
      email: auth?.user?.email || "",
      phone: auth?.user?.phone || "",
    });
  };

  // Fetch enrolled courses on component mount
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (auth?.user?._id) {
        try {
          setLoading(true);
          const response = await fetchStudentBoughtCoursesService(auth.user._id);
          if (response?.success) {
            setStudentBoughtCoursesList(response?.data || []);
          }
        } catch (error) {
          console.error("Error fetching enrolled courses:", error);
          toast({ title: "Failed to load enrolled courses", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();
  }, [auth?.user?._id, setStudentBoughtCoursesList, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Make API call to update profile
      const response = await updateUserProfileService(auth.user._id, {
        name: form.name,
        phone: form.phone
      });

      if (response?.success) {
        // Update local auth state with the updated user data (replace entire user object)
        setAuth((prev) => ({
          ...prev,
          user: response.data
        }));
        // Update sessionStorage if used
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem("auth", JSON.stringify({
            ...auth,
            user: response.data
          }));
        }
        // Update form state to match backend
        setForm({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || ""
        });
        toast({ title: "Profile updated successfully" });
        setEditMode(false);
      } else {
        throw new Error(response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ 
        title: "Failed to update profile", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-gray-700">Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editMode}
                className="text-gray-900"
              />
            </div>
            <div>
              <label className="block font-medium mb-2 text-gray-700">Email</label>
              <Input
                name="email"
                value={form.email}
                disabled
                className="bg-gray-100 text-gray-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-2 text-gray-700">Phone</label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Enter your phone number"
                className="text-gray-900"
              />
            </div>
            <div className="flex gap-3 mt-6">
              {editMode ? (
                <>
                  <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit} className="bg-gray-900 hover:bg-gray-800">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">My Courses</CardTitle>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.location.href = '/student-courses'}
            className="border-gray-300 hover:bg-gray-50"
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading your courses...</div>
              </div>
            ) : studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
              <div className="grid gap-4">
                {studentBoughtCoursesList.map((course) => (
                  <div key={course._id || course.courseId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600">{course.instructorName}</p>
                      {course.dateOfPurchase && (
                        <p className="text-xs text-gray-500 mt-1">
                          Enrolled on {new Date(course.dateOfPurchase).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => window.location.href = `/course-progress/${course.courseId || course._id}`}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue Learning
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-4">You have not enrolled in any courses yet.</div>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => window.location.href = '/courses'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Courses
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/student-courses'}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    My Courses
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentProfilePage;
