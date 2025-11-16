#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";

type GainEntry = { label: string; value: number };
type GainTimeline = { date: string; value: number };
type ProjectGains = { entries: GainEntry[]; timeline: GainTimeline[] };

const gainsPath = path.join(process.cwd(), "data", "gains.example.json");

function readGains(): Record<string, ProjectGains> {
  const raw = fs.readFileSync(gainsPath, "utf-8");
  return JSON.parse(raw);
}

function toCSV(gains: Record<string, ProjectGains>) {
  const rows: string[] = [];
  rows.push(["project", "type", "label", "value", "date"].join(","));
  for (const [project, data] of Object.entries(gains)) {
    for (const e of data.entries) {
      rows.push([project, "entry", `"${e.label.replace(/"/g, '""')}"`, String(e.value), ""].join(","));
    }
    for (const t of data.timeline) {
      rows.push([project, "timeline", "", String(t.value), t.date].join(","));
    }
  }
  return rows.join("\n");
}

function summary(gains: Record<string, ProjectGains>) {
  const out: Record<string, { totalValue: number; entryCount: number; timelinePoints: number }> = {};
  for (const [project, data] of Object.entries(gains)) {
    const total = data.entries.reduce((s, e) => s + e.value, 0);
    out[project] = { totalValue: total, entryCount: data.entries.length, timelinePoints: data.timeline.length };
  }
  return out;
}

function main() {
  if (!fs.existsSync(gainsPath)) {
    console.error("gains.example.json not found in data/");
    process.exit(1);
  }
  const gains = readGains();
  const csv = toCSV(gains);
  fs.writeFileSync(path.join(process.cwd(), "data", "gains.csv"), csv, "utf-8");
  fs.writeFileSync(path.join(process.cwd(), "data", "gains.summary.json"), JSON.stringify(summary(gains), null, 2), "utf-8");
  console.log("Wrote data/gains.csv and data/gains.summary.json");
}

main();
