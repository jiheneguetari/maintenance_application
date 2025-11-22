import Layout from "../components/Layout";
import { useState } from "react";
import axios from "axios";

export default function Reports() {
  const [period, setPeriod] = useState("week");

  const downloadReport = () => {
    axios({
      url: `http://localhost:5000/api/reports/pdf?period=${period}`,
      method: "GET",
      responseType: "blob"
    }).then((response) => {
      // Création du fichier PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapport.pdf");
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Générer un Rapport</h1>

      <div className="bg-white p-6 rounded shadow w-96">
        
        <label className="block mb-3">Période :</label>
        <select
          className="border p-2 w-full mb-4"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="week">Dernière semaine</option>
          <option value="month">Dernier mois</option>
          <option value="3months">3 derniers mois</option>
        </select>

        <button
          onClick={downloadReport}
          className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700"
        >
          Télécharger PDF
        </button>
      </div>
    </Layout>
  );
}
