import logo from "@/assets/images/logo.png";
import { PERMANENCE_PHONE } from "@/pages/Admin/Traducteurs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUserPlus,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const WELCOME_WORDS = [
  "Bienvenue",
  "Welcome",
  "Willkommen",
  "Benvenuto",
  "Bienvenido",
  "مرحبا",
  "欢迎",
  "ようこそ",
  "환영합니다",
  "Добро пожаловать",
  "Bem-vindo",
  "Welkom",
  "Καλώς ήρθατε",
  "Hoş geldiniz",
  "Karibu",
  "स्वागत है",
];

type AnnuaireHeroProps = {
  onSearchClick?: () => void;
  onJoinClick?: () => void;
};

export function AnnuaireHero({ onSearchClick, onJoinClick }: AnnuaireHeroProps) {
  const pattern = Array.from({ length: 48 }, (_, i) => WELCOME_WORDS[i % WELCOME_WORDS.length]);

  return (
    <section
      aria-label="Accueil Cabinet TIJ"
      className="relative mb-10 overflow-hidden rounded-2xl border border-paper-border bg-paper shadow-soft"
    >
      {/* Multilingual atmosphere — distinct from competitor pattern */}
      <div
        className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-[0.14]"
        aria-hidden
      >
        <div className="flex flex-wrap gap-x-6 gap-y-3 p-4 text-[11px] font-medium tracking-wide text-navy-900 md:gap-x-8 md:text-xs">
          {pattern.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className={i % 3 === 0 ? "opacity-70" : i % 2 === 0 ? "opacity-90" : "opacity-50"}
            >
              {word}
            </span>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-transparent to-paper/80" />
      </div>

      <div className="relative grid items-center gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:py-14 lg:px-12 lg:py-16">
        {/* Left — Administration */}
        <div className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            Professionnels &amp; institutions
          </p>
          <h2 className="font-display text-3xl font-semibold text-navy-900 md:text-4xl">
            Administration
          </h2>
          <p className="mt-2 max-w-xs text-sm text-navy-700/80">
            Trouvez un traducteur ou interprète selon la langue et la région.
          </p>
          <button
            type="button"
            onClick={onSearchClick}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-sang-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-sang-600 hover:shadow-soft-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sang-500"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            Rechercher un interprète
          </button>
        </div>

        {/* Center — Logo + permanence */}
        <div className="order-1 flex flex-col items-center md:order-2">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-paper-border bg-white shadow-soft-lg sm:h-48 sm:w-48">
            <img
              src={logo}
              alt="Cabinet TIJ"
              className="h-[72%] w-auto max-w-[72%] object-contain"
            />
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm font-semibold text-navy-900">
              Permanence téléphonique
            </p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-muted">
              24h/24
            </p>
            <a
              href={`tel:${PERMANENCE_PHONE.replace(/\s/g, "")}`}
              className="mt-3 inline-flex items-center gap-2 rounded-md border-2 border-navy-800 bg-white px-4 py-2 text-base font-bold tabular-nums text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              {PERMANENCE_PHONE}
            </a>
          </div>
        </div>

        {/* Right — Interprètes */}
        <div className="order-3 flex flex-col items-center text-center md:items-end md:text-right">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            Réseau linguistique
          </p>
          <h2 className="font-display text-3xl font-semibold text-navy-900 md:text-4xl">
            Interprètes
          </h2>
          <p className="mt-2 max-w-xs text-sm text-navy-700/80 md:ml-auto">
            Rejoignez le réseau Cabinet TIJ et proposez vos compétences.
          </p>
          <button
            type="button"
            onClick={onJoinClick}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-sang-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-sang-600 hover:shadow-soft-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sang-500"
          >
            <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
            Je propose mes services
          </button>
        </div>
      </div>
    </section>
  );
}
