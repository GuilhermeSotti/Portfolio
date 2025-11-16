import { useMemo } from "react";
import { ProjectGains } from "../types";

export function useAggregateGains(gainsMap: Record<string, ProjectGains | undefined>) {
  return useMemo(() => {
    const projects = Object.entries(gainsMap).map(([k, v]) => ({ repoName: k, ...v })) as any[];
    const totalByLabel: Record<string, number> = {};
    for (const p of projects) {
      if (!p?.entries) continue;
      for (const e of p.entries) {
        totalByLabel[e.label] = (totalByLabel[e.label] || 0) + e.value;
      }
    }
    return { projects, totalByLabel };
  }, [gainsMap]);
}
