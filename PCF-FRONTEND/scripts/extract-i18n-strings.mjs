// Extracts every translatable string from the ACTIVE questionnaire schema
// (QUESTIONNAIRE_SCHEMA, i.e. after section/label renumbering) so translation
// keys match the exact strings rendered at runtime.
//
// Usage: node scripts/extract-i18n-strings.mjs
// Output: src/i18n/source-strings.json  (sorted, de-duplicated English strings)

import * as esbuild from "esbuild";
import { writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const SCHEMA_ENTRY = "src/config/questionnaireSchema.ts";

// Bundle the schema (TS -> ESM) in-memory, then import it to read the runtime values.
const result = await esbuild.build({
  entryPoints: [SCHEMA_ENTRY],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  logLevel: "error",
});

const tmpFile = join(tmpdir(), `qschema-${process.pid}.mjs`);
writeFileSync(tmpFile, result.outputFiles[0].text);
const mod = await import(pathToFileURL(tmpFile).href);
const schema = mod.QUESTIONNAIRE_SCHEMA;

const set = new Set();
const add = (s) => {
  if (typeof s === "string" && s.trim().length > 0) set.add(s);
};

function walkField(field) {
  add(field.label);
  add(field.placeholder);
  add(field.addButtonLabel);
  if (typeof field.content === "string") add(field.content);
  if (Array.isArray(field.options)) {
    for (const opt of field.options) {
      if (typeof opt === "string") add(opt);
      else if (opt && typeof opt === "object") add(opt.label);
    }
  }
  if (Array.isArray(field.columns)) field.columns.forEach(walkField);
  if (Array.isArray(field.fields)) field.fields.forEach(walkField);
}

for (const section of schema) {
  add(section.title);
  add(section.description);
  for (const field of section.fields) walkField(field);
}

const strings = [...set].sort((a, b) => a.localeCompare(b));
mkdirSync("src/i18n", { recursive: true });
writeFileSync("src/i18n/source-strings.json", JSON.stringify(strings, null, 2) + "\n");
console.log(`Extracted ${strings.length} unique translatable schema strings -> src/i18n/source-strings.json`);
