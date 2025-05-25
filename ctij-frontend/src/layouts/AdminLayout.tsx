"use client";

import Sidebar from "@/pages/Admin/components/Sidebar";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "./Footer";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
    }).then((result: any) => {
      if (result.isConfirmed) {
        navigate("/logout");
      }
    });
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={collapsed} onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 lg:flex-auto flex-1 focus:outline-none"
          >
            <i
              className={`fa-solid ${collapsed ? "fa-bars" : "fa-times"} mr-2`}
            ></i>
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ">
            <Link to="/" className="flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faChevronCircleLeft} />
              Retour Accueil
            </Link>
          </h1>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
