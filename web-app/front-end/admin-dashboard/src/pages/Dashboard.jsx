import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FiCpu, FiBell, FiUsers, FiTrendingUp, FiAlertOctagon } from "react-icons/fi"; // Ajout de FiAlertOctagon

import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";

// Composant pour afficher les erreurs
const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Erreur: </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

export default function Dashboard() {
  const { admin } = useContext(AuthContext);

  // Stats clés
  const [stats, setStats] = useState({
    machines: 0,
    activeAlerts: 0,
    totalAlerts: 0,
    techs: 0,
    resolvedAlerts: 0, // Ajout potentiel (si disponible dans /alerts/stats)
  });

  // Données de graphique formatées (avec labels et couleurs)
  const [chartData, setChartData] = useState({
    byDay: { labels: [], data: [] },
    byMachine: { labels: [], data: [] },
    byStatus: { labels: [], data: [], backgroundColors: [] },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Gestion des erreurs

  // Couleurs standard pour les statuts
 const statusColors = {
  active: "rgba(255, 99, 132, 0.6)",   // Rouge
  en_cours: "rgba(255, 206, 86, 0.6)", // Jaune
  resolue: "rgba(75, 192, 192, 0.6)",  // Vert
};


  useEffect(() => {
    if (!admin?.token) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = { "x-auth-token": admin.token };

        // Utilisation de Promise.all pour optimiser
        const [machinesRes, alertsRes, usersRes, statsRes] = await Promise.all([
          axios.get("/machines", { headers }),
          axios.get("/alerts", { headers }),
          axios.get("/users", { headers }),
          axios.get("/alerts/stats", { headers }),
        ]);

        const alerts = alertsRes.data;
        const statsData = statsRes.data;
        
        // 1. Mise à jour des Stats
        const activeAlertsCount = alerts.filter(a => a.status === "active").length;
        const resolvedAlertsCount = alerts.filter(a => a.status === "resolue").length;
        
        setStats({
          machines: machinesRes.data.length,
          activeAlerts: activeAlertsCount,
          totalAlerts: alerts.length,
          techs: usersRes.data.length,
          resolvedAlerts: resolvedAlertsCount,
        });

        // 2. Mise à jour des Chart Data
        
        // --- Alertes par Jour (Line Chart) ---
        const byDayLabels = Object.keys(statsData.byDay).sort();
        const byDayData = byDayLabels.map(day => statsData.byDay[day]);

        // --- Alertes par Machine (Bar Chart) ---
        const byMachineLabels = Object.keys(statsData.byMachine);
        const byMachineData = Object.values(statsData.byMachine);

        // --- Répartition des Statuts (Pie Chart) ---
        const byStatusLabels = Object.keys(statsData.byStatus);
        const byStatusData = Object.values(statsData.byStatus);
        const byStatusColors = byStatusLabels.map(label => statusColors[label] || 'rgba(255, 240, 102, 0.6)'); // Couleur par défaut si statut inconnu

        setChartData({
          byDay: { labels: byDayLabels, data: byDayData },
          byMachine: { labels: byMachineLabels, data: byMachineData },
          byStatus: { labels: byStatusLabels, data: byStatusData, backgroundColors: byStatusColors },
        });

      } catch (err) {
        console.error("Erreur Dashboard :", err);
        setError("Impossible de charger les données du tableau de bord. Veuillez vérifier la connexion API.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [admin]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-40">
          <p className="text-xl font-semibold text-gray-600">Chargement des données...</p>
        </div>
      </Layout>
    );
  }
  
  // Afficher le message d'erreur si la requête a échoué
  if (error) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2"> Tableau de bord</h1>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard title="Machines" value={stats.machines} icon={<FiCpu size={32} />} color="blue" />
        <StatCard title="Alertes Actives" value={stats.activeAlerts} icon={<FiBell size={32} />} color="red" />
        <StatCard title="Alertes Résolues" value={stats.resolvedAlerts} icon={<FiTrendingUp size={32} />} color="green" /> 
        <StatCard title="Techniciens" value={stats.techs} icon={<FiUsers size={32} />} color="purple" /> 

      </div>
      
      <hr className="my-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-700"> Alertes par Jour (Historique)</h2>
          <LineChart data={chartData.byDay} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700"> Statut des Alertes</h2>
          <PieChart data={chartData.byStatus} />
        </div>
        
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-700"> Top Machines (par Alertes)</h2>
          <BarChart data={chartData.byMachine} />
        </div>

      </div>
    </Layout>
  );
}

// Composant StatCard inchangé (avec ajout de la couleur purple)
function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    red: "bg-red-50 text-red-700 border-red-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200", // Nouvelle couleur
  };

  return (
    <div className={`p-6 rounded-xl border shadow-sm flex items-center gap-4 ${colors[color]}`}>
      <div className="p-4 bg-white rounded-full shadow-md text-gray-700">{icon}</div>
      <div>
        <h3 className="text-md font-medium text-gray-600">{title}</h3>
        <p className="text-4xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}