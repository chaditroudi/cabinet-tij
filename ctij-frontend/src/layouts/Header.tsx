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

  // Élément commun "Vu sur Forbes"
  // const commonItems = [
  //   {
  //     template: () => (
  //       <button
  //         onClick={() =>
  //           window.open(
  //             "https://www.forbes.fr/brandvoice/cabinet-tij-la-confidentialite-et-lhumain-au-coeur-de-la-linguistique/",
  //             "_blank",
  //             "noopener,noreferrer"
  //           )
  //         }
  //         className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-red-400 text-white rounded-full flex items-center gap-2 transition duration-300 hover:scale-105 hover:shadow-lg"
  //       >
  //         <span className="text-xl animate-bounce">🔥</span>
  //         <span className="font-bold text-sm">Vu sur Forbes</span>
  //       </button>
  //     ),
  //   },
  // ];

  const items = isAuthenticated
    ? [
        {
          label: "Accueil",
          icon: "pi pi-home",
          className: "text-green-900",
          command: () => navigate("/"),
        },
        {
          label: "Admin",
          icon: "pi pi-cog",
          command: () => navigate("/traducteurs"),
          className: "text-green-900",
        },
        {
          label: "Déconnexion",
          icon: "pi pi-sign-out",
          command: () => handleLogout(),
          className: "text-green-900",
        },
      ]
    : [
        {
          label: "Accueil",
          icon: "pi pi-home",
          command: () => navigate("/"),
        },
        {
          label: "Connexion",
          icon: "pi pi-key",
          command: () => navigate("/login"),
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
                <img
                  src={logo}
                  alt=""
                  style={{ width: "60px", height: "auto" }}
                />
                <div className="flex flex-col">
                  <span>Cabinet TIJ</span>
                  <div className="text-xs text-gray-500">

                    Annuaire des traducteurs et interprètes professionnels en France
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
