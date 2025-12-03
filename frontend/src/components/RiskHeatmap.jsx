import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RiskHeatmap({ risks }) {
  if (!risks || risks.length === 0) return null;

  // Expecting risks array of objects: [{ name, probability, impact }]
  const labels = risks.map(r => r.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Probability",
        data: risks.map(r => r.probability),
        backgroundColor: "rgba(251, 191, 36, 0.7)"
      },
      {
        label: "Impact",
        data: risks.map(r => r.impact),
        backgroundColor: "rgba(239, 68, 68, 0.7)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#fff" } }
    },
    scales: {
      x: { ticks: { color: "#fff" }, stacked: true },
      y: { ticks: { color: "#fff" }, stacked: false, beginAtZero: true, max: 10 }
    }
  };

  return (
    <div className="mt-8 p-6 bg-primary-700 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold text-white mb-4">Risk Heatmap</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
