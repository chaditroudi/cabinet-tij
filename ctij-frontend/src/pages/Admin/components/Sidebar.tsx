import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faHospitalAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/hooks";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  user: { name: string; email: string };
  onLogout: () => void;
}

const Sidebar = ({ collapsed, setCollapsed, onLogout }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.authentication) as any;

  const menuItems = [
    {
      path: "/contacts",
      icon: "fa-solid fa-address-book",
      label: "Traducteurs",
    },
  ];

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"} bg-gray-800 text-white transition-all duration-300 ease-in-out h-screen flex flex-col justify-between`}
    >
      {/* Top: Logo & Menu */}
      <div>
        <div className="p-4 flex items-center  h-16 border-b border-gray-700">
          {!collapsed ? (
            <div className="flex flex-row gap-4 items-center ">
              <FontAwesomeIcon icon={faHospitalAlt} className="text-3xl text-white" />
              <div>Cabinet TIJ</div>
            </div>
          ) : (
            <i className="fa-solid fa-user-shield text-xl"></i>
          )}
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
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
          onClick={onLogout}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
