import { useAppDispatch, useAppSelector } from "@/hooks";
import { getAccount, login } from "@/services/reducers/authentication";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressSpinner } from "primereact/progressspinner";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Accessing state from authSlice
  const { isloadingLogin: loading, error } = useAppSelector(
    (state) => state.authentication
  ) as any;

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      dispatch(getAccount());
      navigate("/contacts");
    }
  };
  return (
    <section id="connexion" className="py-10 px-4   ">
      <div className="container mx-auto max-w-6xl ">
        <div className="max-w-md mx-auto bg-white rounded-xl  border-blue-950 border-opacity-30 border p-6">
          <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">
            Sign In
          </h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-red-700 text-sm mb-2 h-6">
              {error && error !== null && (
                <span>
                  {typeof error === "string"
                    ? error
                    : error?.error || "An error occurred"}
                </span>
              )}
            </p>
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="login-email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative w-full">
                <input
                  autoFocus={false}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  id="login-password"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your password"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="text-gray-400"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faEye} className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-prt-main-color-200 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-prt-main-color-200 hover:text-purple-800"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-950  text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {loading ? (
                <div className="flex flex-row text-center items-center justify-center">
                  <label htmlFor="">Connexion en cours...</label>
                  <ProgressSpinner className="h-6 w-6 ml-2" />
                </div>
              ) : (
                "Sign in"
              )}
            </button>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-prt-main-color-200 hover:text-purple-800 font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
