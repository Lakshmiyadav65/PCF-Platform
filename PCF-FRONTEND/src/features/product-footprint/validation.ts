// Validation rules for the Product Footprints (Beta) wizard.
// Kept separate from components so both the step UI and the wizard shell
// can share a single source of truth (and to satisfy react-refresh).

import type { ProductBasics } from "./types";

export type BasicsField =
  | "productName"
  | "manufacturedIn"
  | "manufacturingYear";

// Returns a map of required-field -> error message for any missing fields.
// An empty object means Product Basics is valid.
export const getBasicsErrors = (
  value: ProductBasics
): Partial<Record<BasicsField, string>> => {
  const errors: Partial<Record<BasicsField, string>> = {};
  if (!value.productName.trim()) errors.productName = "Product name is required.";
  if (!value.manufacturedIn.trim())
    errors.manufacturedIn = "Manufactured in is required.";
  if (!value.manufacturingYear)
    errors.manufacturingYear = "Manufacturing year is required.";
  return errors;
};
