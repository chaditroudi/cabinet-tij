import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileSignature,
  faArrowRight,
  faStamp,
} from "@fortawesome/free-solid-svg-icons";

export const DEVIS_MAILTO =
  "mailto:contact@cabinet-tij.com?subject=Demande%20de%20devis%20-%20traduction%20asserment%C3%A9e";

export function DevisSection() {
  return (
    <section
      id="obtenir-devis"
      aria-labelledby="devis-heading"
      className="relative mb-10 scroll-mt-28 overflow-hidden rounded-2xl border border-paper-border bg-white shadow-soft"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sang-500/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-gold-500/10 blur-2xl" />

      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:gap-10 md:p-8 lg:p-10">
        <div className="flex min-w-0 flex-1 gap-4 md:gap-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sang-500 text-white shadow-soft md:h-14 md:w-14">
            <FontAwesomeIcon icon={faFileSignature} className="text-lg" />
          </span>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-800">
              <FontAwesomeIcon icon={faStamp} className="text-[9px] text-gold-600" />
              Traduction officielle
            </span>
            <h2
              id="devis-heading"
              className="mt-3 font-display text-xl font-semibold leading-snug text-navy-900 md:text-2xl lg:text-3xl"
            >
              Besoin d&apos;une traduction assermentée&nbsp;?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              Documents administratifs, juridiques ou judiciaires&nbsp;: obtenez
              un devis personnalisé selon la langue, la nature et le volume de
              vos pièces.
            </p>
          </div>
        </div>

        <a
          href={DEVIS_MAILTO}
          className="group inline-flex shrink-0 items-center justify-center gap-3 self-stretch rounded-full bg-sang-500 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-sang-600 hover:shadow-soft-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sang-500 md:self-center"
        >
          Obtenir un devis
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-xs transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>
    </section>
  );
}
