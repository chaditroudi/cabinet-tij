import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { getAccount } from "../../services/reducers/authentication";
import Swal from "sweetalert2";
import axiosInstance from "../../config/api";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;

    axiosInstance
      .get(`/verify-email/${token}`)
      .then((res) => {
        const { access, refresh } = res.data;
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        Swal.fire("Email Verified!", "You’re now logged in.", "success").then(
          () => {
            dispatch(getAccount());
            navigate("/", { replace: true });
          }
        );
      })
      .catch((err: any) => {
        Swal.fire(
          "Error!",
          err?.response?.status === 400
            ? "Your link has expired or is invalid. Please request a new one."
            : "Something went wrong. Please try again later.",
          "error"
        ).then(() => {
          navigate("/login");
        });
      });
  }, [token]);
  return <div></div>;
}
