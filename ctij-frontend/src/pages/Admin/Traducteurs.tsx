"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import Swal from "sweetalert2";
import regions from "@/assets/js/regions.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faSearch,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import useAuthContext from "@/context/AuthContext";
import {
  useDeleteTraducteurMutation,
  useGetAlltraducteursQuery,
  useSaveTraducteurMutation,
  useUpdateTraducteurMutation,
} from "@/services/apis/traducteursApi";
import { useGetAlllanguesQuery } from "@/services/apis/languesApi";
import { debounce } from "lodash";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";

export const traducteur_status = [
  { label: "Disponible", value: "1", color: "border-green-500" },
  { label: "Disponible par Téléphone", value: "2", color: "border-gray-700" },
  { label: "Disponible  par sms", value: "3", color: "border-orange-400" },
  { label: "Disponibilité inconnu", value: "4", color: "border-red-700" },
];

interface traducteur {
  id: number;
  identite: string;
  telephone: string;
  region: string;
  level: string;
  code_postal: string;
  langue_ids: [];
}

interface FormData {
  id: number | null;
  identite: string;
  telephone: string;
  region: string;
  level: string;
  code_postal: string;
  langue_ids: [];
}

export const languesBodyTemplate = (rowData: any) => {
  const langs = rowData.langues ?? [];
  return langs.map((l: any) => l.name).join(", ");
};
export function getLevelLabel(level: string) {
  switch (level) {
    case "0":
      return "CESEDA";
    case "1":
      return "Expert assermenté";
  }
}
export function Traducteurs() {
  const [traducteurs, setTraducteurs] = useState<traducteur[]>([]);
  const [total, setTotal] = useState<any>();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [updateTraducteur] = useUpdateTraducteurMutation();
  const [deleteTraducteur] = useDeleteTraducteurMutation();
  const [saveTraducteur] = useSaveTraducteurMutation();
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const getRegionLabel = (code: string) => {
    const found = regions.find((reg) => reg.code === code);
    return found ? `${found.code} - ${found.region}` : code;
  };

  const levelOptions = [
    { label: "CESEDA", value: 0 },
    { label: "Expert assermenté", value: 1 },
  ];

  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedKeyword(value);
    }, 300),
    []
  );
  const [langues, setlangues] = useState<FormData[]>([]);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: fetchedData, isLoading } = useGetAlllanguesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (fetchedData) setlangues(fetchedData.langues);
  }, [fetchedData]);

  const { TopEndAlert } = useAuthContext();

  const { data } = useGetAlltraducteursQuery(
    { page, keyword: debouncedKeyword },
    { refetchOnMountOrArgChange: true }
  );
  const [formData, setFormData] = useState<FormData>({
    id: null,
    identite: "",
    telephone: "",
    region: "",
    level: "",
    code_postal: "",

    langue_ids: [],
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (data || searchTerm) {
      setTraducteurs(data?.traducteurs.data);
      setTotal(data?.traducteurs.total);
    }
  }, [data, searchTerm]);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      identite: "",
      telephone: "",
      region: "",
      level: "",
      code_postal: "",
      langue_ids: [],
    });
  };
  const openNew = () => {
    setFormData({
      id: null,
      identite: "",
      telephone: "",
      region: "",
      level: "",
      code_postal: "",

      langue_ids: [],
    });
    setSubmitted(false);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDialogVisible(false);
  };

  const edittraducteur = (traducteur: any) => {
    setFormData({
      id: traducteur.id,
      identite: traducteur.identite,
      telephone: traducteur.telephone,
      region: traducteur.region,
      level: traducteur.level,
      code_postal: traducteur.code_postal,
      langue_ids: traducteur.langues.map((l: any) => l.id),
    });
    setSubmitted(false);
    setDialogVisible(true);
  };

  const deletetraducteur = (traducteur: traducteur) => {
    let id = traducteur?.id;
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Voulez-vous supprimer le traducteur ${traducteur.identite} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTraducteur({ id }).unwrap();
        TopEndAlert("error", "Traducteur supprimé", "#fff");
      }
    });
  };
  const savetraducteur = async () => {
    setSubmitted(true);

    if (
      !formData.identite.trim() ||
      !formData.telephone.trim() ||
      !formData.region ||
      formData.langue_ids.length === 0
    ) {
      TopEndAlert(
        "error",
        "Veuillez remplir tous les champs requis et sélectionner au moins une langue.",
        "#fff"
      );
      return;
    }

    const payload = {
      identite: formData.identite,
      telephone: formData.telephone,
      region: formData.region,
      level: formData.level,
      code_postal: formData.code_postal,
      langue_ids: formData.langue_ids,
    };

    try {
      if (formData.id) {
        const updated = await updateTraducteur({
          id: formData.id,
          data: payload,
        }).unwrap();

        setTraducteurs((prev) =>
          prev.map((t) =>
            t.id === formData.id
              ? { ...t, ...updated, langues: updated.langues }
              : t
          )
        );
        setDialogVisible(false);

        TopEndAlert("success", "Traducteur modifié avec succès", "#fff");
      } else {
        const created = await saveTraducteur(payload).unwrap();

        setTraducteurs((prev) => [created, ...prev]);
        setDialogVisible(true);
        TopEndAlert("success", "Traducteur ajouté avec succès", "#fff");
      }

      setSubmitted(false);

      resetForm();
    } catch (e: any) {
      TopEndAlert(
        "error",
        e?.data?.message || "Une erreur est survenue",
        "#fff"
      );
      setSubmitted(false);
    }
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value.replace(/\D/g, "").substring(0, 5); // Only digits, max 5

  const syntheticEvent = {
    ...e,
    target: {
      ...e.target,
      value, // direct number string
    },
  } as React.ChangeEvent<HTMLInputElement>;

  onInputChange(syntheticEvent, "code_postal");
};

  const onDropdownChange = (e: { value: any }, name: string) => {
    const val = e.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  const actionBodyTemplate = (rowData: traducteur) => {
    return (
      <div className="flex gap-4">
        <button onClick={() => edittraducteur(rowData)}>
          <FontAwesomeIcon icon={faEdit} className="text-blue-900" />
        </button>

        <button onClick={() => deletetraducteur(rowData)}>
          <FontAwesomeIcon icon={faTrashAlt} className="text-red-700" />
        </button>
      </div>
    );
  };

  const header = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-white rounded-md shadow-sm border mb-4">
      <h2 className="text-2xl flex-1 font-semibold text-gray-800">
        Liste des Traducteurs
      </h2>

      <div className="relative md:max-w-sm w-full">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <InputText
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Rechercher par Identité"
          className="w-full h-[40px] pl-10"
        />
      </div>

      <button
        onClick={openNew}
        className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md shadow-sm transition duration-150 flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faPlusCircle} />
        <span className="font-normal">Ajouter Traducteur</span>
      </button>
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={hideDialog}
        className="h-[40px]  bg-red-900 text-white hover:text-red-900 px-2 hover:bg-opacity-45 hover:shadow-lg  border-red-900 border rounded-md"
      >
        Annuler
      </button>

      <button
        onClick={() => savetraducteur()}
        className="h-[40px]  bg-blue-900 text-white hover:text-blue-900 px-2 hover:bg-opacity-45 hover:shadow-lg  border-blue-900 border rounded-md"
      >
        {!formData.id ? "Ajouter & Continuer" : "Enregistrer"}
      </button>
    </div>
  );

  return (
    <div>
      <DataTable
        value={traducteurs}
        header={header}
        resizableColumns
        lazy
        dataKey="id"
        scrollable
        scrollHeight="flex" // or set to "400px" or "100%"
        className="p-datatable-traducteurs"
        emptyMessage="Aucun traducteur disponible"
        paginator
        rows={limit}
        totalRecords={total || 0}
        loading={isLoading}
        first={(page - 1) * limit}
        onPage={(e: any) => setPage(e.page + 1)}
      >
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
        <Column field="telephone" header="Numéro Tél" />
        <Column field="code_postal" header="Code postal" />
        <Column
          field="region"
          header="Région"
          body={(rowData) => getRegionLabel(rowData.region)}
        />
        <Column
          field="langue"
          header="Langues"
          body={(rowData) => (
            <div className="bg-orange-600 text-white px-2 w-fit rounded-md mr-1">
              {languesBodyTemplate(rowData)}
            </div>
          )}
        />

        {/* Fixed column on the right */}
        <Column
          header="Action"
          body={actionBodyTemplate}
          exportable={false}
          frozen
          alignFrozen="right"
          style={{ width: "80px", textAlign: "center" }}
        />
      </DataTable>

      <Dialog
        visible={dialogVisible}
        style={{ width: "550px" }}
        header={formData.id ? "Editer Traducteur" : "Ajouter Traducteur"}
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={hideDialog}
      >
        <div className="flex flex-row gap-2">
          <div className="field mt-4">
            <div className="mb-1" id="identite">
              Nom & Prénom
            </div>
            <InputText
              id="identite"
              value={formData.identite}
              onChange={(e) => onInputChange(e, "identite")}
              required
              className={classNames({
                "p-invalid": submitted && !formData.identite,
              })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  savetraducteur();
                }
              }}
            />
            {submitted && !formData.identite && (
              <small className="p-error">Nom & Prénom requis.</small>
            )}
          </div>

          <div className="field mt-4">
            <div id="telephone" className="mb-1">
              Num Téléphone
            </div>
            <InputText
              id="telephone"
              value={formData.telephone}
              onChange={(e) => onInputChange(e, "telephone")}
              required
              className={classNames({
                "p-invalid": submitted && !formData.telephone,
              })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  savetraducteur();
                }
              }}
            />
            {submitted && !formData.telephone && (
              <small className="p-error">Téléphone requis.</small>
            )}
          </div>
        </div>
        <div className="field mt-4">
          <div id="telephone" className="mb-1">
            Code Postal
          </div>
          <InputText
            id="codepostal"
            value={formData.code_postal}
            onChange={handlePostalCodeChange}
            maxLength={6}
            required
            onKeyDown={(e) => {
              const allowedKeys = [
                "Backspace",
                "Tab",
                "ArrowLeft",
                "ArrowRight",
                "Delete",
              ];
              if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
              if (e.key === "Enter") {
                e.preventDefault();
                savetraducteur();
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("Text");
              if (!/^\d+$/.test(pasted)) {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="field mt-4">
          <div id="region" className="mb-1">
            Niveau
          </div>

          <Dropdown
            id="level"
            value={parseInt(formData.level)}
            onChange={(e) => onDropdownChange(e, "level")}
            options={levelOptions}
            optionLabel="label"
            optionValue="value"
            placeholder="Sélectionner le niveau"
            showClear
            emptyMessage="Aucune option disponible"
            emptyFilterMessage="Aucune option disponible"
          />
        </div>

        <div className="field mt-4">
          <div id="region" className="mb-1">
            Régions
          </div>

          <Dropdown
            id="region"
            value={formData.region}
            onChange={(e) => onDropdownChange(e, "region")}
            options={regions}
            optionLabel="region"
            optionValue="code" // ← tell it to match by the `code` field
            placeholder="Sélectionner une Région"
            filter
            filterPlaceholder="Recherche…"
            filterBy="label"
            filterMatchMode="contains"
            showClear
            emptyMessage="Aucune option disponible"
            emptyFilterMessage="Aucune option disponible"
            itemTemplate={(opt) => <div>{opt.region}</div>}
            className={classNames({
              "p-invalid": submitted && !formData.region,
            })}
          />

          {submitted && !formData.region && (
            <small className="p-error">region requis.</small>
          )}
        </div>

        <div className="field mt-4">
          <div id="languages" className="mb-1">
            Langues
          </div>
          <MultiSelect
            id="languages"
            value={formData.langue_ids} // now holds an array of numbers
            onChange={(e) => onDropdownChange(e, "langue_ids")}
            options={langues}
            optionLabel="name"
            optionValue="id"
            placeholder="Sélectionner des langues"
            display="chip"
            filter
            required
            className={classNames({
              "p-invalid": submitted && !formData.langue_ids?.length,
            })}
          />

          {submitted &&
            (!formData.langue_ids || !formData.langue_ids.length) && (
              <small className="p-error">Les langues sont requises.</small>
            )}
          {submitted && !formData.langue_ids && (
            <small className="p-error">langue requis.</small>
          )}
        </div>
      </Dialog>
    </div>
  );
}
