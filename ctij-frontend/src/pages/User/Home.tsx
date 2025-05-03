"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import departement from "@/assets/js/departements.json";
import languages from "@/assets/js/languages.json";
import { useLazyGetContactsQuery } from "@/services/apis/contactsApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { contact_status } from "@/pages/Admin/Contacts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faUsers,
  faUsersRectangle,
} from "@fortawesome/free-solid-svg-icons";
import useAuthContext from "@/context/AuthContext";
interface TableData {
  id: number;
  dispo: string;
  langue: string;
  identite: string;
  telephone: string;
  region: string;
  gender: string;
}

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState(null) as any;
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [selectedDept, setSelectedDept] = useState(null) as any;
  const { getLanguageLabel } = useAuthContext();

  const [triggerGetContacts, { isFetching, isLoading }] =
    useLazyGetContactsQuery();
  const isFirstRender = useRef(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [_, setSpinnerVisible] = useState(false);

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
        const result = await triggerGetContacts({
          search: searchTerm || "",
          code_dept: selectedDept?.code || "",
          langue: selectedLanguage?.code || "",
        }).unwrap();
        setTableData(result.contacts || []);
      } catch (error) {
        // Clear table on error
        console.error("Error fetching contacts:", error);
        setTableData([]);
      }
    };
    if (searchTerm || selectedDept || selectedLanguage) {
      fetchData();
    } else {
      setTableData([]);
    }
  }, [searchTerm, selectedDept, selectedLanguage]);

  // 1️⃣ Build a new array once with a `label` property:
  const optionsWithLabel = useMemo(
    () =>
      departement.map((d) => ({
        ...d,
        label: `${d.code} - ${d.name}`, // exactly what shows in the UI
      })),
    [departement]
  );
  return (
    <>
      <h1 className="text-2xl font-bold mb-6 ">Recherche de Traducteur</h1>
      <div className="flex flex-row gap-2 md:gap-20 mt-10 mb-10  shadow-ann-card p-1 px-4 py-4 rounded-sm flex-wrap">
        {contact_status.map((item) => (
          <div className="flex flex-row gap-3">
            <div>{item.label}</div>
            <div
              className={`inline-block border-[3px] w-[20px] h-[20px] rounded-full text-xs  ${item.color.toString()}`}
            ></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
        <div>
          <label className="block text-sm font-medium mb-1">Langue</label>
          <Dropdown
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.value)}
            options={languages}
            optionLabel="name"
            placeholder="Sélectionner une langue"
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
          <label className="block text-sm font-medium mb-1">Départements</label>
          <Dropdown
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.value)}
            // 2️⃣ Use your new array
            options={optionsWithLabel}
            // 3️⃣ Display the label in the dropdown and filter by it
            optionLabel="label"
            placeholder="Sélectionner un Département"
            className="w-full"
            filter
            filterPlaceholder="Recherche…"
            filterBy="label" // ← now searches the full "code - name" string
            filterMatchMode="contains"
            showClear
            // 4️⃣ Your template can just render the label too (or break it out if you prefer)
            itemTemplate={(opt) => <div>{opt.label}</div>}
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
        <div className="flex flex-row gap-4 flex-1">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faUsersRectangle}
              className="text-orange-500 text-5xl "
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">444 Traducteurs</div>
            <div className="text-xs">52 interprètes dispos</div>
            <div className="text-xs">51 interprètes dispos SMS</div>
          </div>
        </div>
        <div className="flex flex-row gap-4 flex-1">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faFlag}
              className="text-teal-700 text-5xl "
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">120 Langues</div>
            <div className="text-xs">63 langues disponibles</div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto ">
        <table className="min-w-full bg-white border border-gray-200 mb-10">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Dispo</th>
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
                const status = contact_status.find(
                  (s) => s.value === item.dispo.toString()
                );

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      <a
                        href={`sip:${item.telephone}`}
                        className={`inline-block border-[4px] w-[20px] h-[20px] rounded-full text-xs ${status?.color}`}
                      ></a>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {getLanguageLabel(item.langue, languages)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {item?.gender == "0" ? "Mr" : "Mme"} {item.identite}
                    </td>
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
