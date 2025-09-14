import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import LandingInfoSections from "@/components/LandingInfoSections";
import HeroSection from "@/components/hero-section";
import CategorySection from "@/components/category-section";
import FeaturedCoursesSection from "@/components/featured-courses";
import LiveSessionsSection from "@/components/student-view/live-sessions";
// import any other sections you want here

function StudentHomePage() {
  const { auth } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <CategorySection />
     
      {/* ...other sections for everyone... */}

      {/* Show different sections based on authentication */}
      {auth?.authenticate && auth?.user ? (
        // Authenticated users see live sessions
        <LiveSessionsSection />
      ) : (
        // Non-authenticated users see info sections
        <LandingInfoSections />
      )}
       <FeaturedCoursesSection />
    </div>
  );
}

export default StudentHomePage;
