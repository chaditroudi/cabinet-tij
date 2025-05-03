import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { RootState } from "../config/store";
import LoadingPage from "../components/LoadingPage"; // Assuming you have a LoadingPage component
import { useEffect, useState } from "react";

export const GuestRoute = () => {
  const location = useLocation();
  const { isAuthenticated, loading, isInitialized } = useAppSelector(
    (state: RootState) => state.authentication
  );

  const [minimumDelayPassed, setMinimumDelayPassed] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setMinimumDelayPassed(true);
  //   }, 500); // 2 seconds
  //   return () => clearTimeout(timer);
  // }, []);

  if (!isInitialized || loading) {
    return <LoadingPage />;
  }

  // If not authenticated, allow access to the routes
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // If authenticated, redirect to the dashboard or the previous page
  const { from } = location.state || {
    from: { pathname: "/", search: location.search },
  };

  return <Navigate to={from} replace />;
};

export default GuestRoute;
