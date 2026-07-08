// Mocked data for the Product Footprints (Beta) flow.
// Replace with real service calls when the backend is ready.

import type {
  BomRow,
  ProductBasics,
  Manufacturing,
  ProductFootprintSummary,
  WeightUnit,
} from "./types";

let rowSeq = 0;
// Deterministic id generator (Date.now/Math.random are avoided intentionally).
export const newRowId = () => `row-${++rowSeq}`;

export const emptyBasics: ProductBasics = {
  productName: "",
  manufacturedIn: "",
  manufacturingYear: undefined,
  expectedWeight: "",
  weightUnit: "kg",
  includesPackaging: false,
};

export const emptyManufacturing: Manufacturing = {
  location: "",
  energySource: "Grid electricity",
  electricityKwh: "",
  processDescription: "",
};

export const weightUnits: WeightUnit[] = ["kg", "g", "lb", "t"];

export const manufacturingYears: number[] = Array.from(
  { length: 11 },
  (_, i) => 2026 - i
);

export const makeEmptyRow = (): BomRow => ({
  id: newRowId(),
  type: "Component",
  description: "",
  quantity: "1",
  perUnitWeight: "",
  weightUnit: "kg",
  location: "",
  transport: "Auto",
  wastePct: "0",
});

// Sample rows returned by the "template" / "upload" flows to mimic the
// "Generating your Bill of Materials..." result in the reference design.
export const sampleBomRows = (): BomRow[] =>
  [
    ["Main Housing Shell (Aluminum)", "1", "1.2", "15"],
    ["Internal Support Frame (Stainless Steel)", "1", "0.45", "8"],
    ["Front Bezel (ABS Plastic)", "1", "0.15", "5"],
    ["Mounting Brackets (Zinc-plated Steel)", "2", "0.22", "5"],
    ["Enclosure Screws (Stainless Steel)", "8", "0.04", "2"],
    ["Sealing Gasket (Silicone Rubber)", "1", "0.03", "10"],
    ["Internal Shielding Foil (Copper)", "1", "0.015", "12"],
    ["Access Panel (Aluminum)", "1", "0.18", "10"],
    ["Hinge Assembly (Steel)", "2", "0.08", "5"],
    ["Thermal Interface Pad (Silicone)", "1", "0.01", "15"],
  ].map(
    ([description, quantity, perUnitWeight, wastePct]): BomRow => ({
      id: newRowId(),
      type: "Component",
      description,
      quantity,
      perUnitWeight,
      weightUnit: "kg",
      location: "",
      transport: "Auto",
      wastePct,
    })
  );

// Mocked list shown on the landing page. Start empty to mirror the
// "You haven't created any PCFs yet." state; flip to sampleFootprints
// to preview the populated table.
export const savedFootprints: ProductFootprintSummary[] = [];

export const sampleFootprints: ProductFootprintSummary[] = [
  {
    id: "pcf-1001",
    product: "Industrial Router Housing",
    createdAt: "2026-06-24",
    totalKgCo2e: 42.7,
    status: "Complete",
  },
  {
    id: "pcf-1002",
    product: "Office Chair (Ergo Series)",
    createdAt: "2026-06-18",
    totalKgCo2e: 128.4,
    status: "Draft",
  },
];
