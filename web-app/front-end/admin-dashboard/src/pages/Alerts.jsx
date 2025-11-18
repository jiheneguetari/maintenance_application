import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const { admin } = useContext(AuthContext);

  useEffect(() => {
    axios.get("/alerts", {
      headers: { "x-auth-token": admin?.token }
    })
    .then(res => setAlerts(res.data))
    .catch(console.error);
  }, [admin]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Alertes</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Machine</th>
            <th className="p-3">Type</th>
            <th className="p-3">Valeur</th>
            <th className="p-3">Date</th>
            <th className="p-3">Statut</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map(a => (
            <tr key={a._id} className="border-b">
              <td className="p-3">{a.machineName}</td>
              <td className="p-3">{a.type}</td>
              <td className="p-3">{a.value}</td>
              <td className="p-3">{new Date(a.date).toLocaleString()}</td>
              <td className="p-3">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
