
import { useEffect, useState } from "react";
import axios from "../api/axios"; // web axios with backend baseURL
import Layout from "../components/Layout";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  
  useEffect(()=> {
    axios.get("/alerts").then(r=> setAlerts(r.data)).catch(console.error);
  }, []);

  // Fonction utilitaire pour la couleur du statut
const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-red-600 font-bold";
      case "en_cours":
        return "text-yellow-600 font-bold";
      case "resolue":
        return "text-green-600 font-bold";
      case "ignoree": 
        return "text-purple-600 font-bold"; 
      default:
        return "text-gray-600";
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Alertes</h1>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th>Machine</th>
            <th>Type</th>
            <th>Valeur</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map(a=>(
            <tr key={a._id} className="border-b">
              <td className="p-3">{a.machineId}</td>
              <td className="p-3">{a.type}</td>
              <td className="p-3">{a.value}</td>
              <td className="p-3">{new Date(a.date).toLocaleString()}</td>
              <td className={`p-3 ${getStatusColor(a.status)}`}>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {alerts.length === 0 && <p className="text-center p-4 text-gray-500">Aucune alerte à afficher.</p>}
    </Layout>
  );
}