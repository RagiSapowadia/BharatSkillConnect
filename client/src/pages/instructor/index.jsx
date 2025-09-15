import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import InstructorLiveSessions from "@/components/instructor-view/live-sessions";
import InstructorProfile from "@/components/instructor-view/profile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut, User, Video } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/Logo.png";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);
  const navigate = useNavigate();

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
      onClick: () => setActiveTab("dashboard"),
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
      onClick: () => setActiveTab("courses"),
    },
    {
      icon: Video,
      label: "Live Sessions",
      value: "live-sessions",
      component: <InstructorLiveSessions />,
      onClick: () => setActiveTab("live-sessions"),
    },
    {
      icon: User,
      label: "My Profile",
      value: "profile",
      component: <InstructorProfile />,
      onClick: () => setActiveTab("profile"),
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
      onClick: () => {
        resetCredentials();
        sessionStorage.clear();
        navigate("/");
      },
    },
  ];

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="flex items-center justify-center py-4 border-b">
          <img src={Logo} alt="Logo" className="h-14 w-auto" />
        </div>
        <nav className="flex-1 px-4 py-6">
          {menuItems.map((menuItem) => (
            <Button
              key={menuItem.value}
              className="w-full justify-start mb-2"
              variant={activeTab === menuItem.value ? "secondary" : "ghost"}
              onClick={menuItem.onClick}
            >
              {menuItem.icon && <menuItem.icon className="mr-2 h-4 w-4" />}
              {menuItem.label}
            </Button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems
              .filter((item) => item.component !== null)
              .map((menuItem) => (
                <TabsContent key={menuItem.value} value={menuItem.value}>
                  {menuItem.component}
                </TabsContent>
              ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
