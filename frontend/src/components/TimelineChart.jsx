import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TimelineChart({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  const labels = timeline.map((t) => t.task);
  const data = {
    labels,
    datasets: [
      {
        label: "Start Day",
        data: timeline.map((t) => t.start),
        backgroundColor: "rgba(59, 130, 246, 0.6)"
      },
      {
        label: "Duration",
        data: timeline.map((t) => t.end - t.start),
        backgroundColor: "rgba(34, 197, 94, 0.6)"
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
      y: { ticks: { color: "#fff" }, stacked: true, beginAtZero: true }
    }
  };

  return (
    <div className="mt-8 p-6 bg-primary-700 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold text-white mb-4">Execution Timeline (Gantt)</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
