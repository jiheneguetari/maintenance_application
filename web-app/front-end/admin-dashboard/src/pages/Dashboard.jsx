import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { admin } = useContext(AuthContext);

  const [stats, setStats] = useState({
    machines: 0,
    alerts: 0,
    techs: 0,
  });

  useEffect(() => {
    if (!admin?.token) return;

    // Charger les statistiques du backend
    const fetchData = async () => {
      try {
        const resMachines = await axios.get("/machines", {
          headers: { "x-auth-token": admin.token },
        });

        const resAlerts = await axios.get("/alerts", {
          headers: { "x-auth-token": admin.token },
        });

        const resUsers = await axios.get("/users", {
          headers: { "x-auth-token": admin.token },
        });

        setStats({
          machines: resMachines.data.length,
          alerts: resAlerts.data.filter(a => a.status !== "Résolue").length,
          techs: resUsers.data.length,
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [admin]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Machines</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.machines}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Alertes actives</h2>
          <p className="text-3xl font-bold text-red-600">{stats.alerts}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Techniciens</h2>
          <p className="text-3xl font-bold text-green-600">{stats.techs}</p>
        </div>

      </div>
    </Layout>
  );
}
