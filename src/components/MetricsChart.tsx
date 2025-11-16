import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement } from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
import { GainEntry } from "../types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement);

export function BarGain({ entries }: { entries: GainEntry[] }) {
  const labels = entries.map(e => e.label);
  const data = entries.map(e => e.value);
  return (
    <Bar
      options={{ responsive: true, plugins: { legend: { display: false } } }}
      data={{
        labels,
        datasets: [{ label: "Ganhos", data, backgroundColor: labels.map(() => "rgba(59,130,246,0.8)") }]
      }}
    />
  );
}

export function RadarGain({ entries }: { entries: GainEntry[] }) {
  const labels = entries.map(e => e.label);
  const data = entries.map(e => e.value);
  return (
    <Radar
      data={{
        labels,
        datasets: [{ label: "Ganho (radar)", data, backgroundColor: "rgba(99,102,241,0.45)", borderColor: "rgba(99,102,241,0.9)" }]
      }}
      options={{ responsive: true }}
    />
  );
}
