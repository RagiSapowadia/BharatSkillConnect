import { useEffect, useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function InstructorTimetable() {
  const { auth } = useContext(AuthContext);
  const { instructorCoursesList } = useContext(InstructorContext);
  const [liveSessions, setLiveSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    title: "",
    courseId: "",
    date: "",
    startTime: "",
    endTime: "",
    zoomOrAgoraLink: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchLiveSessions();
  }, []);

  const fetchLiveSessions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/live-sessions");
      if (response.data.success) {
        setLiveSessions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching live sessions:", error);
    }
  };

  const events = liveSessions
    .filter(session => instructorCoursesList.some(course => course._id === session.courseId))
    .map(session => ({
      id: session.sessionId,
      title: session.title,
      start: new Date(`${session.date}T${session.startTime}`),
      end: new Date(`${session.date}T${session.endTime}`),
      resource: session,
    }));

  const handleSelectSlot = ({ start, end }) => {
    setNewSession({
      ...newSession,
      date: moment(start).format("YYYY-MM-DD"),
      startTime: moment(start).format("HH:mm"),
      endTime: moment(end).format("HH:mm"),
    });
    setIsDialogOpen(true);
  };

  const handleCreateSession = async () => {
    try {
      const sessionData = {
        ...newSession,
        teacherId: auth.user._id,
        sessionId: Date.now().toString(),
      };
      const response = await axios.post("http://localhost:5000/live-sessions", sessionData);
      if (response.data.success) {
        setLiveSessions([...liveSessions, response.data.data]);
        setNewSession({
          title: "",
          courseId: "",
          date: "",
          startTime: "",
          endTime: "",
          zoomOrAgoraLink: "",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating live session:", error);
    }
  };

  const handleSelectEvent = (event) => {
    const session = event.resource;
    // Open dialog to edit or view session details
    setNewSession({
      title: session.title,
      courseId: session.courseId,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      zoomOrAgoraLink: session.zoomOrAgoraLink,
    });
    setIsDialogOpen(true);
  };

  const eventStyleGetter = (event) => {
    const now = new Date();
    const sessionStart = event.start;
    const sessionEnd = event.end;

    let backgroundColor = "#3174ad"; // default blue

    if (now >= sessionStart && now <= sessionEnd) {
      backgroundColor = "#28a745"; // green for live
    } else if (now > sessionEnd) {
      backgroundColor = "#6c757d"; // gray for completed
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Live Session Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "500px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              views={["month", "week", "day"]}
              defaultView="month"
              selectable
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Live Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={newSession.endTime}
                onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="link">Meeting Link</Label>
              <Input
                id="link"
                value={newSession.zoomOrAgoraLink}
                onChange={(e) => setNewSession({ ...newSession, zoomOrAgoraLink: e.target.value })}
                placeholder="Zoom/Agora link"
              />
            </div>
            <Button onClick={handleCreateSession} className="w-full">
              Schedule Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InstructorTimetable;
