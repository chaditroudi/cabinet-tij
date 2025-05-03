import { useLayoutEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { logout } from "../../services/reducers/authentication";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useLayoutEffect(() => {
    dispatch(logout());
    navigate("/");
  }, []);
  return null;
}
