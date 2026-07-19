import { useAppSelector } from "@/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRightToBracket,
  faUserPlus,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const TALLY_URL = "https://tally.so/r/XxLkAP";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated } = useAppSelector(
    (state) => state.authentication
  ) as any;

  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14213D",
      cancelButtonColor: "#B23A48",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
    }).then((result: any) => {
      if (result.isConfirmed) navigate("/logout");
    });
  };

  const linkClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-navy-50 text-navy-900"
        : "text-navy-700 hover:bg-navy-50 hover:text-navy-900"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-paper-border bg-white/95 shadow-soft backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-20 md:px-8">
        {/* Brand */}
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="Cabinet TIJ"
            className="h-11 w-auto shrink-0 object-contain md:h-14"
          />
          <span className="hidden items-center gap-3 lg:flex">
            <span className="h-8 w-px bg-paper-border" />
            <span className="max-w-[190px] text-[11px] font-medium uppercase leading-tight tracking-[0.14em] text-muted">
              Annuaire des traducteurs &amp; interprètes professionnels
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link to="/" className={linkClass(pathname === "/")}>
            <FontAwesomeIcon icon={faHouse} className="text-xs" />
            <span className="hidden sm:inline">Accueil</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/traducteurs"
                className={linkClass(
                  pathname.startsWith("/traducteurs") ||
                    pathname.startsWith("/langues")
                )}
              >
                <FontAwesomeIcon icon={faGear} className="text-xs" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
              <button onClick={handleLogout} className={linkClass(false)}>
                <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </>
          ) : (
            <Link to="/login" className={linkClass(pathname === "/login")}>
              <FontAwesomeIcon icon={faRightToBracket} className="text-xs" />
              <span className="hidden sm:inline">Connexion</span>
            </Link>
          )}

          <a
            href={TALLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center gap-2 rounded-lg bg-navy-900 px-3 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-navy-800 md:px-4"
          >
            <FontAwesomeIcon icon={faUserPlus} className="text-gold-500" />
            <span className="hidden md:inline">Référencez-vous</span>
            <span className="md:hidden">Inscription</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
