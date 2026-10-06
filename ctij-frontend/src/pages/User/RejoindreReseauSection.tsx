import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faHandshake,
  faGavel,
} from "@fortawesome/free-solid-svg-icons";

const CONVENTION_URL = "https://tally.so/r/WO890R";
const ADHESION_URL = "https://tally.so/r/XxLkAP";

type Point = { primary: ReactNode; detail?: ReactNode };

const PANEL =
  "relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white ring-1 ring-transparent transition-all duration-300 hover:ring-2 hover:ring-gold-500/70";
const PANEL_BODY = "p-5 sm:p-10";
const PANEL_FOOTER =
  "relative flex flex-col border-t border-paper-border bg-paper/70 px-5 py-8 sm:px-10 sm:py-10";

function OptionHeading({
  number,
  label,
  title,
  titleId,
  principle,
  accent,
}: {
  number: string;
  label: string;
  title: ReactNode;
  titleId: string;
  principle: string;
  accent: string;
}) {
  return (
    <header>
      <div className="flex items-end gap-4">
        <span
          aria-hidden
          className="font-display text-6xl font-light leading-[0.8] tabular-nums text-gold-500 sm:text-7xl"
        >
          {number}
        </span>
        <span className="mb-1 flex-1">
          <span aria-hidden className={`mb-2.5 block h-[3px] w-10 ${accent}`} />
          <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-navy-800">
            <span className="sr-only">Formule {number} — </span>
            {label}
          </span>
        </span>
      </div>

      <h3
        id={titleId}
        className="mt-8 font-display text-3xl font-semibold leading-[1.15] text-navy-900 sm:text-[2.15rem]"
      >
        {title}
      </h3>

      <p className="mt-5 font-display text-xl italic leading-snug text-sang-600 sm:text-2xl">
        {principle}
      </p>
    </header>
  );
}

