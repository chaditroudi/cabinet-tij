import { useAppSelector } from "@/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, type MouseEvent } from "react";
import logo from "@/assets/images/logo.png";
import { JOIN_PAGE_PATH } from "@/pages/User/RejoindreReseau";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faRightFromBracket,
  faNewspaper,
  faFileSignature,
  faUserPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const PUBLICATIONS_URL =
  "https://www.linkedin.com/company/cabinet-tij/posts/?feedView=all";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(
    (state) => state.authentication
  ) as any;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const scrollToSection =
    (sectionId: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const scroll = () =>
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.location.pathname !== "/") {
        navigate("/");
        window.setTimeout(scroll, 100);
        return;
      }
      scroll();
    };

  const navLinkClass =
    "group relative inline-flex h-10 items-center gap-2 rounded-full px-2.5 text-sm font-medium text-navy-700 transition-colors hover:text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 md:px-3";
  const underline = (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-3 bottom-1.5 hidden h-0.5 origin-left scale-x-0 rounded-full bg-gold-500 transition-transform duration-300 group-hover:scale-x-100 sm:block"
    />
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-paper-border bg-white/90 shadow-soft-lg backdrop-blur-md"
          : "border-transparent bg-white shadow-soft"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-navy-900 via-gold-500 to-sang-500"
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-20 md:px-8">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-900"
        >
          <img
            src={logo}
            alt="Cabinet TIJ"
            className="h-11 w-auto shrink-0 object-contain transition-transform duration-300 motion-safe:group-hover:scale-105 md:h-14"
          />
          <span className="hidden items-center gap-3 lg:flex">
            <span aria-hidden className="h-9 w-px bg-paper-border" />
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold text-navy-900">
                Cabinet TIJ
              </span>
              <span className="block max-w-[220px] text-[11px] font-medium text-muted">
                Annuaire des traducteurs &amp; interprètes professionnels
              </span>
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
            aria-label="Nos publications (ouvre un nouvel onglet)"
            className={navLinkClass}
          >
            <FontAwesomeIcon icon={faNewspaper} className="shrink-0 text-xs text-gold-600" />
            <span className="hidden sm:inline">Nos publications</span>
            {underline}
          </a>

          <a
            href="#obtenir-devis"
            onClick={scrollToSection("obtenir-devis")}
            aria-label="Obtenir un devis de traduction assermentée"
            className={navLinkClass}
          >
            <FontAwesomeIcon icon={faFileSignature} className="shrink-0 text-xs text-sang-500" />
            <span className="hidden sm:inline">Obtenir un devis</span>
            {underline}
          </a>

          <Link
            to={JOIN_PAGE_PATH}
            title="Interprètes & Traducteurs judiciaires"
            className="group ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-navy-900 to-navy-700 pl-1.5 pr-1.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:shadow-soft-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 motion-safe:hover:-translate-y-0.5 sm:ml-2 sm:pr-4"
          >
            <span
              aria-hidden
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-900"
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-[11px]" />
            </span>
            <span className="hidden sm:inline">Rejoignez-nous</span>
            <span className="sr-only sm:hidden">Rejoignez-nous</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              aria-hidden
              className="hidden text-xs transition-transform duration-300 motion-safe:group-hover:translate-x-0.5 sm:inline"
            />
          </Link>

          {isAuthenticated && (
            <>
              <span aria-hidden className="mx-1 hidden h-6 w-px bg-paper-border sm:block" />
              <Link to="/traducteurs" className={navLinkClass}>
                <FontAwesomeIcon icon={faGear} className="text-xs" />
                <span className="hidden sm:inline">Admin</span>
                {underline}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={navLinkClass}
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                <span className="hidden sm:inline">Déconnexion</span>
                {underline}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
