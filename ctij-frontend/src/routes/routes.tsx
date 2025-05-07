import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import PrivateRoute from "../middleware/PrivateRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import ErrorPage from "../pages/error/ErrorPage";
import { initializeAuth } from "../services/reducers/authentication";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Logout from "../pages/auth/Logout";
import GuestRoute from "../middleware/GuestRoute";
import { Home, Search } from "@/pages/User/Index";
import AdminLayout from "@/layouts/AdminLayout";
import UserLayout from "@/layouts/UserLayout";
import { Traducteurs } from "@/pages/Admin/Index";
export default function AppRoutes() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  return (
    <>
      <Routes location={location}>
        <Route element={<GuestRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
          </Route>
        </Route>
        <Route element={<UserLayout  />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<UserLayout pd />}>
          <Route path="/recherche" element={<Search />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/traducteurs" element={<Traducteurs />} />
          </Route>
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      {/* </CSSTransition>
      </TransitionGroup> */}
    </>
  );
}
