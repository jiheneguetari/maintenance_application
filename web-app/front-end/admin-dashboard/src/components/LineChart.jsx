import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Title, 
  Legend 
} from "chart.js";

// Enregistrement des éléments essentiels et des plugins UX
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Title, Legend);

export default function LineChart({ data: { labels, data } }) { // Destructuring pour plus de clarté

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Inutile pour une seule ligne
      },
      title: {
        display: true,
        text: 'Historique des alertes (nombre par jour)',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Jour',
            }
        },
        y: {
            title: {
                display: true,
                text: 'Nombre d\'Alertes',
            },
            beginAtZero: true
        }
    }
  };

  return (
    <div style={{ maxHeight: '400px' }}> 
      <Line
        options={chartOptions}
        data={{
          labels: labels,
          datasets: [
            {
              label: "Nombre d'Alertes",
              data: data,
              borderColor: 'rgb(54, 162, 235)', // Bleu
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderWidth: 2,
              tension: 0.3, // Ligne plus douce
            },
          ],
        }}
      />
    </div>
  );
}