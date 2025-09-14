import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import Logo from "@/assets/Logo.png";
import { AuthContext } from "@/context/auth-context";
import { logoutService } from "@/services";

function Header() {
  const navigate = useNavigate();
  const { auth, resetCredentials } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      // Call logout service to invalidate token on server
      await logoutService();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local authentication data
      sessionStorage.removeItem("accessToken");
      resetCredentials();
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b" style={{ backgroundColor: "#F5FFF7" }}>
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center hover:text-black">
          <img src={Logo} alt="Logo" className="h-12 w-auto mr-2" />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
          <Link to="/courses" className="hover:text-black">Courses</Link>
          <Link to="/student/live-sessions" className="hover:text-black">Live Sessions</Link>
          <Link to="/courses" className="hover:text-black">Categories</Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">

          <Link to="/student/profile" className="hover:text-black">My Profile</Link>
        {auth?.authenticate && auth?.user ? (
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Sign Out</Button>
        ) : (
          <Button onClick={() => navigate("/auth")}
            className="bg-purple-600 hover:bg-purple-700"
            style={{ backgroundColor: "#32B248" }}
          >
            Get Started
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
