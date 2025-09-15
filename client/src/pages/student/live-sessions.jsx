import StudentLiveSessions from "@/components/student-view/live-sessions";
import StudentTimetable from "@/components/student-view/timetable";

function StudentLiveSessionsPage() {
  return (
    <div className="container mx-auto p-4">
      <StudentLiveSessions />
      <StudentTimetable />
    </div>
  );
}

export default StudentLiveSessionsPage;
