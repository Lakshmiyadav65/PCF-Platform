// Shared types for the Product Footprints (Beta) wizard.
// This is a self-contained, UI-first flow modelled on Climatiq's PCF Studio.
// Data is currently mocked; wire real services in later.

export type WeightUnit = "kg" | "g" | "lb" | "t";

export type BomRowType = "Component" | "Material" | "Packaging" | "Transport";

export interface ProductBasics {
  productName: string;
  manufacturedIn: string;
  manufacturingYear?: number;
  expectedWeight?: string;
  weightUnit: WeightUnit;
  includesPackaging: boolean;
}

export interface BomRow {
  id: string;
  type: BomRowType;
  description: string;
  quantity: string;
  perUnitWeight: string;
  weightUnit: WeightUnit;
  location: string;
  transport: string; // "Auto" or a named mode
  wastePct: string;
}

export type EnergySource =
  | "Grid electricity"
  | "Renewable electricity"
  | "Natural gas"
  | "Diesel"
  | "Mixed";

export interface Manufacturing {
  location: string;
  energySource: EnergySource;
  electricityKwh?: string;
  processDescription?: string;
}

export interface ProductFootprintDraft {
  basics: ProductBasics;
  composition: BomRow[];
  manufacturing: Manufacturing;
}

// How the user chose to build the Bill of Materials in step 2.
export type CompositionMethod = "template" | "upload" | "manual";

// A saved PCF as shown on the landing list.
export interface ProductFootprintSummary {
  id: string;
  product: string;
  createdAt: string;
  totalKgCo2e?: number;
  status: "Draft" | "Complete";
}
