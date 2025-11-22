import { useEffect, useState } from "react";
import axios from "../api/axios";
import Layout from "../components/Layout";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  EyeOff,
  Wrench,
  Loader2,
  BellRing,
} from "lucide-react";
import moment from "moment"; // Pour un meilleur formatage de la date


export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null); // ID de l'alerte en cours de mise à jour


  const fetchAlerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const r = await axios.get("/alerts");
      setAlerts(r.data);
    } catch (err) {
      console.error("Erreur de chargement des alertes:", err);
      setError("Impossible de charger les alertes. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const updateAlertStatus = async (id, newStatus) => {
    if (!window.confirm(`Passer cette alerte au statut "${newStatus}" ?`)) return;

    setUpdatingId(id);
    try {
      // Endpoint supposé pour la mise à jour : POST /alerts/:id/status
      const res = await axios.post(`/alerts/${id}/status`, { status: newStatus });
      
      // Mettre à jour l'alerte dans l'état local
      setAlerts(alerts.map(a => a._id === id ? { ...a, status: res.data.status } : a));

    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
      alert("Erreur lors de la mise à jour du statut de l'alerte.");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- Fonctions utilitaires pour le rendu ---

  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          text: "Active",
          icon: <AlertTriangle className="w-4 h-4" />,
          classes: "bg-red-100 text-red-800 border-red-300",
        };
      case "en_cours":
        return {
          text: "En Cours",
          icon: <Clock className="w-4 h-4" />,
          classes: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
      case "resolue":
        return {
          text: "Résolue",
          icon: <CheckCircle className="w-4 h-4" />,
          classes: "bg-green-100 text-green-800 border-green-300",
        };
      case "ignoree":
        return {
          text: "Ignorée",
          icon: <EyeOff className="w-4 h-4" />,
          classes: "bg-gray-100 text-gray-800 border-gray-300",
        };
      default:
        return {
          text: status || "Inconnu",
          icon: null,
          classes: "bg-gray-200 text-gray-700 border-gray-400",
        };
    }
  };

  const formatValue = (type, value) => {
    if (type === 'temperature') return `${value} °C`;
    if (type === 'vibration') return `${value} g`;
    return value;
  };

  // --- Rendu du composant ---

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 pb-3 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center">
          <BellRing className="w-8 h-8 mr-3 text-red-600" />
          Tableau des Alertes
        </h1>
        <button
          onClick={fetchAlerts}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out flex items-center"
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.356-2a8.001 8.001 0 0014.157-3h5.81" />
                </svg>
            )}
          Actualiser
        </button>
      </div>
      

      {/* Affichage des états de chargement et d'erreur */}
      {isLoading && (
        <div className="text-center p-12 bg-red-50 rounded-xl shadow-inner mt-6">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-medium text-red-800">Recherche des alertes en cours...</p>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-bold">Erreur :</span> {error}
          <button onClick={fetchAlerts} className="ml-3 font-semibold text-red-900 underline">Réessayer</button>
        </div>
      )}
      
      {/* Tableau des alertes */}
      {!isLoading && !error && alerts.length === 0 ? (
        <div className="text-center p-12 border-4 border-dashed border-gray-200 bg-white rounded-xl mt-8">
          <p className="text-2xl text-gray-500 font-light">🎉 Aucune alerte active à afficher.</p>
          <p className="text-gray-400 mt-3">Vos machines fonctionnent dans les limites normales.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-2xl rounded-xl">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Machine (ID)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Type d'Anomalie
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Valeur Mesurée
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Date de Déclenchement
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      ....Statut
                </th>
               
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => {
                const statusConfig = getStatusConfig(a.status);
                const isUpdating = updatingId === a._id;
                
                return (
                  <tr 
                    key={a._id} 
                    className={`hover:bg-red-50 transition duration-150 ${a.status === 'active' ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {a.machineId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {a.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      {formatValue(a.type, a.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(a.date).format('DD MMM YYYY HH:mm')}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.classes}`}>
                        {statusConfig.icon && <span className="mr-1">{statusConfig.icon}</span>}
                        {statusConfig.text}
                      </div>
                    </td>
                    
            
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}