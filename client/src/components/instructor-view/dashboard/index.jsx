import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IndianRupee, Users, Video, BookOpen } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

function InstructorDashboard({ listOfCourses }) {
  const [enrollments, setEnrollments] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);

  const fetchEnrollments = useCallback(async () => {
    try {
      // Fetch enrollments for instructor's courses
      const enrollmentPromises = listOfCourses.map(course =>
        axios.get(`http://localhost:5000/enrollments?courseId=${course._id}`)
      );
      const enrollmentResponses = await Promise.all(enrollmentPromises);
      const allEnrollments = enrollmentResponses.flatMap(response => response.data.data || []);
      setEnrollments(allEnrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  }, [listOfCourses]);

  const fetchLiveSessions = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/live-sessions");
      if (response.data.success) {
        // Filter sessions for instructor's courses
        const instructorSessions = response.data.data.filter(session =>
          listOfCourses.some(course => course._id === session.courseId)
        );
        setLiveSessions(instructorSessions);
      }
    } catch (error) {
      console.error("Error fetching live sessions:", error);
    }
  }, [listOfCourses]);

  useEffect(() => {
    fetchEnrollments();
    fetchLiveSessions();
  }, [fetchEnrollments, fetchLiveSessions]);

  function calculateStats() {
    const totalStudents = enrollments.length;
    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      const course = listOfCourses.find(c => c._id === enrollment.courseId);
      return sum + (course ? course.price : 0);
    }, 0);
    const totalCourses = listOfCourses.length;
    const totalLiveSessions = liveSessions.length;

    return {
      totalStudents,
      totalRevenue,
      totalCourses,
      totalLiveSessions,
    };
  }

  const stats = calculateStats();

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
    },
    {
      icon: IndianRupee,
      label: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
    },
    {
      icon: BookOpen,
      label: "Total Courses",
      value: stats.totalCourses,
    },
    {
      icon: Video,
      label: "Live Sessions",
      value: stats.totalLiveSessions,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {config.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.slice(0, 5).map((enrollment, index) => {
                    const course = listOfCourses.find(c => c._id === enrollment.courseId);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {course ? course.title : "Unknown Course"}
                        </TableCell>
                        <TableCell>
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            enrollment.paymentStatus === 'success'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {enrollment.paymentStatus}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
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
                .slice(0, 5)
                .map((session) => {
                  const course = listOfCourses.find(c => c._id === session.courseId);
                  return (
                    <div key={session.sessionId} className="border p-4 rounded-lg">
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="text-sm text-gray-600">
                        {course ? course.title : "Unknown Course"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.date).toLocaleDateString()} | {session.startTime} - {session.endTime}
                      </p>
                    </div>
                  );
                })}
              {liveSessions.filter(session => session.status === "upcoming").length === 0 && (
                <p className="text-gray-500">No upcoming sessions</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

InstructorDashboard.propTypes = {
  listOfCourses: PropTypes.array.isRequired,
};

export default InstructorDashboard;
