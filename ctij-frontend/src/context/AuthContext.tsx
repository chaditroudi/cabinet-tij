import { createContext, useContext } from "react";

import Swal from "sweetalert2";
import { upperCase } from "lodash";

interface AuthContextType {
  formatErrorMessages: any;
  formatDate: any;
  TopEndAlert: any;
  getLanguageLabel: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

  const getLanguageLabel = (code: string, languages: any) => {
    const found = languages.find((lang: any) => lang.code === code);
    return found ? `${upperCase(found.code)} | ${found.name}` : code;
  };

  return (
    <AuthContext.Provider
      value={{
        getLanguageLabel,
        TopEndAlert,
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
