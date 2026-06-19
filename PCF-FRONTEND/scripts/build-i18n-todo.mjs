// Combines extracted schema strings with the UI/validation strings used in the
// questionnaire components into one de-duplicated list to be translated.
// Pure-numeric / code-only strings (years, "0.00", "0-100") are excluded — they
// stay identical across languages and fall back to the source automatically.
//
// Output: scripts/.i18n-to-translate.json  (workflow input; not shipped)

import { readFileSync, writeFileSync } from "node:fs";

const schemaStrings = JSON.parse(readFileSync("src/i18n/source-strings.json", "utf8"));

// Strings rendered directly by the components (buttons, progress, modals,
// validation messages). {{x}} are i18next interpolation placeholders.
const uiStrings = [
  // Header / page
  "Supplier Questionnaire",
  "Manufacturer Own Emissions Questionnaire",
  "Save Draft",
  "Download PDF Report",
  "Download a copy of your responses for your records. Your data has been recorded and will be used for the Product Carbon Footprint calculation.",
  // Progress panel
  "Progress",
  "{{current}} of {{total}}",
  "{{answered}} of {{total}} questions answered",
  // Navigation / buttons
  "Previous",
  "Next",
  "Save & Exit",
  "Preview & Submit",
  "Navigation",
  "Press Ctrl+Enter",
  "Language",
  // Save & exit modal
  "Save and Continue Later?",
  "Your progress will be saved and you can continue later.",
  // Validation toasts
  "Please fill in the required fields to continue.",
  "Please fill in the required fields before submitting.",
  // Inline field validation
  "Please answer {{q}}. This field is required.",
  "This field is required. Please check the box to continue.",
  "Please check this box to acknowledge {{q}}",
  "This field is required. Please provide a value.",
  "Please add at least one entry to {{q}}. This table is required.",
  "Please add at least one entry to this table. This field is required.",
  'Please fill in "{{col}}" for this row. This field is required.',
  'Please select "{{col}}"',
  "Please enter a valid email address (e.g., name@example.com)",
  "Please enter a value of at least {{min}}",
  "Please enter a value that does not exceed {{max}}",
  "Please limit your response to {{max}} characters or less",
  "(Required - add at least one entry)",
];

// Skip strings with no letters (pure numbers / numeric formats / ranges).
const hasLetters = (s) => /\p{L}/u.test(s);

const combined = [...schemaStrings.filter(hasLetters), ...uiStrings];
const unique = [...new Set(combined)];

writeFileSync("scripts/.i18n-to-translate.json", JSON.stringify(unique, null, 2) + "\n");
console.log(
  `Schema strings kept: ${schemaStrings.filter(hasLetters).length} (of ${schemaStrings.length}), ` +
    `UI strings: ${uiStrings.length}, total unique: ${unique.length}`
);