function PointList({
  points,
  tone,
}: {
  points: Point[];
  tone: "navy" | "sang";
}) {
  const checkClass =
    tone === "navy" ? "bg-navy-900 text-gold-500" : "bg-sang-500 text-white";

  return (
    <ul className="divide-y divide-paper-border border-y border-paper-border" role="list">
      {points.map((point, i) => (
        <li key={i} className="flex gap-3.5 py-4">
          <span
            aria-hidden
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${checkClass}`}
          >
            <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
          </span>
          <div className="min-w-0">
            <p className="text-base leading-relaxed text-navy-800 sm:text-[17px]">
              {point.primary}
            </p>
            {point.detail && (
              <p className="mt-1.5 text-[15px] leading-relaxed text-navy-700/90">
                {point.detail}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function OptionLink({
  href,
  children,
  tone,
}: {
  href: string;
  children: ReactNode;
  tone: "navy" | "sang";
}) {
  const toneClass =
    tone === "navy"
      ? "bg-navy-900 hover:bg-navy-800 focus-visible:outline-navy-900"
      : "bg-sang-500 hover:bg-sang-600 focus-visible:outline-sang-500";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex min-h-[3rem] w-full items-center justify-center gap-3 rounded-full px-6 py-3 text-center text-[15px] sm:inline-flex sm:w-auto font-semibold text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${toneClass}`}
    >
      <span>{children}</span>
      <FontAwesomeIcon
        icon={faArrowRight}
        aria-hidden
        className="shrink-0 text-xs transition-transform duration-200 motion-safe:group-hover:translate-x-1"
      />
      <span className="sr-only">(ouvre un nouvel onglet)</span>
    </a>
  );
}

const CONVENTION_POINTS: Point[] = [
  {
    primary: (
      <>
        <strong className="font-semibold text-navy-900">
          TIJ vous sollicite directement
        </strong>{" "}
        pour intervenir sur ses missions.
      </>
    ),
  },
  {
    primary: (
      <>
        <strong className="font-semibold text-navy-900">Vous facturez TIJ</strong>,
        qui facture ensuite la mission via l&apos;espace du cabinet TIJ.
      </>
    ),
  },
  {
    primary: (
      <>
        <strong className="font-semibold text-navy-900">
          Vous ne gérez pas votre propre facturation
        </strong>{" "}
        pour ces missions&nbsp;: c&apos;est TIJ qui s&apos;en charge.
      </>
    ),
  },
];

const ADHESION_POINTS: Point[] = [
  {
    primary: (
      <strong className="font-semibold text-navy-900">
        Vous facturez directement vos missions.
      </strong>
    ),
    detail: "Via votre propre outil de facturation professionnel.",
  },
  {
    primary: (
      <strong className="font-semibold text-navy-900">
        Vous êtes référencé dans l&apos;annuaire TIJ.
      </strong>
    ),
    detail: (
      <>
        Vous figurez sur la plateforme en ligne, et dans les campagnes de
        communication mensuelles menées par TIJ (numérique et postale —
        environ 5&nbsp;000 enveloppes envoyées aux différents services,
        contenant l&apos;annuaire avec les coordonnées des interprètes
        adhérents classés par langue).
      </>
    ),
  },
  {
    primary: (
      <strong className="font-semibold text-navy-900">
        Les services vous contactent directement.
      </strong>
    ),
    detail: (
      <>
        Ce sont vos coordonnées personnelles qui figurent dans
        l&apos;annuaire&nbsp;: les services requérants vous contactent
        directement, sans intermédiaire.
      </>
    ),
  },
  {
    primary: (
      <strong className="font-semibold text-navy-900">
        Vous êtes libre d&apos;accepter ou refuser les missions.
      </strong>
    ),
    detail: (
      <>
        Vous gardez une totale liberté&nbsp;: vous acceptez ou refusez chaque
        mission à votre guise.
      </>
    ),
  },
  {
    primary: (
      <strong className="font-semibold text-navy-900">
        TIJ ne se rémunère pas sur ces missions.
      </strong>
    ),
  },
];

export function RejoindreReseauSection() {
  return (
    <section
      id="rejoignez-nous"
      aria-labelledby="rejoindre-reseau-titre"
      className="relative isolate mb-10 scroll-mt-28 overflow-hidden rounded-2xl bg-gradient-to-b from-navy-900 via-navy-900 to-navy-800 px-3 py-12 shadow-soft-lg sm:px-10 md:py-16 lg:px-14 lg:py-20"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-500/0 via-gold-500 to-gold-500/0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-gold-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-sang-500/15 blur-3xl"
      />

      <Link
        to="/"
        className="group mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white/90 transition-colors hover:border-gold-500/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 sm:mb-6"
      >
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-navy-900"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-xs transition-transform duration-200 motion-safe:group-hover:-translate-x-0.5"
          />
        </span>
        Retour à l&apos;accueil
      </Link>

      <div className="mx-auto max-w-3xl px-2 text-center sm:px-0">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-500 sm:text-sm">
          <FontAwesomeIcon icon={faGavel} aria-hidden />
          Interprètes &amp; traducteurs judiciaires
        </span>
        <h2
          id="rejoindre-reseau-titre"
          className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]"
        >
          Rejoignez le réseau{" "}
          <span className="block italic text-white/90">
            d&apos;interprètes-traducteurs{" "}
            <span className="relative not-italic text-gold-500">
              TIJ
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gold-500/70"
              />
            </span>
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
          Le cabinet TIJ propose deux façons de collaborer avec ses
          interprètes-traducteurs judiciaires. Choisissez la formule qui
          correspond à votre pratique.
        </p>
      </div>

      <div
        className="mx-auto mt-12 flex max-w-3xl items-center gap-4 px-2 sm:px-0 md:mt-14"
      >
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/70" />
        <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
        <p className="text-center font-display text-lg italic text-white sm:text-xl">
          Deux façons de collaborer avec TIJ
        </p>
        <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
        <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/70" />
      </div>

      <div className="mt-10 grid items-start gap-6 md:mt-14 xl:grid-cols-2 xl:gap-8">
        <article aria-labelledby="offre-convention-titre" className={PANEL}>
          <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-navy-900" />
          <div className={PANEL_BODY}>
            <OptionHeading
              number="01"
              label="Convention de partenariat"
              title="Intervenir sur nos missions judiciaires"
              titleId="offre-convention-titre"
              principle="TIJ vous confie des missions."
              accent="bg-navy-900"
            />

            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-700 sm:text-[17px]">
              Vous intervenez sous mandat TIJ, sur sollicitation directe du
              cabinet, pour des missions judiciaires et administratives.
            </p>

            <div className="mt-8">
              <PointList points={CONVENTION_POINTS} tone="navy" />
            </div>
          </div>

          <div className={PANEL_FOOTER}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
              Convention de partenariat
            </p>
            <p className="mt-3 flex items-center gap-4">
              <span
                aria-hidden
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-gold-500 bg-white text-navy-900"
              >
                <FontAwesomeIcon icon={faHandshake} className="text-xl" />
              </span>
              <span className="font-display text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">
                Aucun frais d&apos;adhésion
              </span>
            </p>

            <div className="pt-8">
              <OptionLink href={CONVENTION_URL} tone="navy">
                Devenir partenaire sous convention
              </OptionLink>
            </div>
          </div>
        </article>

        <article aria-labelledby="offre-adhesion-titre" className={PANEL}>
          <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-sang-500" />
          <div className={PANEL_BODY}>
            <OptionHeading
              number="02"
              label="Adhésion annuelle"
              title={
                <>
                  Rejoindre l&apos;annuaire TIJ{" "}
                  <span className="sm:block">en toute autonomie</span>
                </>
              }
              titleId="offre-adhesion-titre"
              principle="Vous restez maître de vos missions."
              accent="bg-sang-500"
            />

            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-700 sm:text-[17px]">
              Vous restez totalement autonome&nbsp;: vous gérez vous-même vos
              missions et votre facturation.
            </p>

            <div className="mt-8">
              <PointList points={ADHESION_POINTS} tone="sang" />
            </div>
          </div>

          <div className={PANEL_FOOTER}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
              Adhésion annuelle
            </p>
            <p className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-6xl font-semibold leading-none tabular-nums text-navy-900">
                270&nbsp;€
              </span>
              <span className="text-lg font-medium text-navy-700">TTC / an</span>
            </p>

            <div className="mt-6 border-l-2 border-gold-500 pl-5">
              <h4 className="font-display text-lg font-semibold text-navy-900">
                Ce que comprend votre adhésion
              </h4>
              <p className="mt-2 text-[15px] leading-relaxed text-navy-700/90">
                <span className="font-semibold text-navy-800">
                  Contrepartie&nbsp;:
                </span>{" "}
                une adhésion annuelle de 270&nbsp;€ TTC, qui correspond à une
                participation aux frais de communication engagés par TIJ pour
                ce référencement (impression et réactualisation des annuaires,
                frais graphiques, transport, frais d&apos;envoi des courriers
                postaux, mise sous pli).
              </p>
            </div>

            <div className="mt-auto pt-8">
              <OptionLink href={ADHESION_URL} tone="sang">
                Adhérer à l&apos;annuaire TIJ — 270&nbsp;€/an
              </OptionLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

