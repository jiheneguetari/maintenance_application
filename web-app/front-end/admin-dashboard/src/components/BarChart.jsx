import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Title, 
  Legend 
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

export default function BarChart({ data: { labels, data } }) {

  // Options pour rendre le graphique à barres plus lisible
  const chartOptions = {
    indexAxis: 'y', // Affichage horizontal pour les longs noms de machine
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Alertes par Machine (Top N ou toutes)',
      },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Nombre d\'Alertes',
            },
            beginAtZero: true
        },
        y: {
            title: {
                display: true,
                text: 'Machine ID / Nom',
            }
        }
    }
  };

  return (
    <div style={{ maxHeight: '500px' }}>
      <Bar
        options={chartOptions}
        data={{
          labels: labels,
          datasets: [
            {
              label: "Nb Alertes",
              data: data,
              backgroundColor: 'rgba(255, 159, 64, 0.6)', // Orange
              borderColor: 'rgb(255, 159, 64)',
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
}