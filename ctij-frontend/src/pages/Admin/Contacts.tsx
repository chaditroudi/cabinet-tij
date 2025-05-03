"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import Swal from "sweetalert2";
import departement from "@/assets/js/departements.json";
import languages from "@/assets/js/languages.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import useAuthContext from "@/context/AuthContext";
import {
  useDeleteTraducteurMutation,
  useGetAllContactsQuery,
  useSaveTraducteurMutation,
  useUpdateInterpreteMutation,
} from "@/services/apis/contactsApi";

export const contact_status = [
  { label: "Disponible", value: "0", color: "green-500" },
  { label: "Disponible par Téléphone", value: "1", color: "gray-700" },
  { label: "Contact par sms", value: "2", color: "orange-500" },
  { label: "Disponibilité inconnu", value: "3", color: "red-800" },
];

interface Contact {
  id: number;
  identite: string;
  telephone: string;
  dispo: string;
  gender: string;
  departement: string;
  langue: string;
}

interface FormData {
  id: number | null;
  identite: string;
  telephone: string;
  dispo: string;
  gender: string;
  departement: string;
  langue: string;
}

export function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [updateTraducteur] = useUpdateInterpreteMutation();
  const [deleteTraducteur] = useDeleteTraducteurMutation();
  const [saveTraducteur] = useSaveTraducteurMutation();
  const getdepartementLabel = (code: string) => {
    const found = departement.find((dept) => dept.code === code);
    return found ? `${found.code} - ${found.name}` : code;
  };
  const { getLanguageLabel, TopEndAlert } = useAuthContext();
  const getContactStatusLabel = (value: string) => {
    const status = contact_status.find((item) => item.value === value);
    return status ? status.label : value;
  };
  const { data } = useGetAllContactsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [formData, setFormData] = useState<FormData>({
    id: null,
    identite: "",
    telephone: "",
    dispo: "",
    gender: "",
    departement: "",
    langue: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Load mock data
  useEffect(() => {
    if (data) setContacts(data.contacts);
  }, [data]);

  const openNew = () => {
    setFormData({
      id: null,
      identite: "",
      telephone: "",
      dispo: "",
      departement: "",
      gender: "",
      langue: "",
    });
    setSubmitted(false);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDialogVisible(false);
  };

  const editContact = (contact: Contact) => {
    setFormData({ ...contact });
    setDialogVisible(true);
  };

  const deleteContact = (contact: Contact) => {
    let id = contact?.id;
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${contact.identite}'s contact?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTraducteur({ id }).unwrap();
        TopEndAlert("error", "Traducteur supprimé", "#fff");
      }
    });
  };

  const saveContact = async () => {
    setSubmitted(true);

    if (
      formData.identite.trim() &&
      formData.telephone.trim() &&
      formData.dispo &&
      formData.gender &&
      formData.departement &&
      formData.langue
    ) {
      const updatedContacts = [...contacts];

      if (formData.id) {
        // Update existing contact
        const index = findIndexById(formData.id);
        updatedContacts[index] = { ...formData } as Contact;
        await await updateTraducteur({
          id: formData.id,
          data: updatedContacts[index],
        }).unwrap();

        TopEndAlert("success", "Contact Modifée avec succès", "#fff");
      } else {
        // Create new contact
        const newContact = {
          ...formData,
        } as Contact;

        try {
          // Make API request with the FormData object
          await await saveTraducteur(newContact).unwrap();

          TopEndAlert("success", "Contact Ajouté avec succès", "#fff");
        } catch (e) {
          TopEndAlert("error", e, "#fff");
        }
      }
      setDialogVisible(false);
      setFormData({
        id: null,
        identite: "",
        telephone: "",
        dispo: "",
        departement: "",
        gender: "",
        langue: "",
      });
    }
  };

  const findIndexById = (id: number) => {
    return contacts.findIndex((contact) => contact.id === id);
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

  const actionBodyTemplate = (rowData: Contact) => {
    return (
      <div className="flex gap-4">
        <button onClick={() => editContact(rowData)}>
          <FontAwesomeIcon icon={faEdit} className="text-blue-600" />
        </button>

        <button onClick={() => deleteContact(rowData)}>
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
      <Button label="Save" icon="fa-solid fa-check" onClick={saveContact} />
    </div>
  );
  const optionsWithLabel = useMemo(
    () =>
      departement.map((d) => ({
        ...d,
        label: `${d.code} - ${d.name}`,
      })),
    [departement]
  );
  return (
    <div>
      <DataTable
        value={contacts}
        header={header}
        resizableColumns
        // paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        dataKey="id"
        className="p-datatable-contacts"
      >
        <Column field="identite" header="Identité" sortable />
        <Column field="telephone" header="Numéro Tél" sortable />
        <Column
          field="dispo"
          header="Statut de traducteur"
          sortable
          body={(rowData) => getContactStatusLabel(rowData.dispo.toString())}
        />
        <Column
          field="departement"
          header="Département"
          sortable
          body={(rowData) => getdepartementLabel(rowData.departement)}
        />
        <Column
          field="langue"
          header="Langue"
          sortable
          body={(rowData) => getLanguageLabel(rowData.langue, languages)}
        />
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "8rem" }}
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
        <div className="field mt-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="monsieur"
                name="gender"
                value="0"
                checked={formData.gender == "0"}
                onChange={(e) => onInputChange(e, "gender")}
              />
              <label htmlFor="monsieur">Monsieur</label>
            </div>
            <div className="flex items-center flex-row gap-2">
              <input
                type="radio"
                id="madame"
                name="gender"
                value="1"
                checked={formData.gender == "1"}
                onChange={(e) => onInputChange(e, "gender")}
              />
              <label htmlFor="madame">Madame</label>
            </div>
          </div>
          {submitted && !formData.gender && (
            <small className="p-error">Civilité requise.</small>
          )}
        </div>
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
          <label htmlFor="dispo">Dispo</label>
          <Dropdown
            id="dispo"
            value={formData.dispo.toString()}
            options={contact_status}
            onChange={(e) => onDropdownChange(e, "dispo")}
            placeholder="Choisir disponibilité"
            className={classNames({
              "p-invalid": submitted && !formData.dispo,
            })}
          />
          {submitted && !formData.dispo && (
            <small className="p-error">Statut requis.</small>
          )}
        </div>

        <div className="field mt-4">
          <label htmlFor="departement">Départment</label>

          <Dropdown
            id="departement"
            value={formData.departement}
            onChange={(e) => onDropdownChange(e, "departement")}
            options={optionsWithLabel}
            optionLabel="label"
            optionValue="code" // ← tell it to match by the `code` field
            placeholder="Sélectionner un Département"
            filter
            filterPlaceholder="Recherche…"
            filterBy="label"
            filterMatchMode="contains"
            showClear
            itemTemplate={(opt) => <div>{opt.label}</div>}
            className={classNames({
              "p-invalid": submitted && !formData.departement,
            })}
          />

          {submitted && !formData.departement && (
            <small className="p-error">departement requis.</small>
          )}
        </div>

        <div className="field mt-4">
          <label htmlFor="langue">Langues</label>

          <Dropdown
            id="langue"
            value={formData.langue}
            onChange={(e) => onDropdownChange(e, "langue")}
            options={languages}
            optionLabel="name"
            optionValue="code" // ← and here for languages
            placeholder="Sélectionner une langue"
            className={classNames({
              "p-invalid": submitted && !formData.langue,
            })}
            filter
            filterBy="name"
            showClear
          />

          {submitted && !formData.langue && (
            <small className="p-error">langue requis.</small>
          )}
        </div>
      </Dialog>
    </div>
  );
}
