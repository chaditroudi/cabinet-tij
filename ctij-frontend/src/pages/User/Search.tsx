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
    if (type === "expert") {
      setIsExpert(e.target.checked);
    } else if (type === "assermente") {
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
      <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-semibold text-white">
          Recherche de Traducteur
        </h1>
        <p className="text-lg text-white mt-2">
          Trouvez rapidement des traducteurs qualifiés selon vos besoins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
        <div className="">
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
            className="w-full"
            filter // Enable search
            filterBy="region" // Search by the 'region' field
            showClear // Show clear button to reset selection
          />
        </div> */}
        <div>
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
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="expert-checkbox border-green-400 border-2 text-green-400 rounded-md w-[22px] h-[22px]"
              value={1}
              onChange={(e: any) => onCheckboxChange(e, "expert")}
              checked={isExpert}
            />

            <label htmlFor="expert" className="text-sm">
              Expert
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="assermente-checkbox border-blue-400 border-2 text-blue-400 rounded-md w-[22px] h-[22px]"
              id="assermente"
              value={0}
              onChange={(e: any) => onCheckboxChange(e, "assermente")}
              checked={isAssermente}
            />
            <label htmlFor="assermente" className="text-sm">
              Assermenté
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Recherche</label>
          <div className="flex w-fi">
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par Nom, Prénom..."
              className="w-full"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-20 mt-10 mb-10  shadow-ann-card p-1 px-4 py-4 rounded-sm">
        <div className="flex flex-row gap-4 flex-1 flex-wrap items-center">
          <div className="flex items-center ">
            <div className="rounded-full flex items-center justify-center bg-orange-500 w-[80px] h-[80px] ">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-white text-4xl "
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">Traducteurs</div>
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
            <div className="rounded-full flex items-center justify-center bg-teal-700 w-[80px] h-[80px] ">
              <FontAwesomeIcon icon={faFlag} className="text-white text-4xl" />
            </div>
          </div>

          <div className="flex flex-col gap-2  justify-center">
            <div className="flex flex-col gap-2">
              <div className="font-bold text-xl">Langues</div>
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
                    severity={
                      rowData.level == "0"
                        ? "info"
                        : rowData.level == "1"
                          ? "success"
                          : "secondary"
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
