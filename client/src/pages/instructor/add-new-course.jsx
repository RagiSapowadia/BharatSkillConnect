import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  console.log(params);

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    console.log("=== VALIDATING FORM DATA ===");
    console.log("Landing form data:", courseLandingFormData);
    console.log("Curriculum form data:", courseCurriculumFormData);
    
    // Check if landing page has required fields
    const requiredLandingFields = ['title', 'category', 'level', 'description', 'pricing'];
    for (const key of requiredLandingFields) {
      if (isEmpty(courseLandingFormData[key])) {
        console.log(`Missing required landing field: ${key}`);
        return false;
      }
    }
    console.log("All required landing fields present");

    // Check if curriculum has at least one complete lecture
    if (courseCurriculumFormData.length === 0) {
      console.log("No curriculum lectures found");
      return false;
    }

    let hasCompleteLecture = false;
    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      // Check if lecture is complete (has title and video/file)
      if (
        item && 
        !isEmpty(item.title) &&
        (!isEmpty(item.videoUrl) || !isEmpty(item.fileUrl) || !isEmpty(item.public_id))
      ) {
        hasCompleteLecture = true;
        console.log("Found complete lecture:", item);
      }

      if (item && item.freePreview) {
        hasFreePreview = true; //found at least one free preview
        console.log("Found free preview lecture:", item);
      }
    }

    console.log(`hasCompleteLecture: ${hasCompleteLecture}, hasFreePreview: ${hasFreePreview}`);
    const isValid = hasCompleteLecture && hasFreePreview;
    console.log("Form validation result:", isValid);
    return isValid;
  }

  async function handleCreateCourse() {
    try {
      const courseFinalFormData = {
        teacherId: auth?.user?._id,
        instructorName: auth?.user?.name || auth?.user?.userName,
        date: new Date(),
        ...courseLandingFormData,
        students: [],
        curriculum: courseCurriculumFormData,
        isPublished: true,
      };

      console.log("Creating course with data:", courseFinalFormData);

      const response =
        currentEditedCourseId !== null
          ? await updateCourseByIdService(
              currentEditedCourseId,
              courseFinalFormData
            )
          : await addNewCourseService(courseFinalFormData);

      console.log("Course creation response:", response);

      if (response?.success) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate("/instructor");
        setCurrentEditedCourseId(null);
        alert("Course created successfully!");
      } else {
        alert("Failed to create course: " + (response?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course: " + error.message);
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      console.log(setCourseFormData, response?.data, "setCourseFormData");
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }

    console.log(response, "response");
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  console.log(params, currentEditedCourseId, "params");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          SUBMIT
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
