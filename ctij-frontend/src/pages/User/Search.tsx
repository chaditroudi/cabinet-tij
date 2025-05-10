"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import regions from "@/assets/js/regions.json";
import { ProgressSpinner } from "primereact/progressspinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import useAuthContext from "@/context/AuthContext";
import {
  useGetTradStatsQuery,
  useLazyGetTraducteursQuery,
} from "@/services/apis/traducteursApi";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { Skeleton } from "primereact/skeleton";
import { useGetAlllanguesQuery } from "@/services/apis/languesApi";
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
  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let minDisplayTimer: NodeJS.Timeout;

    if (isFetching || isLoading) {
      delayTimer = setTimeout(() => {
        setSpinnerVisible(true);
      }, 200); // delay showing spinner slightly

      setShowSpinner(true);
    } else {
      if (showSpinner) {
        // If spinner was showing, keep it for at least 500ms
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
        }).unwrap();
        setTableData(result.traducteurs || []);
      } catch (error) {
        console.error("Error fetching traducteurs:", error);
        setTableData([]);
      }
    };
    if (searchTerm || selectedreg || selectedLanguage) {
      fetchData();
    } else {
      setTableData([]);
    }
  }, [searchTerm, selectedreg, selectedLanguage]);

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
        <div>
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
              data?.traducteurs?.total_trad
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
                data?.traducteurs?.total_language
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
        <table className="min-w-full bg-white border border-gray-200 mb-10">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Langue</th>
              <th className="py-2 px-4 border-b text-left">Identité</th>
              <th className="py-2 px-4 border-b text-left">Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {showSpinner ? (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  <div className="m-2 bg-white h-full   shadow-sm ring-1 ring-gray-900/5 sm:rounded-md md:col-span-2 p-2">
                    <div className="card p-fluid h-full">
                      <div className="h-full gap-3 flex-col flex justify-center items-center">
                        <ProgressSpinner />
                        <div>Loading...</div>
                      </div>
                    </div>
                  </div>{" "}
                </td>
              </tr>
            ) : tableData.length > 0 ? (
              tableData.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{item?.langue?.name}</td>
                    <td className="py-2 px-4 border-b">{item.identite}</td>
                    <td className="py-2 px-4 border-b">{item.telephone}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  Aucun résultat trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
