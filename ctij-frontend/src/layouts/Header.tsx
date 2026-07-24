import { useAppSelector } from "@/hooks";
import { Link, useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";
import logo from "@/assets/images/logo.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faRightFromBracket,
  faNewspaper,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";

const PUBLICATIONS_URL =
  "https://www.linkedin.com/company/cabinet-tij/posts/?feedView=all";

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
      confirmButtonColor: "#14213D",
      cancelButtonColor: "#B23A48",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
    }).then((result: any) => {
      if (result.isConfirmed) navigate("/logout");
    });
  };

  const scrollToDevis = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => {
        document
          .getElementById("obtenir-devis")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }
    document
      .getElementById("obtenir-devis")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navLinkClass =
    "inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50 hover:text-navy-900 md:px-3";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-paper-border bg-white/95 shadow-soft backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-20 md:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="Cabinet TIJ"
            className="h-11 w-auto shrink-0 object-contain md:h-14"
          />
          <span className="hidden items-center gap-3 lg:flex">
            <span className="h-8 w-px bg-paper-border" />
            <span className="max-w-[220px] text-xs font-medium leading-snug text-muted">
              Annuaire des traducteurs &amp; interprètes professionnels
            </span>
          </span>
        </Link>

        <nav
          className="flex items-center justify-end gap-0.5 sm:gap-1"
          aria-label="Navigation principale"
        >
          <a
            href={PUBLICATIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass}
          >
            <FontAwesomeIcon icon={faNewspaper} className="text-xs shrink-0" />
            <span className="hidden sm:inline">Nos publications</span>
          </a>

          <a
            href="#obtenir-devis"
            onClick={scrollToDevis}
            className={navLinkClass}
            title="Besoin d'une traduction assermentée (obtenir un devis)"
          >
            <FontAwesomeIcon
              icon={faFileSignature}
              className="text-xs shrink-0"
            />
            <span className="hidden sm:inline">Obtenir un devis</span>
          </a>

          {isAuthenticated && (
            <>
              <Link to="/traducteurs" className={navLinkClass}>
                <FontAwesomeIcon icon={faGear} className="text-xs" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={navLinkClass}
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
