/**
 * Script utilitário: chama getMergedLinkedInProfile (se você quiser executar localmente)
 * Gera data/linkedin.merged.json com o resultado.
 *
 * Uso:
 *  LINKEDIN_ACCESS_TOKEN=xxxx npm run ts-node scripts/importLinkedin.ts
 *
 * Requer ts-node (devDependency) ou compile com tsc.
 */

import fs from "fs";
import path from "path";
import { getMergedLinkedInProfile } from "../src/services/linkedin";

async function main() {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const merged = await getMergedLinkedInProfile(token);
  const outPath = path.join(process.cwd(), "data", "linkedin.merged.json");
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), "utf-8");
  console.log("Wrote", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
