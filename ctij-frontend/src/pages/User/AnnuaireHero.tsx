import logo from "@/assets/images/logo.png";
import { PERMANENCE_PHONE } from "@/pages/Admin/Traducteurs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUserPlus,
  faPhone,
  faClock,
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
  const pattern = Array.from(
    { length: 36 },
    (_, i) => WELCOME_WORDS[i % WELCOME_WORDS.length]
  );
  const telHref = `tel:${PERMANENCE_PHONE.replace(/\s/g, "")}`;

  return (
    <section
      aria-label="Accueil Cabinet TIJ"
      className="relative mb-10 overflow-hidden rounded-2xl border border-paper-border bg-paper shadow-soft-lg"
    >
      {/* Soft multilingual backdrop — kept quiet so the number stays primary */}
      <div
        className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-[0.07]"
        aria-hidden
      >
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 p-6 text-xs font-medium tracking-wide text-navy-900 md:text-sm">
          {pattern.map((word, i) => (
            <span key={`${word}-${i}`}>{word}</span>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/70 to-paper" />
      </div>

      <div className="relative px-5 py-10 sm:px-8 md:py-12 lg:px-12 lg:py-14">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_minmax(280px,340px)_1fr] md:gap-8 lg:gap-12">
          {/* Left — Administration */}
          <div className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600">
              Professionnels &amp; institutions
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-navy-900 md:text-4xl lg:text-[2.75rem]">
              Administration
            </h2>
            <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-muted md:max-w-xs">
              Trouvez un traducteur ou interprète selon la langue et la région.
            </p>
            <button
              type="button"
              onClick={onSearchClick}
              className="mt-6 inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-2.5 rounded-lg bg-sang-500 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-sang-600 hover:shadow-soft-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sang-500 md:w-auto"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Rechercher un interprète
            </button>
          </div>

          {/* Center — Logo + high-visibility permanence */}
          <div className="order-1 flex flex-col items-center md:order-2">
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-0 -m-3 rounded-full bg-navy-900/5 blur-md"
                aria-hidden
              />
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-white bg-white shadow-soft-lg ring-1 ring-paper-border sm:h-44 sm:w-44">
                <img
                  src={logo}
                  alt="Cabinet TIJ"
                  className="h-[70%] w-auto max-w-[70%] object-contain"
                />
              </div>
            </div>

            {/* Phone block — dominant CTA */}
            <div className="mt-7 w-full max-w-[20rem] rounded-2xl border-2 border-navy-800 bg-white p-4 text-center shadow-soft-lg sm:max-w-[22rem] sm:p-5">
              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sang-500 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sang-500" />
                </span>
                <p className="text-sm font-bold text-navy-900 sm:text-base">
                  Permanence téléphonique
                </p>
              </div>

              <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-navy-800">
                <FontAwesomeIcon icon={faClock} className="text-[10px] text-gold-600" />
                24h/24 · 7j/7
              </p>

              <a
                href={telHref}
                className="group mt-4 flex w-full flex-col items-center gap-2 rounded-xl bg-navy-900 px-4 py-4 text-white transition-all hover:-translate-y-0.5 hover:bg-navy-800 hover:shadow-soft-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 sm:py-5"
                aria-label={`Appeler la permanence ${PERMANENCE_PHONE}`}
              >
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-500">
                  <FontAwesomeIcon icon={faPhone} className="text-[11px]" />
                  Appelez maintenant
                </span>
                <span className="text-2xl font-bold tabular-nums tracking-wide sm:text-3xl">
                  {PERMANENCE_PHONE}
                </span>
              </a>

              <p className="mt-3 text-xs text-muted">
                Numéro unique de permanence — réponse immédiate
              </p>
            </div>
          </div>

          {/* Right — Interprètes */}
          <div className="order-3 flex flex-col items-center text-center md:items-end md:text-right">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600">
              Réseau linguistique
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-navy-900 md:text-4xl lg:text-[2.75rem]">
              Interprètes
            </h2>
            <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-muted md:ml-auto md:max-w-xs">
              Rejoignez le réseau Cabinet TIJ et proposez vos compétences.
            </p>
            <button
              type="button"
              onClick={onJoinClick}
              className="mt-6 inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-2.5 rounded-lg bg-sang-500 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-sang-600 hover:shadow-soft-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sang-500 md:w-auto"
            >
              <FontAwesomeIcon icon={faUserPlus} />
              Je propose mes services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
