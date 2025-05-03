import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { store } from "./config/store";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/AuthContext";
import { PrimeReactProvider } from "primereact/api";
import "./styles/global.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AppRoutes from "./routes/routes";

// Access dynamic title and description from .env
const metaTitle = import.meta.env.VITE_APP_META_TITLE || "Cabinet TIJ";
const metaDescription =
  import.meta.env.VITE_APP_META_DESCRIPTION || "Cabinet TIJ";

function MainApp() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <AuthProvider>
              <PrimeReactProvider value={{ unstyled: false }}>
                <Helmet>
                  <html lang="en" translate="no" />
                  <meta name="theme-color" content="#003b3b" />
                  <title>{metaTitle}</title>
                  <meta name="description" content={metaDescription} />
                </Helmet>
                <AppRoutes />
              </PrimeReactProvider>
          </AuthProvider>
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  );
}

// Ensure `createRoot` is called only once
const container = document.getElementById("root");
if (!container) throw new Error("Root container is missing in index.html");

// Create the root once and reuse it
const root = createRoot(container);
root.render(<MainApp />);
