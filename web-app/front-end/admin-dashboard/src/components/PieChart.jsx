import { Pie } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  Title
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function PieChart({ data: { labels, data, backgroundColors } }) {

    // Options pour le Pie Chart
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right', // Légende à droite pour gagner de la place
            },
            title: {
                display: true,
                text: 'Répartition par Statut',
            },
        },
    };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <Pie
        options={chartOptions}
        data={{
          labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)), // Mettre la première lettre en majuscule pour l'affichage
          datasets: [
            {
              data: data,
              backgroundColor: backgroundColors || [
                'rgba(255, 99, 132, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
              ],
              borderColor: '#ffffff', // Bordure blanche pour séparer les segments
              borderWidth: 2,
            },
          ],
        }}
      />
    </div>
  );
}