import { faEye, faEyeSlash, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { RootState } from "../../config/store";
import { register, resetError } from "../../services/reducers/authentication";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Register() {
  const dispatch = useDispatch();
  const { error, isRegister, isLoadingRegister } = useSelector(
    (state: RootState) => state.authentication
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms_accepted, setTerms_accepted] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);

    const userData = {
      email,
      name,
      password,
      password_confirmation: confirmPassword,
      terms_accepted,
    };

    try {
      await dispatch(register(userData as any) as any);
    } catch (err) {
      // Handle registration error
      console.error("Registration error:", err);
    }
  };

  if (isRegister) {
    // Display success alert
    Swal.fire({
      title: "Success!",
      text: "Inscription réussie ! Vous pouvez maintenant vous connecter.",
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        setEmail("");
        setPassword("");
        setName("");
        setConfirmPassword("");
        setTerms_accepted(false);
        dispatch(resetError());

        // Redirect to login page
        navigate("/login");
      }
    });
  }

  const renderErrorMessages = (field: string) => {
    // grab the raw value
    const raw = error?.errors?.[field];
    if (!raw) return null;

    // if it's an array, map over it
    if (Array.isArray(raw)) {
      return raw.map((item: any, idx: number) => {
        // if item is a string, render directly
        if (typeof item === "string") {
          return (
            <small key={idx} style={{ color: "red" }}>
              {item}
            </small>
          );
        }

        // if item is an object, try common keys
        const text =
          item.message ??
          item[field] ??
          // fallback to JSON in case shape is totally custom
          JSON.stringify(item);

        return (
          <small key={idx} style={{ color: "red" }}>
            {text}
          </small>
        );
      });
    }

    // otherwise, if it's a single string
    if (typeof raw === "string") {
      return <small style={{ color: "red" }}>{raw}</small>;
    }

    // nothing to show
    return null;
  };

  return (
    <>
      <section id="sign-up" className="py-10 px-4 ">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-md mx-auto bg-white rounded-xl  border-blue-950 border-opacity-30 border p-6">
            <div className="">
              <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">
                Sign Up
              </h3>

              <form onSubmit={handleRegister} className="space-y-3">
                <small className="mb-3" style={{ color: "red" }}>
                  {error && typeof error === "string" ? error : null}
                </small>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nom & prénom
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      autoComplete="name"
                      className="h-10 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary-color sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>{renderErrorMessages("name")}</div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-10 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary-color sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>{renderErrorMessages("email")}</div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mot de passe
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="h-10 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary-color sm:text-sm sm:leading-6"
                    />

                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEye}
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                  <div>{renderErrorMessages("password")}</div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    confirmer mot de passe
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={confirmPasswordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="h-10 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary-color sm:text-sm sm:leading-6"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {confirmPasswordVisible ? (
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEye}
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                  <div className="">
                    {passwordMismatch && (
                      <small style={{ color: "red" }}>
                        Le mot de passe et la confirmation ne correspondent pas
                      </small>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={terms_accepted}
                      onChange={(e) => setTerms_accepted(e.target.checked)}
                      required
                      className="h-4 w-4 rounded border-gray-300 text-secondary-color focus:ring-secondary-color"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-3 block text-sm leading-6 text-gray-700"
                    >
                      I agree to the terms and conditions
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    disabled={isLoadingRegister}
                    type="submit"
                    className="w-full bg-blue-950 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    {isLoadingRegister ? (
                      <div className="flex flex-row text-center items-center justify-center">
                        <label htmlFor="">Registering...</label>
                        <ProgressSpinner className="h-6 w-6 ml-2" />
                      </div>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 flex justify-end">
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-main-color font-semibold hover:text-main-color"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
