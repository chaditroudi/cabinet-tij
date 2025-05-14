import { useAppSelector } from "@/hooks";
import { Menubar } from "primereact/menubar";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import Swal from "sweetalert2";
const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(
    (state) => state.authentication
  ) as any;

  // Menu items
  const items = isAuthenticated
    ? [
        {
          label: "Accueil",
          icon: "pi pi-home",
          className: "text-green-900", // Customize color for text
          command: () => navigate("/"), // navigate to /home or /dashboard for admins
        },

        {
          label: "Admin",
          icon: "pi pi-cog",
          command: () => navigate("/traducteurs"), // navigate to admin dashboard
          className: "text-green-900", // Customize color for text
        },
        {
          label: "Déconnexion",
          icon: "pi pi-sign-out",
          command: () => handleLogout(), // navigate to admin dashboard
          className: "text-green-900", // Customize color for text
        },
      ]
    : [
        {
          label: "Accueil",
          icon: "pi pi-home",
          command: () => navigate("/"), // navigate to /home
        },

        {
          label: "Connexionn",
          icon: "pi pi-key",
          command: () => navigate("/login"), // navigate to /login
        },
      ];
  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
    }).then((result: any) => {
      if (result.isConfirmed) {
        navigate("/logout");
      }
    });
  };
  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="mx-auto w-full">
        <Menubar
          model={items}
          start={
            <div className="flex flex-col items-start md:gap-2 text-blue-800 font-bold px-2 py-2">
              <Link to={"/"} className="flex items-center gap-3 text-xl">
                <img
                  src={logo}
                  alt=""
                  style={{ width: "60px", height: "auto" }}
                />
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
