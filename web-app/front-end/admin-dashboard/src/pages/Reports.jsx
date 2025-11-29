import Layout from "../components/Layout";
import { useState } from "react";
import axios from "axios";
// Importez une icône si vous utilisez une bibliothèque (ex: npm install react-icons)
// import { FiDownload, FiFileText } from "react-icons/fi"; // Exemple avec react-icons

export default function Reports() {
  const [period, setPeriod] = useState("week");
  // Ajout d'un état de chargement pour l'UX
  const [isLoading, setIsLoading] = useState(false);

  const downloadReport = () => {
    setIsLoading(true);
    axios({
      url: `http://localhost:5000/api/reports/pdf?period=${period}`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        // Création du fichier PDF
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        // Meilleur nom de fichier
        link.setAttribute("download", `rapport_${period}_${new Date().toLocaleDateString()}.pdf`); 
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Erreur lors du téléchargement du rapport:", error);
        // Gérer l'affichage d'une erreur à l'utilisateur si nécessaire
        alert("Une erreur est survenue lors du téléchargement du rapport.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8 flex items-center">
             Générer un Rapport d'Activité
          </h1>
          
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
            <p className="text-gray-600 mb-6 border-l-4 border-emerald-500 pl-3 py-1 bg-emerald-50 bg-opacity-50">
                Sélectionnez la période souhaitée ci-dessous pour générer et télécharger votre rapport d'activité au format PDF.
            </p>

            <label htmlFor="period-select" className="block text-sm font-medium text-gray-700 mb-2">
              📊 Sélectionner la Période :
            </label>
            <select
              id="period-select"
              className="border border-gray-300 p-3 w-full mb-6 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white transition duration-150 ease-in-out"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="week">Dernière semaine</option>
              <option value="month">Dernier mois</option>
              <option value="3months">3 derniers mois</option>
            </select>

            <button
              onClick={downloadReport}
              // Style de bouton nettement amélioré
              className={`
                text-white w-full p-3 rounded-xl font-semibold shadow-lg transition duration-300 ease-in-out 
                flex items-center justify-center space-x-2 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl transform hover:scale-[1.01]'
                }
              `}
              disabled={isLoading}
            >
              {isLoading ? 'Génération en cours...' : 'Télécharger le Rapport PDF'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}