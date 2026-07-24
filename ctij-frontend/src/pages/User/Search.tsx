"use client";

import { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import regions from "@/assets/js/regions.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faUserPlus,
  faArrowRight,
  faFilter,
  faRotateLeft,
  faCheck,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
  useGetTradStatsQuery,
  useLazyGetTraducteursQuery,
} from "@/services/apis/traducteursApi";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { Skeleton } from "primereact/skeleton";
import { useGetAlllanguesQuery } from "@/services/apis/languesApi";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  getLevelLabel,
  getTelephone,
  languesBodyTemplate,
} from "@/pages/Admin/Traducteurs";
import { Tag } from "primereact/tag";
interface TableData {
  id: number;
  identite: string;
  telephone: string;
  region: string;
  langue: {
    name: string;
    id: string;
  };
}

export function Search() {
  const [selectedLanguage, setSelectedLanguage] = useState(null) as any;
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [selectedreg, setSelectedreg] = useState(null) as any;
  const [languages, setlangues] = useState(null) as any;
  const [isExpert, setIsExpert] = useState(false);
  const [isAssermente, setIsAssermente] = useState(false);
  const [isPermanence, setIsPermanence] = useState(false);

  //start Raoua new updates
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  // and Raoua new updates

  const [triggerGettraducteurs, { isFetching, isLoading }] =
    useLazyGetTraducteursQuery();
  const isFirstRender = useRef(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [_, setSpinnerVisible] = useState(false);
  const { data: fetchedLangues } = useGetAlllanguesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data, isFetching: isFetchingStats } = useGetTradStatsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  useEffect(() => {
    if (fetchedLangues) setlangues(fetchedLangues.langues);
  }, [fetchedLangues]);
  const onCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (type === "Expert assermenté") {
      setIsExpert(e.target.checked);
    } else if (type === "CESEDA") {
      setIsAssermente(e.target.checked);
    } else if (type === "Permanence") {
      setIsPermanence(e.target.checked);
    }
  };

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let minDisplayTimer: NodeJS.Timeout;

    if (isFetching || isLoading) {
      delayTimer = setTimeout(() => {
        setSpinnerVisible(true);
      }, 200);

      setShowSpinner(true);
    } else {
      if (showSpinner) {
        minDisplayTimer = setTimeout(() => {
          setShowSpinner(false);
          setSpinnerVisible(false);
        }, 500);
      } else {
        setShowSpinner(false);
        setSpinnerVisible(false);
      }
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(minDisplayTimer);
    };
  }, [isFetching, isLoading, showSpinner]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await triggerGettraducteurs({
          search: searchTerm || "",
          region: selectedreg || "",
          langue: selectedLanguage || "",
          expert: isExpert,
          assermente: isAssermente,
          permanence: isPermanence,
        }).unwrap();

        setTableData(result.traducteurs || []);
        setFirst(0); // reset to first page on new filter
      } catch (error) {
        console.error("Error fetching traducteurs:", error);
        setTableData([]);
      }
    };

    const hasAnyFilter =
      searchTerm ||
      selectedreg ||
      selectedLanguage ||
      isExpert ||
      isAssermente ||
      isPermanence;

    if (hasAnyFilter) {
      fetchData();
    } else {
      setTableData([]); // optional: clear table when no filter
    }
  }, [
    searchTerm,
    selectedreg,
    selectedLanguage,
    isExpert,
    isAssermente,
    isPermanence,
  ]);

  const handleResetFilters = () => {
    setSelectedLanguage(null);
    setSearchTerm("");
    setSelectedreg(null);
    setIsExpert(false);
    setIsAssermente(false);
    setIsPermanence(false);
  };

  // // 1️⃣ Build a new array once with a `label` property:
  // const optionsWithLabel = useMemo(
  //   () =>
  //     region.map((d) => ({
  //       ...d,
  //       label: `${d.code} - ${d.name}`, // exactly what shows in the UI
  //     })),
  //   [region]
  // );
  return (
    <>
      <div className="relative overflow-hidden rounded-2xl shadow-soft-lg mb-8 bg-navy-900">
        {/* background photo — international flags */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/hero-flags.jpg')" }}
        />
        {/* navy brand overlay for contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-800/55" />
        {/* subtle gold accent glow */}
        <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 md:p-8 lg:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur">
              <FontAwesomeIcon icon={faFlag} className="text-[10px] text-gold-500" />
              Annuaire des traducteurs &amp; interprètes professionnels
            </span>
            <h1 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white">
              Recherche de Traducteur / Interprète
            </h1>
            <p className="mt-3 text-sm md:text-base lg:text-lg text-white/80">
              Des experts linguistiques accessibles selon vos besoins et votre localisation.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-2 md:items-end">
            <span className="text-sm font-medium text-white/90 md:text-right">
              Interprètes &amp; Traducteurs judiciaires
            </span>
            <a
              href="https://tally.so/r/XxLkAP"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-navy-900 shadow-soft ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition-colors duration-300 group-hover:bg-navy-900 group-hover:text-gold-500">
                <FontAwesomeIcon icon={faUserPlus} />
              </span>
              <span className="text-base font-bold">Rejoignez-nous</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-1 text-sm transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-paper-border bg-white p-5 md:p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
            <FontAwesomeIcon icon={faFilter} className="text-gold-600" />
            Filtrer l'annuaire
          </h2>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-paper-border px-3 py-1.5 text-xs font-medium text-navy-700 transition-colors hover:border-navy-700 hover:bg-navy-50 hover:text-navy-900"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="text-[11px]" />
            Réinitialiser
          </button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="w-full lg:flex-1 lg:min-w-[200px]">
            <label className="mb-1.5 block text-xs font-semibold text-muted">
              Langue
            </label>
            <Dropdown
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.value)}
              options={languages}
              optionLabel="name"
              optionValue="id"
              placeholder="Sélectionner une langue"
              emptyMessage="Aucune option disponible"
              emptyFilterMessage="Aucune option disponible"
              className="w-full"
              filter
              filterBy="name"
              showClear
            />
          </div>

          <div className="w-full lg:flex-1 lg:min-w-[200px]">
            <label className="mb-1.5 block text-xs font-semibold text-muted">
              Recherche
            </label>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par Nom, Prénom..."
              className="w-full"
            />
          </div>

          <div className="w-full lg:flex-1 lg:min-w-[200px]">
            <label className="mb-1.5 block text-xs font-semibold text-muted">
              Région
            </label>
            <Dropdown
              value={selectedreg}
              onChange={(e) => setSelectedreg(e.value)}
              options={regions}
              optionLabel="region"
              optionValue="code"
              placeholder="Sélectionner une région"
              className="w-full"
              filter
              emptyMessage="Aucune option disponible"
              emptyFilterMessage="Aucune option disponible"
              filterPlaceholder="Recherche…"
              filterBy="region"
              filterMatchMode="contains"
              showClear
              itemTemplate={(opt) => <div>{opt.region}</div>}
            />
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onCheckboxChange(
                  { target: { checked: !isExpert } },
                  "Expert assermenté"
                )
              }
              aria-pressed={isExpert}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all ${
                isExpert
                  ? "border-sang-500 bg-sang-500 text-white shadow-soft"
                  : "border-paper-border bg-white text-navy-700 hover:border-sang-500 hover:text-sang-500"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  isExpert ? "border-white/70 bg-white/20" : "border-current"
                }`}
              >
                {isExpert && (
                  <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
                )}
              </span>
              Expert assermenté
            </button>

            <button
              type="button"
              onClick={() =>
                onCheckboxChange(
                  { target: { checked: !isAssermente } },
                  "CESEDA"
                )
              }
              aria-pressed={isAssermente}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all ${
                isAssermente
                  ? "border-navy-800 bg-navy-800 text-white shadow-soft"
                  : "border-paper-border bg-white text-navy-700 hover:border-navy-700 hover:text-navy-900"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  isAssermente ? "border-white/70 bg-white/20" : "border-current"
                }`}
              >
                {isAssermente && (
                  <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
                )}
              </span>
              CESEDA
            </button>

            <button
              type="button"
              onClick={() =>
                onCheckboxChange(
                  { target: { checked: !isPermanence } },
                  "Permanence"
                )
              }
              aria-pressed={isPermanence}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all ${
                isPermanence
                  ? "border-amber-600 bg-amber-600 text-white shadow-soft"
                  : "border-paper-border bg-white text-navy-700 hover:border-amber-600 hover:text-amber-700"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  isPermanence ? "border-white/70 bg-white/20" : "border-current"
                }`}
              >
                {isPermanence && (
                  <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
                )}
              </span>
              Permanence
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-6">
        {/* Traducteurs & Interprètes */}
        <div className="flex items-center gap-3 rounded-xl border border-paper-border bg-white p-3.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 shadow-soft">
            <FontAwesomeIcon icon={faUsers} className="text-white text-base" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-xs font-medium text-muted">
              Traducteurs &amp; Interprètes
            </span>
            {!isFetchingStats ? (
              <span className="text-2xl font-bold leading-none text-navy-900 tabular-nums">
                {data?.traducteurs?.total_trad}
              </span>
            ) : (
              <Skeleton
                animation="wave"
                height="28px"
                width="80px"
                className="bg-navy-50 rounded-md mt-1"
              />
            )}
          </div>
        </div>

        {/* Langues */}
        <div className="flex items-center gap-3 rounded-xl border border-paper-border bg-white p-3.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-soft">
            <FontAwesomeIcon icon={faFlag} className="text-navy-900 text-base" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-xs font-medium text-muted">Langues</span>
            {!isFetchingStats ? (
              <span className="text-2xl font-bold leading-none text-navy-900 tabular-nums">
                {data?.traducteurs?.total_language}
              </span>
            ) : (
              <Skeleton
                animation="wave"
                height="28px"
                width="80px"
                className="bg-navy-50 rounded-md mt-1"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mb-10 overflow-hidden rounded-2xl border border-paper-border bg-white shadow-soft">
        <div className="max-w-full overflow-x-auto">
          <DataTable
            loading={showSpinner}
            emptyMessage={
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-600">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>
                <span className="text-sm font-semibold text-navy-900">
                  Aucun résultat trouvé
                </span>
                <span className="text-xs text-muted">
                  Ajustez vos filtres ou lancez une nouvelle recherche.
                </span>
              </div>
            }
            responsiveLayout="scroll"
            value={tableData.slice(first, first + rows)}
            paginator
            rows={rows}
            first={first}
            onPage={(e) => setFirst(e.first)}
            totalRecords={tableData.length}
            lazy
          >
            <Column
              field="langue.name"
              header="Langue"
              body={(rowData) => (
                <span className="inline-flex rounded-md bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-800">
                  {languesBodyTemplate(rowData)}
                </span>
              )}
            />
            <Column
              field="identite"
              header="Identité"
              body={(rowData) => (
                <div className="flex gap-2 items-center">
                  <span className="font-medium text-navy-900">
                    {rowData.identite}
                  </span>
                  {rowData.level && (
                    <Tag
                      value={getLevelLabel(rowData.level)}
                      style={{
                        backgroundColor:
                          rowData.level === "0"
                            ? "#1B2A4A"
                            : rowData.level === "1"
                              ? "#B23A48"
                              : rowData.level === "2"
                                ? "#B7791F"
                                : "#6B7280",
                        color: "#ffffff",
                      }}
                    />
                  )}
                </div>
              )}
            />
            <Column field="telephone" header="Téléphone" body={getTelephone} />
            <Column field="code_postal" header="Code Postal" />
          </DataTable>
        </div>
      </div>
    </>
  );

}
