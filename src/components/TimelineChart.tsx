import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { GainTimeline } from "../types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

export default function TimelineChart({ timeline }: { timeline: GainTimeline[] }) {
  const labels = timeline.map(t => t.date);
  const data = timeline.map(t => t.value);
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Evolução",
            data,
            fill: true,
            borderColor: "rgba(34,197,94,0.9)",
            backgroundColor: "rgba(34,197,94,0.12)",
            tension: 0.25
          }
        ]
      }}
      options={{ responsive: true, plugins: { legend: { display: true } } }}
    />
  );
}
