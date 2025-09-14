import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useEffect, useState } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { AuthContext } from "@/context/auth-context";
import axiosInstance from "@/api/axiosInstance";

function InstructorLiveSessions() {
  const [liveSessions, setLiveSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    title: "",
    courseId: "",
    date: "",
    startTime: "",
    duration: 60,
  });
  const { instructorCoursesList } = useContext(InstructorContext);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchLiveSessions();
  }, []);

  const fetchLiveSessions = async () => {
    try {
      const response = await axiosInstance.get("/live-sessions");
      if (response.data.success) {
        setLiveSessions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching live sessions:", error);
    }
  };

  const handleCreateSession = async () => {
    try {
      const sessionData = {
        ...newSession,
        teacherId: auth.user._id,
      };
      const response = await axiosInstance.post("/live-sessions/create", sessionData);
      if (response.data && (response.data.success || response.status === 201)) {
        const created = response.data.data || response.data;
        setLiveSessions([...liveSessions, created]);
        setNewSession({ title: "", courseId: "", date: "", startTime: "", duration: 60 });
      }
    } catch (error) {
      console.error("Error creating live session:", error);
    }
  };

  const handleUpdateRecording = async (sessionId, recordingUrl) => {
    try {
      const response = await axiosInstance.put(`/live-sessions/${sessionId}/status`, {
        status: "completed",
        recordingUrl,
      });
      if (response.data.success) {
        setLiveSessions(liveSessions.map(session =>
          session._id === sessionId || session.sessionId === sessionId ? response.data.data : session
        ));
      }
    } catch (error) {
      console.error("Error updating recording:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Live Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newSession.title}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                placeholder="Session title"
              />
            </div>
            <div>
              <Label htmlFor="course">Course</Label>
              <Select
                value={newSession.courseId}
                onValueChange={(value) => setNewSession({ ...newSession, courseId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {instructorCoursesList.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newSession.date}
                onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={newSession.startTime}
                onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (mins)</Label>
              <Input
                id="duration"
                type="number"
                min={15}
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
              />
            </div>
          </div>
          <Button onClick={handleCreateSession} className="w-full">
            Schedule Session
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Live Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveSessions
              .filter(session => session.status === "upcoming")
              .map((session) => (
                <div key={session._id} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{session.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(session.date).toLocaleDateString()} | {session.startTime} ({session.duration} mins)
                  </p>
                  {session.zoomStartLink && (
                    <p className="text-sm mt-1">
                      {/^https?:\/\//.test(session.zoomStartLink) ? (
                        <>
                          Instructor start link: <a href={session.zoomStartLink} target="_blank" rel="noreferrer" className="text-blue-600">Open</a>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Instructor start link will be provided soon</span>
                      )}
                    </p>
                  )}
                  {session.zoomOrAgoraLink && (
                    <p className="text-sm">
                      {/^https?:\/\//.test(session.zoomOrAgoraLink) ? (
                        <>
                          Student join link: <a href={session.zoomOrAgoraLink} target="_blank" rel="noreferrer" className="text-blue-600">Open</a>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Student join link will be provided soon</span>
                      )}
                    </p>
                  )}
                  <div className="mt-2">
                    <Label htmlFor={`recording-${session._id}`}>Recording URL (after session)</Label>
                    <Input
                      id={`recording-${session._id}`}
                      placeholder="Upload recording URL"
                      onBlur={(e) => handleUpdateRecording(session._id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveSessions
              .filter(session => session.status === "completed")
              .map((session) => (
                <div key={session._id} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{session.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(session.date).toLocaleDateString()} | {session.startTime} ({session.duration} mins)
                  </p>
                  {session.recordingUrl && (
                    <p className="text-sm">
                      Recording: <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">View Recording</a>
                    </p>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorLiveSessions;
