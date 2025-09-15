import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import React, { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  // Debug logging
  console.log("CourseCurriculum render - curriculum data:", courseCurriculumFormData);
  console.log("CourseCurriculum render - upload progress:", mediaUploadProgress);

  // Test backend connectivity
  React.useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/health', { 
          method: 'GET',
          mode: 'cors'
        });
        console.log("Backend connectivity test:", response.status);
      } catch (error) {
        console.error("Backend connectivity test failed:", error);
      }
    };
    testBackend();
  }, []);

  function handleNewLecture() {
    console.log("Adding new lecture. Current data:", courseCurriculumFormData);
    const newLecture = {
      ...courseCurriculumInitialFormData[0],
    };
    const updatedData = [...courseCurriculumFormData, newLecture];
    console.log("New curriculum data:", updatedData);
    setCourseCurriculumFormData(updatedData);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    if (cpyCourseCurriculumFormData[currentIndex]) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        title: event.target.value,
      };
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    if (cpyCourseCurriculumFormData[currentIndex]) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        freePreview: currentValue,
      };
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const isPdf = selectedFile.type === "application/pdf";
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        console.log("=== STARTING FILE UPLOAD ===");
        console.log("Uploading file:", selectedFile.name, "Type:", selectedFile.type);
        console.log("File size:", selectedFile.size);
        console.log("Current index:", currentIndex);
        console.log("Current curriculum data:", courseCurriculumFormData);
        
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          formData,
          setMediaUploadProgressPercentage
        );
        console.log("=== UPLOAD RESPONSE ===");
        console.log("Upload response:", response);
        
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          if (cpyCourseCurriculumFormData[currentIndex]) {
            cpyCourseCurriculumFormData[currentIndex] = {
              ...cpyCourseCurriculumFormData[currentIndex],
              videoUrl: isPdf ? "" : response?.data?.url,
              public_id: response?.data?.public_id,
              type: isPdf ? "pdf" : "video",
              fileUrl: response?.data?.url,
            };
            setCourseCurriculumFormData(cpyCourseCurriculumFormData);
            setMediaUploadProgress(false);
            console.log("Updated curriculum data:", cpyCourseCurriculumFormData);
          }
        } else {
          console.error("Upload failed:", response);
          alert("Upload failed: " + (response.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload error: " + error.message);
        setMediaUploadProgress(false);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function isCourseCurriculumFormDataValid() {
    console.log("Validating curriculum data:", courseCurriculumFormData);
    
    // Allow adding lectures if there are no lectures yet, or if at least one lecture is complete
    if (courseCurriculumFormData.length === 0) {
      console.log("No lectures yet, allowing add lecture");
      return true;
    }
    
    // Check if at least one lecture has both title and video
    const isValid = courseCurriculumFormData.some((item, index) => {
      const hasTitle = item && item.title && item.title.trim() !== "";
      const hasVideo = item && ((item.videoUrl && item.videoUrl.trim() !== "") || 
                               (item.fileUrl && item.fileUrl.trim() !== ""));
      console.log(`Lecture ${index}: hasTitle=${hasTitle}, hasVideo=${hasVideo}`, item);
      return hasTitle && hasVideo;
    });
    
    console.log("Curriculum validation result:", isValid);
    return isValid;
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      console.log(response, "bulk");
      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormdata.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div key={index} className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title || ""}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview || false}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {courseCurriculumFormData[index]?.fileUrl || courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3">
                    {courseCurriculumFormData[index]?.type === "pdf" ? (
                      <a
                        href={courseCurriculumFormData[index]?.fileUrl || courseCurriculumFormData[index]?.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Preview PDF
                      </a>
                    ) : (
                      <VideoPlayer
                        url={courseCurriculumFormData[index]?.fileUrl || courseCurriculumFormData[index]?.videoUrl}
                        width="450px"
                        height="200px"
                      />
                    )}
                    <Button onClick={() => handleReplaceVideo(index)}>
                      Replace Media
                    </Button>
                    <Button
                      onClick={() => handleDeleteLecture(index)}
                      className="bg-red-900"
                    >
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*,application/pdf"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
