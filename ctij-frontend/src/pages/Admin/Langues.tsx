"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import useAuthContext from "@/context/AuthContext";
import {
  useDeletelangueMutation,
  useGetAlllanguesQuery,
  useSavelangueMutation,
  useUpdatelangueMutation,
} from "@/services/apis/languesApi";

export const langue_status = [
  { label: "Disponible", value: "1", color: "border-green-500" },
  { label: "Disponible par Téléphone", value: "2", color: "border-gray-700" },
  { label: "Disponible  par sms", value: "3", color: "border-orange-400" },
  { label: "Disponibilité inconnu", value: "4", color: "border-red-700" },
];

interface FormData {
  id: number | null;
  name: string;
}

interface langue {
  id: number | null;
  name: string;
}


export function Langues() {
  const [langues, setlangues] = useState<FormData[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [updatelangue] = useUpdatelangueMutation();
  const [deletelangue] = useDeletelangueMutation();
  const [savelangue] = useSavelangueMutation();

  const { TopEndAlert } = useAuthContext();

  const { data } = useGetAlllanguesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [formData, setFormData] = useState<FormData>({
    id: null,
    name: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Load mock data
  
  useEffect(() => {
    if (data) setlangues(data.langues);
  }, [data]);

  const openNew = () => {
    setFormData({
      id: null,
      name: "",
    });
    setSubmitted(false);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDialogVisible(false);
  };

  const editlangue = (langue: langue) => {
    setFormData({ ...langue });
    setDialogVisible(true);
  };

  const handledeletelangue = (langue: langue) => {
    let id = langue?.id;
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Voulez-vous supprimer le langue ${langue.name} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
      if (result.isConfirmed) {
        deletelangue({ id }).unwrap();
        TopEndAlert("error", "langue supprimé", "#fff");
      }
    });
  };

  const handlesavelangue = async () => {
    setSubmitted(true);

    if (formData.name.trim()) {
      const updatedlangues = [...langues];

      if (formData.id) {
        // Update existing langue
        const index = findIndexById(formData.id);
        updatedlangues[index] = { ...formData } as langue;
        await await updatelangue({
          id: formData.id,
          data: updatedlangues[index],
        }).unwrap();

        TopEndAlert("success", "langue Modifée avec succès", "#fff");
      } else {
        // Create new langue
        const newlangue = {
          ...formData,
        } as any;
        try {
          // Make API request with the FormData object
          await await savelangue(newlangue).unwrap();

          TopEndAlert("success", "langue Ajouté avec succès", "#fff");
        } catch (e) {
          TopEndAlert("error", e, "#fff");
        }
      }
      setDialogVisible(false);
    }
  };

  const findIndexById = (id: number) => {
    return langues.findIndex((langue) => langue.id === id);
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

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-4">
        <button onClick={() => editlangue(rowData)}>
          <FontAwesomeIcon icon={faEdit} className="text-blue-600" />
        </button>

        <button onClick={() => handledeletelangue(rowData)}>
          <FontAwesomeIcon icon={faTrashAlt} className="text-red-700" />
        </button>
      </div>
    );
  };

  const header = (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Liste Langue</h2>

      <button
        onClick={openNew}
        className="bg-blue-900 rounded-md p-2 hover:bg-opacity-80"
      >
        <div className="flex flex-row items-center gap-2">
          <div>
            <FontAwesomeIcon icon={faPlusCircle} className="text-white" />
          </div>
          <div className="text-white font-light">Ajouter Langue</div>
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
      <Button
        label="Save"
        icon="fa-solid fa-check"
        onClick={handlesavelangue}
      />
    </div>
  );

  return (
    <div>
      <DataTable
        value={langues}
        header={header}
        resizableColumns
        // paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        dataKey="id"
        className="p-datatable-langues"
      >
        <Column field="name" header="Nom de la langue" sortable />
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "50px" }}
        />
      </DataTable>

      <Dialog
        visible={dialogVisible}
        style={{ width: "550px" }}
        header={formData.id ? "Editer langue" : "Ajouter langue"}
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={hideDialog}
      >
        <div className="flex flex-row gap-2">
          <div className="field mt-4">
            <label htmlFor="identite">Nom de la langue</label>
            <InputText
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange(e, "name")}
              required
              className={classNames({
                "p-invalid": submitted && !formData.name,
              })}
            />
            {submitted && !formData.name && (
              <small className="p-error">Nom requis.</small>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
