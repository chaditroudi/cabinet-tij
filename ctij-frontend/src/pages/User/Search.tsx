"use client";

import { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import regions from "@/assets/js/regions.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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
      } catch (error) {
        console.error("Error fetching traducteurs:", error);
        setTableData([]);
      }
    };

    if (
      searchTerm ||
      selectedreg ||
      selectedLanguage ||
      isExpert ||
      isAssermente
    ) {
      fetchData();
    } else {
      setTableData([]);
    }
  }, [searchTerm, selectedreg, selectedLanguage, isExpert, isAssermente]);

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
      <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-3 lg:p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-md lg:text-3xl font-semibold text-white">
          Recherche de Traducteur / Interprète

        </h1>
        <p className="text-sm lg:text-lg text-white mt-2">
Des experts linguistiques accessibles selon vos besoins et votre localisation.        </p>
      </div>

      <div className="flex lg:flex-row flex-col gap-4 mb-6 ">
        <div className="flex-1 order-1 md:order-1">
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
            className="w-full lg:w-auto"
            filter // Enable search
            filterBy="name" // Search by the 'name' field
            showClear // Show clear button to reset selection
          />
        </div>
        {/* <div>
          <label className="block text-sm font-medium mb-1">Régions</label>
          <Dropdown
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.value)}
            options={regions}
            optionLabel="region"
            placeholder="Sélectionner une région"
            
            filter // Enable search
            filterBy="region" // Search by the 'region' field
            showClear // Show clear button to reset selection
          />
        </div> */}
        <div className="flex-1 order-3 lg:order-3">
          <label className="block text-sm font-medium mb-1">Recherche</label>
          <div className="flex w-fi">
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par Nom, Prénom..."
              className="w-full lg:w-auto"
            />
          </div>
        </div>
        <div className="flex-1 ">
          <label className="block text-sm font-medium mb-1">Régions</label>
          <Dropdown
            value={selectedreg}
            onChange={(e) => setSelectedreg(e.value)}
            options={regions}
            optionLabel="region"
            optionValue="code"
            placeholder="Sélectionner une région"
            className="w-full lg:w-auto"
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
        <div className="flex gap-4 items-center mt-[5px] lg:mt-[22px]  order-4 md:order-3">
          {/* Expert */}
          <div
            className="flex cursor-pointer items-center hover:bg-opacity-30 gap-2 bg-red-400 bg-opacity-10 border-opacity-50 border-red-400 border h-[46px] px-2 rounded-md"
            onClick={() =>
              onCheckboxChange({ target: { checked: !isExpert } }, "expert")
            }
          >
            <input
              type="checkbox"
              className="expert-checkbox cursor-pointer border-red-400 border-2 text-red-400 rounded-md w-[22px] h-[22px]"
              value={1}
              checked={isExpert}
              readOnly
            />
            <label className="text-sm cursor-pointer">Expert</label>
          </div>

          {/* Assermenté */}
          <div
            className="flex items-center cursor-pointer gap-2 hover:bg-opacity-30 bg-blue-400 bg-opacity-10 border-opacity-50 border-blue-400 border h-[46px] px-2 rounded-md"
            onClick={() =>
              onCheckboxChange(
                { target: { checked: !isAssermente } },
                "assermente"
              )
            }
          >
            <input
              type="checkbox"
              className="assermente-checkbox cursor-pointer border-blue-400 border-2 text-blue-400 rounded-md w-[22px] h-[22px]"
              value={1}
              checked={isAssermente}
              readOnly
            />
            <label className="text-sm cursor-pointer">Assermenté</label>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-3 flex-wrap md:gap-20 mt-10 mb-10  shadow-ann-card p-1 px-4 py-4 rounded-sm">
        <div className="flex flex-row gap-4 flex-1 items-cente flex-nowrap">
          <div className="flex items-center ">
            <div className="rounded-full flex items-center justify-center bg-orange-500 w-[50px] h-[50px] lg:h-[80px] lg:w-[80px]">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-white text-xl lg:text-4xl"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 lg:gap-2 ">
            <div className="font-bold text-md lg:xl">Traducteurs & Interprètes</div>
            {!isFetchingStats ? (
              <div className="text-orange-500 font-semibold">
                {data?.traducteurs?.total_trad}
              </div>
            ) : (
              <Skeleton
                animation="wave"
                height="10px"
                width="120px"
                className="bg-gray-300 rounded-full"
              />
            )}
          </div>
        </div>
        <div className="flex flex-row gap-4 flex-1">
          <div className="flex items-center">
            <div className="rounded-full flex items-center justify-center bg-teal-700 w-[50px] h-[50px] lg:h-[80px] lg:w-[80px]">
              <FontAwesomeIcon
                icon={faFlag}
                className="text-white text-xl lg:text-4xl"
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 flex-1 items-cente flex-nowrap">
            <div className="flex flex-col gap-1 lg:gap-2 ">
              <div className="font-bold text-md lg:xl">Langues</div>
              {!isFetchingStats ? (
                <div className="text-teal-700 font-semibold">
                  {data?.traducteurs?.total_language}
                </div>
              ) : (
                <Skeleton
                  animation="wave"
                  height="10px"
                  width="120px"
                  className="bg-gray-300 rounded-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto ">
        <DataTable
          value={tableData}
          loading={showSpinner}
          emptyMessage="Aucun résultat trouvé"
          className="mb-10"
          responsiveLayout="scroll"
        >
          <Column
            field="langue.name"
            header="Langue"
            body={languesBodyTemplate}
          />
          <Column
            field="identite"
            header="Identité"
            body={(rowData) => (
              <div className="flex flex-row gap-2">
                <div>{rowData.identite}</div>
                {rowData.level && (
                  <Tag
                    value={getLevelLabel(rowData.level)}
                    className={
                      rowData.level == "0"
                        ? "bg-blue-500"
                        : rowData.level == "1"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }
                  />
                )}
              </div>
            )}
          />
          <Column field="telephone" header="Téléphone" />
        </DataTable>
      </div>
    </>
  );
}
