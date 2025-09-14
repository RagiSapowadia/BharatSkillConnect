import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";
import PropTypes from "prop-types";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  console.log(authenticated, user, "useruser");

  // If not authenticated and trying to access protected routes
  if (!authenticated && !location.pathname.includes("/auth") && !location.pathname.includes("/courses")) {
    return <Navigate to="/auth" />;
  }

  // If authenticated and trying to access auth page, redirect to appropriate dashboard
  if (authenticated && location.pathname.includes("/auth")) {
    if (user?.role === "teacher") {
      return <Navigate to="/instructor" />;
    }
    return <Navigate to="/" />;
  }

  // If authenticated student trying to access instructor routes
  if (
    authenticated &&
    user?.role !== "teacher" &&
    location.pathname.includes("instructor")
  ) {
    return <Navigate to="/" />;
  }

  // If authenticated instructor trying to access student routes
  if (
    authenticated &&
    user?.role === "teacher" &&
    location.pathname.includes("/student/")
  ) {
    return <Navigate to="/instructor" />;
  }

  return <Fragment>{element}</Fragment>;
}

RouteGuard.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  element: PropTypes.element.isRequired,
};

export default RouteGuard;
