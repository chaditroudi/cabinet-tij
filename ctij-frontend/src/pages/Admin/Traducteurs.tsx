"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import Swal from "sweetalert2";
import regions from "@/assets/js/regions.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import useAuthContext from "@/context/AuthContext";
import {
  useDeleteTraducteurMutation,
  useGetAlltraducteursQuery,
  useSaveTraducteurMutation,
  useUpdateTraducteurMutation,
} from "@/services/apis/traducteursApi";
import { useGetAlllanguesQuery } from "@/services/apis/languesApi";

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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [updateTraducteur] = useUpdateTraducteurMutation();
  const [deleteTraducteur] = useDeleteTraducteurMutation();
  const [saveTraducteur] = useSaveTraducteurMutation();
  const getRegionLabel = (code: string) => {
    const found = regions.find((reg) => reg.code === code);
    return found ? `${found.code} - ${found.region}` : code;
  };
  const [langues, setlangues] = useState<FormData[]>([]);

  const { data: fetchedData } = useGetAlllanguesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (fetchedData) setlangues(fetchedData.langues);
  }, [fetchedData]);

  const { TopEndAlert } = useAuthContext();

  const { data } = useGetAlltraducteursQuery(
    {},
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

  // Load mock data
  useEffect(() => {
    if (data) setTraducteurs(data.traducteurs);
  }, [data]);

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

  const savetraducteur = async () => {
    setSubmitted(true);

    if (
      formData.identite.trim() &&
      formData.telephone.trim() &&
      formData.region &&
      formData.langue_id
    ) {
      const updatedtraducteurs = [...traducteurs];

      if (formData.id) {
        // Update existing traducteur
        const index = findIndexById(formData.id);
        updatedtraducteurs[index] = { ...formData } as traducteur;
        await await updateTraducteur({
          id: formData.id,
          data: updatedtraducteurs[index],
        }).unwrap();

        TopEndAlert("success", "traducteur Modifée avec succès", "#fff");
      } else {
        // Create new traducteur
        const newtraducteur = {
          ...formData,
        } as traducteur;

        try {
          // Make API request with the FormData object
          await await saveTraducteur(newtraducteur).unwrap();

          TopEndAlert("success", "traducteur Ajouté avec succès", "#fff");
        } catch (e) {
          TopEndAlert("error", e, "#fff");
        }
      }
      setDialogVisible(false);
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
          <FontAwesomeIcon icon={faEdit} className="text-blue-600" />
        </button>

        <button onClick={() => deletetraducteur(rowData)}>
          <FontAwesomeIcon icon={faTrashAlt} className="text-red-700" />
        </button>
      </div>
    );
  };

  const header = (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Liste Traducteurs</h2>

      <button
        onClick={openNew}
        className="bg-blue-900 rounded-md p-2 hover:bg-opacity-80"
      >
        <div className="flex flex-row items-center gap-2">
          <div>
            <FontAwesomeIcon icon={faPlusCircle} className="text-white" />
          </div>
          <div className="text-white font-light">Ajouter Traducteur</div>
        </div>
      </button>
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        label="Cancel"
        icon="fa-solid fa-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button label="Save" icon="fa-solid fa-check" onClick={savetraducteur} />
    </div>
  );

  return (
    <div>
      <DataTable
        value={traducteurs}
        header={header}
        resizableColumns
        // paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        dataKey="id"
        className="p-datatable-traducteurs"
      >
        <Column
          field="identite"
          header="Identité"
          sortable
          body={(rowData) => rowData.identite}
        />

        <Column field="telephone" header="Numéro Tél" sortable />

        <Column
          field="region"
          header="Région"
          sortable
          body={(rowData) => getRegionLabel(rowData.region)}
        />
        <Column
          field="langue"
          header="Langue"
          sortable
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
            <label htmlFor="identite">Nom & Prénom</label>
            <InputText
              id="identite"
              value={formData.identite}
              onChange={(e) => onInputChange(e, "identite")}
              required
              className={classNames({
                "p-invalid": submitted && !formData.identite,
              })}
            />
            {submitted && !formData.identite && (
              <small className="p-error">Nom & Prénom requis.</small>
            )}
          </div>

          <div className="field mt-4">
            <label htmlFor="telephone">Num Téléphone</label>
            <InputText
              id="telephone"
              value={formData.telephone}
              onChange={(e) => onInputChange(e, "telephone")}
              required
              className={classNames({
                "p-invalid": submitted && !formData.telephone,
              })}
            />
            {submitted && !formData.telephone && (
              <small className="p-error">Téléphone requis.</small>
            )}
          </div>
        </div>

        <div className="field mt-4">
          <label htmlFor="region">Régions</label>

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
          <label htmlFor="langue">Langues</label>

          <Dropdown
            id="langue"
            value={formData.langue_id}
            onChange={(e) => onDropdownChange(e, "langue_id")}
            options={langues}
            optionLabel="name"
            optionValue="id" // ← and here for languages
            placeholder="Sélectionner une langue"
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
