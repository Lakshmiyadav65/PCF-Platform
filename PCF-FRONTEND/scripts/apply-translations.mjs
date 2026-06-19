// Merges translation workflow output into the locale JSON files.
//
// Usage: node scripts/apply-translations.mjs <workflow-output-file.json>
//
// The output file's result is [{ code, items: [{ i, t }] }]. Indices map into
// scripts/.i18n-to-translate.json (the canonical source-string list), so each
// locale file becomes { "<exact English source>": "<translation>" }.

import { readFileSync, writeFileSync } from "node:fs";

const sources = JSON.parse(readFileSync("scripts/.i18n-to-translate.json", "utf8"));
const outFile = process.argv[2];
if (!outFile) {
  console.error("Provide the workflow output file path as the first argument.");
  process.exit(1);
}

const onlyCodes = process.argv.slice(3); // optional: restrict to these lang codes

const raw = JSON.parse(readFileSync(outFile, "utf8"));
const langs = (Array.isArray(raw) ? raw : raw.result).filter(
  (l) => onlyCodes.length === 0 || onlyCodes.includes(l.code),
);

for (const lang of langs) {
  if (!lang.items || lang.items.length === 0) {
    console.log(`skip ${lang.code} (empty)`);
    continue;
  }
  const map = {};
  for (const { i, t } of lang.items) {
    if (typeof i === "number" && i >= 0 && i < sources.length && typeof t === "string" && t.length) {
      map[sources[i]] = t;
    }
  }
  const path = `src/i18n/locales/${lang.code}.json`;
  let existing = {};
  try {
    existing = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    /* new file */
  }
  const merged = { ...existing, ...map };
  // Stable key order for clean diffs.
  const ordered = {};
  for (const k of Object.keys(merged).sort()) ordered[k] = merged[k];
  writeFileSync(path, JSON.stringify(ordered, null, 2) + "\n");
  const covered = Object.keys(map).length;
  console.log(`wrote ${lang.code}: ${covered}/${sources.length} keys (file total ${Object.keys(ordered).length})`);
}
