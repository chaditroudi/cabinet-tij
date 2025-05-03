import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "../config/api";
import Swal from "sweetalert2";
import { upperCase } from "lodash";

// Define a more specific type for user data if possible
interface UserData {
  id: string;
  fullname: string;
  displayName: string;
  photoURL: string;
  email: string;

  // Add other user-specific fields here
}

interface AuthContextType {
  formatErrorMessages: any;
  getUser: () => Promise<void>;
  formatDate: any;
  TopEndAlert: any;
  logoutUser: () => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  getLanguageLabel: any;
  authToken: string | null;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  isAuthenticated: boolean;
  loading: boolean; // Loading state
  loggedOut: boolean; // Loading state
  showModal: any;
}

interface LoginData {
  email: string;
  password: string;
  // Add other fields if needed
}

interface ResponseData {
  token: string;
  type: number;
  status: string;
  // Add other fields if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loggedOut, setLoggedOut] = useState<boolean>(false);

  const getUser = async () => {
    setLoading(true);
    const token = Cookies.get("auth-token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("tenderflow/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data.userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const response = await axios.post<ResponseData>(
        "tenderflow/api/login",
        data
      );
      const { token } = response.data;

      setAuthToken(token);
      Cookies.set("auth-token", token, { secure: true, sameSite: "Strict" });
      setIsAuthenticated(true);

      await getUser(); // Fetch user data after login
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("auth-token");
    setLoggedOut(true);
    setAuthToken(null);
    setUserData(null);
    setIsAuthenticated(false);
  };

  const logoutUser = async () => {
    try {
      setLoggedOut(true);

      console.log("User logged out");
      // Redirect user to login page or home page
      window.location.href = "/login"; // Redirect after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    const token = Cookies.get("auth-token");
    setAuthToken(token || null);
  }, []);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const TopEndAlert = (icon: any, title: any, bgColor: any) => {
    const Toast = Swal.mixin({
      toast: true,
      background: bgColor,
      position: "bottom-left",
      showConfirmButton: false,
      timerProgressBar: false,
      showCloseButton: true,
      timer: 4000,
      customClass: {
        popup: "glassy-popup", // Custom class for frosted glass effect
      },
    });
    Toast.fire({
      icon: icon,
      title: title,
    });
  };
  const formatErrorMessages = (
    errorResponse: Record<string, string[] | string>
  ): string => {
    return Object.entries(errorResponse)
      .map(([field, messages]) => {
        // Check if messages is an array or a string
        const formattedMessages = Array.isArray(messages)
          ? messages.join(", ") // Join array messages
          : messages; // Use string directly

        return `<strong>${field.replace("_", " ").toUpperCase()}</strong>: ${formattedMessages}`;
      })
      .join("<br>"); // Use <br> for line breaks
  };

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [cancelButtonText, setCancelButtonText] = useState("");
  const [confirmButtonText, setConfirmButtonText] = useState("");
  const [confirmButton, setConfirmButton] = useState(""); // Added state for confirmButton
  const [cancelButton, setCancelButton] = useState(""); // Added state for cancelButton
  const [confirmButtonClass, setConfirmButtonClass] = useState(""); // Added state for confirmButtonClass
  const [cancelButtonClass, setCancelButtonClass] = useState(""); // Added state for cancelButtonClass
  const [modalType, setModalType] = useState(""); // Set default to false to show non-error modals by default
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});

  const showModal = (
    confirmAction: () => void,
    modalTitle: string,
    modalMessage: string,
    confirmButtonText: string,
    cancelButtonText: string,
    confirmButton: string,
    cancelButton: string,
    modalType: string,
    confirmButtonClass?: string,
    cancelButtonClass?: string
  ) => {
    // Set the action to be performed on confirm
    setOnConfirm(() => () => {
      confirmAction(); // Call the confirm action
      setIsOpen(false); // Close the modal after confirming
    });

    // Set modal content
    setTitle(modalTitle);
    setMessage(modalMessage);
    setConfirmButtonText(confirmButtonText);
    setCancelButtonText(cancelButtonText);
    setConfirmButton(confirmButton); // Set confirm button label
    setCancelButton(cancelButton); // Set cancel button label
    setConfirmButtonClass(confirmButtonClass || "tf-green-600"); // Set confirm button class
    setCancelButtonClass(cancelButtonClass || "red-800"); // Set cancel button class
    setModalType(modalType); // Assuming modalType is "error" for error modals

    setIsOpen(true); // Open the modal
  };

  const getLanguageLabel = (code: string, languages: any) => {
    const found = languages.find((lang: any) => lang.code === code);
    return found ? `${upperCase(found.code)} | ${found.name}` : code;
  };
  return (
    <AuthContext.Provider
      value={{
        getLanguageLabel,
        showModal,
        TopEndAlert,
        getUser,
        logoutUser,
        login,
        logout,
        authToken,
        userData,
        setUserData,
        isAuthenticated,
        loading,
        loggedOut,
        formatDate,
        formatErrorMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
