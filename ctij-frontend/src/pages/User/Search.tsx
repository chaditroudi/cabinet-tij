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
  getTelephone,
  IdentiteBadges,
  languesBodyTemplate,
} from "@/pages/Admin/Traducteurs";
import { AnnuaireHero } from "@/pages/User/AnnuaireHero";
import { DevisSection } from "@/pages/User/DevisSection";
import { RejoindreReseauSection } from "@/pages/User/RejoindreReseauSection";
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
          permanence: false,
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
      isAssermente;

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
  ]);

  const handleResetFilters = () => {
    setSelectedLanguage(null);
    setSearchTerm("");
    setSelectedreg(null);
    setIsExpert(false);
    setIsAssermente(false);
  };

  const scrollToFilters = () => {
    document
      .getElementById("annuaire-filters")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToJoin = () => {
    document
      .getElementById("rejoignez-nous")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <AnnuaireHero
        onSearchClick={scrollToFilters}
        onJoinClick={scrollToJoin}
      />

      <h1 className="sr-only">Recherche de Traducteur / Interprète</h1>

      <div
        id="annuaire-filters"
        className="mb-8 scroll-mt-28 rounded-2xl border border-paper-border bg-white p-5 md:p-6 shadow-soft"
      >
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

      <div className="mb-8 overflow-hidden rounded-2xl border border-paper-border bg-white shadow-soft">
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
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="font-medium text-navy-900">
                    {rowData.identite}
                  </span>
                  <IdentiteBadges rowData={rowData} />
                </div>
              )}
            />
            <Column field="telephone" header="Téléphone" body={getTelephone} />
            <Column field="code_postal" header="Code Postal" />
          </DataTable>
        </div>
      </div>

      <RejoindreReseauSection />

      <DevisSection />
    </>
  );

}
