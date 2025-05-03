import { useAppSelector } from "@/hooks";
import { Menubar } from "primereact/menubar";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png"
const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(
    (state) => state.authentication
  ) as any;

  // Menu items
  const items = isAuthenticated
    ? [
        {
          label: "Acceuil",
          icon: "pi pi-home",

          command: () => navigate("/"), // navigate to /home or /dashboard for admins
        },
        {
          label: "Admin",
          icon: "pi pi-cog",
          command: () => navigate("/traducteurs"), // navigate to admin dashboard
          className: "text-green-900", // Customize color for text
        },
      ]
    : [
        {
          label: "Acceuil",
          icon: "pi pi-home",
          command: () => navigate("/"), // navigate to /home
        },
        {
          label: "Connexion",
          icon: "pi pi-key",
          command: () => navigate("/login"), // navigate to /login
        },
        {
          label: "Inscription",
          icon: "pi pi-user-plus",
          command: () => navigate("/register"), // navigate to /register
        },
      ];

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="mx-auto w-full">
        <Menubar
          model={items}
          start={
            <div className="flex flex-col items-start md:gap-2 text-blue-800 font-bold px-2 py-2">
              <Link to={"/"} className="flex items-center gap-3 text-xl">
                <img src={logo} alt="" style={{width:"60px",height:"auto"}} />
                <div className="flex flex-col">
                  <span>Cabinet TIJ</span>
                  <div className="text-xs text-gray-500">
                    Annuaire des Traducteurs professionnels et indépendants
                  </div>
                </div>
              </Link>
            </div>
          }
          className="border-none w-full justify-between"
        />
      </div>
    </header>
  );
};

export default Header;
