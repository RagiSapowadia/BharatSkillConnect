import { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import { AuthContext } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/api/axiosInstance";

function LiveSessionsSection() {
  const { auth } = useContext(AuthContext);
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth?.authenticate || !auth?.user) return;

    const fetchLiveSessions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/live-sessions');
        if (response.data.success) {
          setLiveSessions(response.data.data || []);
        } else {
          setLiveSessions([]);
        }
      } catch (error) {
        console.error('Failed to fetch live sessions:', error);
        setError("Failed to load sessions");
        setLiveSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveSessions();
  }, [auth]);

  const handleJoinSession = (session) => {
    // Open Zoom meeting link
    if (session.zoomOrAgoraLink && session.zoomOrAgoraLink !== 'Zoom meeting link will be provided soon') {
      window.open(session.zoomOrAgoraLink, '_blank');
    } else {
      console.log("Join session:", session._id);
      alert('Zoom meeting link will be available closer to the session time.');
    }
  };

  // Registration handled by enrollment flow elsewhere

  const handleViewAllSessions = () => {
    // Navigate to live sessions page
    window.location.href = '/student/live-sessions';
  };

  // Don't render anything if user is not authenticated
  if (!auth?.authenticate || !auth?.user) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Live Sessions</h2>
            <p className="text-xl text-muted-foreground">Join interactive sessions with expert instructors</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleViewAllSessions}
            className="hidden sm:flex"
            data-testid="button-view-all-sessions"
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Schedule
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <Skeleton className="h-48 w-full col-span-1 md:col-span-2 lg:col-span-3" />
          ) : error ? (
            <div className="col-span-full text-red-500">{error}</div>
          ) : liveSessions.length === 0 ? (
            <div className="col-span-full text-center text-lg">No live sessions found.</div>
          ) : (
            liveSessions.map((session) => (
              <Card key={session._id}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">
                        {session.courseId?.title?.charAt(0)?.toUpperCase() || 'C'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{session.courseId?.title || 'Course'}</div>
                      <div className="text-xs text-muted-foreground">Live Session</div>
                    </div>
                    <span className={`ml-auto px-2 py-1 rounded text-xs font-bold ${session.status === "live" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"}`}>
                      {session.status === "live" ? "LIVE" : "UPCOMING"}
                    </span>
                  </div>
                  <CardTitle className="text-lg mb-2">{session.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm mb-2 gap-4">
                    <span><Calendar className="inline mr-1 h-4 w-4" />
                      {new Date(session.date).toLocaleDateString()} at {session.startTime}
                    </span>
                    <span>⏱ {session.duration} mins</span>
                  </div>
                  <div className="flex items-center text-sm mb-2 gap-4">
                    <span>📚 {session.courseId?.title || 'Course'}</span>
                    <span>🎥 Zoom Meeting</span>
                  </div>
                  {session.status === "live" ? (
                    <Button className="w-full mt-2" onClick={() => handleJoinSession(session)}>
                      Join Live Session
                    </Button>
                  ) : (
                    <Button className="w-full mt-2" variant="outline" disabled>
                      Session Scheduled
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button onClick={handleViewAllSessions} data-testid="button-view-all-sessions-mobile">
            <Calendar className="mr-2 h-4 w-4" />
            View Schedule
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default LiveSessionsSection;
