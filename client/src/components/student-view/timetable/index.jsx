import { useEffect, useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { AuthContext } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function StudentTimetable() {
  const { auth } = useContext(AuthContext);
  const { toast } = useToast();
  const [liveSessions, setLiveSessions] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchEnrollments();
    fetchLiveSessions();
  }, []);

  const enrolledCourseIds = enrollments.map(enrollment => enrollment.courseId);

  const events = liveSessions
    .filter(session => enrolledCourseIds.includes(session.courseId))
    .map(session => ({
      id: session.sessionId,
      title: session.title,
      start: new Date(`${session.date}T${session.startTime}`),
      end: new Date(`${session.date}T${session.endTime}`),
      resource: session,
    }));

  useEffect(() => {
    const checkForNotifications = () => {
      const now = new Date();
      events.forEach(event => {
        const sessionStart = event.start;
        const timeDiff = sessionStart - now;
        const minutesDiff = timeDiff / (1000 * 60);

        if (minutesDiff > 0 && minutesDiff <= 15) {
          toast({
            title: "Live Session Reminder",
            description: `Live session "${event.title}" starts in ${Math.round(minutesDiff)} minutes!`,
          });
        }
      });
    };

    const interval = setInterval(checkForNotifications, 60000); // Check every minute
    checkForNotifications(); // Check immediately

    return () => clearInterval(interval);
  }, [events]);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/enrollments/user/${auth.user._id}`);
      if (response.data.success) {
        setEnrollments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

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

  const handleSelectEvent = (event) => {
    const session = event.resource;
    const now = new Date();
    const sessionStart = new Date(`${session.date}T${session.startTime}`);
    const sessionEnd = new Date(`${session.date}T${session.endTime}`);

    if (now >= sessionStart && now <= sessionEnd) {
      window.open(session.zoomOrAgoraLink, "_blank");
    } else {
      alert("This session is not currently live.");
    }
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
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              views={["month", "week", "day"]}
              defaultView="month"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events
              .filter(event => event.start > new Date())
              .sort((a, b) => a.start - b.start)
              .map((event) => (
                <div key={event.id} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {moment(event.start).format("MMMM Do YYYY, h:mm a")} - {moment(event.end).format("h:mm a")}
                  </p>
                  <Button
                    onClick={() => handleSelectEvent(event)}
                    className="mt-2"
                    disabled={new Date() < event.start || new Date() > event.end}
                  >
                    {new Date() >= event.start && new Date() <= event.end ? "Join Now" : "Not Live Yet"}
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentTimetable;
