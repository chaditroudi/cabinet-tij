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
import { faPlusCircle, faSearch, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
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
  langue_id: string;
}

interface FormData {
  id: number | null;
  identite: string;
  telephone: string;
  region: string;
  langue_id: string;
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

  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedKeyword(value); // Set the debounced value after 300ms
    }, 300),
    []
  );
  const [langues, setlangues] = useState<FormData[]>([]);
  const [page, setPage] = useState(1);
  const limit = 2;

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
    langue_id: "",
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
    setSearchTerm(value); // Update the local input state immediately
    debouncedSearch(value); // Trigger the debounced API call
  };

  const resetForm = () => {
    setFormData({
      id: null,
      identite: "",
      telephone: "",
      region: "",
      langue_id: "",
    });
  };
  const openNew = () => {
    setFormData({
      id: null,
      identite: "",
      telephone: "",
      region: "",
      langue_id: "",
    });
    setSubmitted(false);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDialogVisible(false);
  };

  const edittraducteur = (traducteur: traducteur) => {
    setFormData({ ...traducteur });
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

  const savetraducteur = async (SaveAnother: boolean) => {
    setSubmitted(true);

    if (
      formData.identite.trim() &&
      formData.telephone.trim() &&
      formData.region &&
      formData.langue_id
    ) {
      const updatedtraducteurs = [...traducteurs];

      if (formData.id) {
        setSubmitted(false);
        const index = findIndexById(formData.id);
        updatedtraducteurs[index] = { ...formData } as traducteur;
        await await updateTraducteur({
          id: formData.id,
          data: updatedtraducteurs[index],
        }).unwrap();
        resetForm();
        TopEndAlert("success", "traducteur Modifée avec succès", "#fff");
        setDialogVisible(false);
      } else {
        const newtraducteur = {
          ...formData,
        } as traducteur;

        try {
          await saveTraducteur(newtraducteur).unwrap();
          setSubmitted(false);

          if (SaveAnother) {
            setDialogVisible(true);
            resetForm();
          }

          TopEndAlert("success", "traducteur Ajouté avec succès", "#fff");
        } catch (e) {
          TopEndAlert("error", e, "#fff");
        }
      }
    }
  };

  const findIndexById = (id: number) => {
    return traducteurs.findIndex((traducteur) => traducteur.id === id);
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
        onClick={() => savetraducteur(true)}
        className="h-[40px]  bg-blue-900 text-white hover:text-blue-900 px-2 hover:bg-opacity-45 hover:shadow-lg  border-blue-900 border rounded-md"
      >
        {formData.id ? "Ajouter & Continuer" : "Enregistrer"}
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
        className="p-datatable-traducteurs"
        emptyMessage="Aucun traducteur disponible"
        paginator
        rows={20}
        totalRecords={total || 0}
        loading={isLoading}
        first={(page - 1) * limit}
        onPage={(e: any) => setPage(e.page + 1)} // PrimeReact uses 0-based page
      >
        <Column
          field="identite"
          header="Identité"
          body={(rowData) => rowData.identite}
        />

        <Column field="telephone" header="Numéro Tél" />

        <Column
          field="region"
          header="Région"
          body={(rowData) => getRegionLabel(rowData.region)}
        />
        <Column
          field="langue"
          header="Langue"
          body={(rowData) => rowData?.langue?.name}
        />
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "50px" }}
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
                  savetraducteur(true);
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
                  savetraducteur(true);
                }
              }}
            />
            {submitted && !formData.telephone && (
              <small className="p-error">Téléphone requis.</small>
            )}
          </div>
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
          <div className="mb-1" id="langue">
            Langues
          </div>

          <Dropdown
            id="langue"
            value={formData.langue_id}
            onChange={(e) => onDropdownChange(e, "langue_id")}
            options={langues}
            optionLabel="name"
            optionValue="id" // ← and here for languages
            placeholder="Sélectionner une langue"
            emptyMessage="Aucune langue disponible"
            emptyFilterMessage="Aucune langue disponible"
            className={classNames({
              "p-invalid": submitted && !formData.langue_id,
            })}
            filter
            filterBy="name"
            showClear
          />

          {submitted && !formData.langue_id && (
            <small className="p-error">langue requis.</small>
          )}
        </div>
      </Dialog>
    </div>
  );
}
