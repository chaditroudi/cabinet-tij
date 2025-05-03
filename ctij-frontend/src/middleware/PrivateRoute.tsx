import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { RootState } from "../config/store";
import LoadingPage from "../components/LoadingPage";

export const PrivateRoute = () => {
  const pageLocation = useLocation();
  const { isAuthenticated, isInitialized, loading } = useAppSelector(
    (state: RootState) => state.authentication
  );

  // If not initialized or still loading, show a loading page
  if (!isInitialized || loading) {
    return <LoadingPage/>; // Or you can use a LoadingPage component
  }

  // If authenticated, render the child routes (Outlet)
  if (isAuthenticated) {
    return <Outlet />;
  }

  // If not authenticated, redirect to the login page
  return (
    <Navigate
      to={{
        pathname: "/",
        search: pageLocation.search, // Retain the query params from the current page
      }}
      replace
      state={{ from: pageLocation }} // Pass the current location for redirection after login
    />
  );
};

export default PrivateRoute;
