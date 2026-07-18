"use client";

import { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import regions from "@/assets/js/regions.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faUserPlus, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  useGetTradStatsQuery,
  useLazyGetTraducteursQuery,
} from "@/services/apis/traducteursApi";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { Skeleton } from "primereact/skeleton";
import { useGetAlllanguesQuery } from "@/services/apis/languesApi";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { getLevelLabel, languesBodyTemplate } from "@/pages/Admin/Traducteurs";
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
  }, [searchTerm, selectedreg, selectedLanguage, isExpert, isAssermente]);

  const handleResetFilters = () => {
    setSelectedLanguage(null);
    setSearchTerm("");
    setSelectedreg(null);
    setIsExpert(false);
    setIsAssermente(false);
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
      <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600">
        {/* decorative glows */}
        <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 md:p-8 lg:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur">
              <FontAwesomeIcon icon={faFlag} className="text-[10px]" />
              Annuaire des traducteurs &amp; interprètes professionnels
            </span>
            <h1 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white">
              Recherche de Traducteur / Interprète
            </h1>
            <p className="mt-3 text-sm md:text-base lg:text-lg text-white/85">
              Des experts linguistiques accessibles selon vos besoins et votre localisation.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-2 md:items-end">
            <a
              href="https://tally.so/r/XxLkAP"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-teal-700 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-600 transition-colors duration-300 group-hover:bg-teal-600 group-hover:text-white">
                <FontAwesomeIcon icon={faUserPlus} />
              </span>
              <span className="flex flex-col text-left leading-tight">
                <span className="text-[11px] font-medium text-teal-500/90">
                  Vous êtes interprète ?
                </span>
                <span className="text-base font-bold">Référencez-vous</span>
              </span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-1 text-sm transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <span className="text-center md:text-right text-xs text-white/70">
              Inscription en ligne à l'annuaire
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Langue</label>
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

        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Recherche</label>
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par Nom, Prénom..."
            className="w-full"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Régions</label>
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

        <div className="w-full flex flex-wrap gap-2 items-center mt-1">

          <div
            className="flex items-center cursor-pointer gap-2 bg-red-400 bg-opacity-10 border border-red-400 border-opacity-50 h-[46px] px-2 rounded-md"
            onClick={() =>
              onCheckboxChange({ target: { checked: !isExpert } }, "Expert assermenté")
            }
          >
            <input
              type="checkbox"
              className="cursor-pointer border-red-400 border-2 text-red-400 rounded-md w-[22px] h-[22px]"
              value={1}
              checked={isExpert}
              readOnly
            />
            <label className="text-sm cursor-pointer">Expert assermenté</label>
          </div>

          <div
            className="flex items-center cursor-pointer gap-2 bg-blue-400 bg-opacity-10 border border-blue-400 border-opacity-50 h-[46px] px-2 rounded-md"
            onClick={() =>
              onCheckboxChange({ target: { checked: !isAssermente } }, "CESEDA")
            }
          >
            <input
              type="checkbox"
              className="cursor-pointer border-blue-400 border-2 text-blue-400 rounded-md w-[22px] h-[22px]"
              value={1}
              checked={isAssermente}
              readOnly
            />
            <label className="text-sm cursor-pointer">CESEDA</label>
          </div>


        </div>
      </div>
      <button
        onClick={handleResetFilters}
        className="flex items-center  px-2 rounded-md text-sm whitespace-nowrap overflow-hidden text-ellipsis"
      >
        Réinitialiser les filtres
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 mb-10 shadow-ann-card p-4 rounded-md">
        <div className="flex items-center w-full p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600">
            <FontAwesomeIcon
              icon={faUsers}
              className="text-white text-2xl lg:text-4xl"
            />
          </div>
          <div className="flex flex-col ml-4">
            <span className="text-sm lg:text-base text-gray-500">Traducteurs & Interprètes</span>
            {!isFetchingStats ? (
              <span className="text-2xl lg:text-3xl font-bold text-gray-800">
                {data?.traducteurs?.total_trad}
              </span>
            ) : (
              <Skeleton
                animation="wave"
                height="24px"
                width="120px"
                className="bg-gray-300 rounded-full mt-1"
              />
            )}
          </div>
        </div>


        <div className="flex items-center w-full sm:w-[48%] p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700">
            <FontAwesomeIcon
              icon={faFlag}
              className="text-white text-2xl lg:text-4xl"
            />
          </div>
          <div className="flex flex-col ml-4">
            <span className="text-sm lg:text-base text-gray-500">Langues</span>
            {!isFetchingStats ? (
              <span className="text-2xl lg:text-3xl font-bold text-gray-800">
                {data?.traducteurs?.total_language}
              </span>
            ) : (
              <Skeleton
                animation="wave"
                height="24px"
                width="120px"
                className="bg-gray-300 rounded-full mt-1"
              />
            )}
          </div>
        </div>

      </div>

      <div className="overflow-x-auto max-w-full">
        <DataTable
          loading={showSpinner}
          emptyMessage="Aucun résultat trouvé"
          className="mb-10"
          responsiveLayout="scroll"
          value={tableData.slice(first, first + rows)}
          paginator
          rows={rows}
          first={first}
          onPage={(e) => setFirst(e.first)}
          totalRecords={tableData.length}
          lazy
        >
          <Column field="langue.name" header="Langue" body={languesBodyTemplate} />
          <Column
            field="identite"
            header="Identité"
            body={(rowData) => (
              <div className="flex gap-2 items-center">
                <span>{rowData.identite}</span>
                {rowData.level && (
                  <Tag
                    value={getLevelLabel(rowData.level)}
                    className={
                      rowData.level === "0"
                        ? "bg-blue-500"
                        : rowData.level === "1"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }
                  />
                )}
              </div>
            )}
          />
          <Column field="telephone" header="Téléphone" />
          <Column field="code_postal" header="Code Postal" />
        </DataTable>
      </div>
    </>
  );

}
