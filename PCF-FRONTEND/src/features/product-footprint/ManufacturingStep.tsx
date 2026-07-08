import React from "react";
import { Factory, Boxes, MapPin, Weight } from "lucide-react";
import type { EnergySource, Manufacturing, ProductBasics, BomRow } from "./types";

interface ManufacturingStepProps {
  value: Manufacturing;
  onChange: (patch: Partial<Manufacturing>) => void;
  basics: ProductBasics;
  rows: BomRow[];
}

const ENERGY_SOURCES: EnergySource[] = [
  "Grid electricity",
  "Renewable electricity",
  "Natural gas",
  "Diesel",
  "Mixed",
];

const fieldLabel = "mb-2 block text-sm font-semibold text-gray-800";
const baseInput =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder:text-gray-400";

const ManufacturingStep: React.FC<ManufacturingStepProps> = ({
  value,
  onChange,
  basics,
  rows,
}) => {
  const totalWeight = rows.reduce((sum, r) => {
    const w = parseFloat(r.perUnitWeight) || 0;
    const q = parseFloat(r.quantity) || 0;
    return sum + w * q;
  }, 0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2">
        <Factory className="h-5 w-5 text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">
          How is it manufactured?
        </h2>
      </div>
      <p className="mt-1.5 text-sm text-gray-500">
        Tell us about the production stage. This drives the manufacturing
        emissions for your product.
      </p>

      {/* Review summary */}
      <div className="mt-6 grid gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
            <Boxes className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-gray-400">Components</p>
            <p className="text-sm font-semibold text-gray-800">{rows.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
            <Weight className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-gray-400">Est. total weight</p>
            <p className="text-sm font-semibold text-gray-800">
              {totalWeight ? `${totalWeight.toFixed(3)} kg` : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-gray-400">Manufactured in</p>
            <p className="text-sm font-semibold text-gray-800">
              {basics.manufacturedIn || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={fieldLabel}>Manufacturing Location</label>
            <input
              className={baseInput}
              placeholder={basics.manufacturedIn || "Enter location"}
              value={value.location}
              onChange={(e) => onChange({ location: e.target.value })}
            />
          </div>
          <div>
            <label className={fieldLabel}>Primary Energy Source</label>
            <select
              className={baseInput}
              value={value.energySource}
              onChange={(e) =>
                onChange({ energySource: e.target.value as EnergySource })
              }
            >
              {ENERGY_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={fieldLabel}>
            Electricity Consumption{" "}
            <span className="font-normal italic text-gray-400">
              (kWh per unit, optional)
            </span>
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            className={`${baseInput} max-w-xs`}
            placeholder="e.g., 3.5"
            value={value.electricityKwh}
            onChange={(e) => onChange({ electricityKwh: e.target.value })}
          />
        </div>

        <div>
          <label className={fieldLabel}>
            Process Notes{" "}
            <span className="font-normal italic text-gray-400">(optional)</span>
          </label>
          <textarea
            rows={4}
            className={baseInput}
            placeholder="Describe key manufacturing processes, e.g. injection moulding, CNC machining, assembly…"
            value={value.processDescription}
            onChange={(e) => onChange({ processDescription: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default ManufacturingStep;
