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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function LiveSessionCard({ session }) {
  // Function to check if session should be live based on current time
  const isSessionLive = (session) => {
    try {
      const now = new Date();
      const sessionDate = new Date(session.date);
      
      // Handle time parsing more robustly
      const [hours, minutes] = session.startTime.split(":").map(Number);
      const sessionDateTime = new Date(sessionDate);
      sessionDateTime.setHours(hours, minutes, 0, 0);
      
      const endDateTime = new Date(sessionDateTime.getTime() + (session.duration || 60) * 60000);
      
      // Session is live if current time is between start and end time
      return now >= sessionDateTime && now <= endDateTime;
    } catch (error) {
      console.error("Error in isSessionLive:", error);
      return false;
    }
  };

  // Function to check if session can be joined (60 minutes after scheduled time)
  const canJoinSession = (session) => {
    try {
      const now = new Date();
      const sessionDate = new Date(session.date);
      const [hours, minutes] = session.startTime.split(":").map(Number);
      const sessionDateTime = new Date(sessionDate);
      sessionDateTime.setHours(hours, minutes, 0, 0);
      
      // Can join 60 minutes after scheduled start time
      const joinTime = new Date(sessionDateTime.getTime() + 60 * 60000);
      
      return now >= joinTime;
    } catch (error) {
      console.error("Error in canJoinSession:", error);
      return false;
    }
  };

  // Card style similar to featured section
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-bold text-lg text-green-700">
            {session.title?.charAt(0) || "S"}
          </div>
          <span className="font-medium text-gray-700">{session.courseTitle || session.title || "Live Session"}</span>
          <span className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${
            isSessionLive(session) ? "bg-red-100 text-red-700" : 
            canJoinSession(session) ? "bg-blue-100 text-blue-700" : 
            "bg-gray-100 text-gray-700"
          }`}>
            {isSessionLive(session) ? "LIVE" : 
             canJoinSession(session) ? "JOIN NOW" : 
             "UPCOMING"}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 leading-snug min-h-[40px] line-clamp-2 group-hover:text-blue-600 transition-colors">
          {session.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span> {new Date(session.date).toLocaleDateString()} {session.startTime && `at ${session.startTime}`}</span>
          <span> {session.duration || 60} mins</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span> {session.courseName || session.courseTitle || "Course"}</span>
          <span> Zoom Meeting</span>
        </div>
        <div className="pt-2">
          {isSessionLive(session) ? (
            <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
              <a href={session.zoomOrAgoraLink || "#"} target="_blank" rel="noopener noreferrer">Join Live Session</a>
            </Button>
          ) : canJoinSession(session) ? (
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <a href={session.zoomOrAgoraLink || "#"} target="_blank" rel="noopener noreferrer">Join Live Session</a>
            </Button>
          ) : (
            <Button disabled className="w-full">Session Scheduled</Button>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const [showAll, setShowAll] = useState(false);
  const upcomingSessions = liveSessions.filter(session => session.status === "upcoming" || session.status === "live");
  const hasMore = upcomingSessions.length > 4;

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
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) || 60 })}
                min="15"
                max="240"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateSession} className="w-full">
                Create Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSessions.slice(0, showAll ? upcomingSessions.length : 4).map((session) => (
              <LiveSessionCard key={session._id} session={session} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : `Show All (${upcomingSessions.length})`}
              </Button>
            </div>
          )}
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
