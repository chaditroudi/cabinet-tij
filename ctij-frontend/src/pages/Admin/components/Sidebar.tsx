import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospitalAlt,
  faSignOutAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/hooks";

interface SidebarProps {
  onLogout: () => void;
  collapsed: boolean;
}

const Sidebar = ({ onLogout, collapsed }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.authentication) as any;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      path: "/traducteurs",
      icon: "fa-solid fa-address-book",
      label: "Traducteurs",
    },
    {
      path: "/langues",
      icon: "fa-solid fa-flag",
      label: "Langues",
    },
  ];

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      {!collapsed && (
        <div className="md:hidden fixed top-3 left-4 z-50">
          <button
            onClick={toggleMobileSidebar}
            className="text-gray-800 text-lg p-2 rounded-md"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gray-800 text-white transition-all duration-300 ease-in-out h-full flex flex-col justify-between
        fixed md:static z-40 top-0 left-0
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        md:h-screen
        `}
        style={{ height: "100vh" }}
      >
        {/* Top: Logo & Menu */}
        <div>
          <div className="p-4 flex items-center h-16 border-b border-gray-700 justify-between">
            {!collapsed ? (
              <div className="flex flex-row gap-4 items-center">
                <FontAwesomeIcon
                  icon={faHospitalAlt}
                  className="text-3xl text-white"
                />
                <div>Cabinet TIJ</div>
              </div>
            ) : (
              <i className="fa-solid fa-user-shield text-xl"></i>
            )}

            {/* Close button on mobile */}
            <div className="md:hidden">
              <button onClick={toggleMobileSidebar} className="text-white">
                ✕
              </button>
            </div>
          </div>

          <nav className="mt-6">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path} className="mb-2">
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)} // close on navigation
                    className={`flex items-center p-4 ${
                      location.pathname === item.path
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    } rounded-lg transition-colors`}
                  >
                    <i
                      className={`${item.icon} ${collapsed ? "text-xl" : "mr-4"}`}
                    ></i>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom: User Info & Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fa-solid fa-user-circle text-2xl"></i>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user && user.name}</p>
                <p className="text-xs text-gray-400">{user && user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              onLogout();
              setIsMobileOpen(false);
            }}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            {!collapsed && <span>déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Optional: Backdrop when sidebar is open on mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
