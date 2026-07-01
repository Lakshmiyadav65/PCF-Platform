import React from "react";
import { Info } from "lucide-react";
import type { ProductBasics, WeightUnit } from "./types";
import { manufacturingYears, weightUnits } from "./mockData";

interface ProductBasicsStepProps {
  value: ProductBasics;
  onChange: (patch: Partial<ProductBasics>) => void;
}

const fieldLabel = "mb-2 block text-sm font-semibold text-gray-800";
const baseInput =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder:text-gray-400";

const ProductBasicsStep: React.FC<ProductBasicsStepProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold text-gray-900">Tell us about your product</h2>
      <p className="mt-1.5 text-sm text-gray-500">
        Start with the basics. We use these details to pick the right emission
        factors for where and when your product is made.
      </p>

      <div className="mt-8 space-y-6">
        {/* Product name */}
        <div>
          <label className={fieldLabel}>Product Name</label>
          <input
            className={baseInput}
            placeholder="e.g., Hammer, Laptop, Office Chair"
            value={value.productName}
            onChange={(e) => onChange({ productName: e.target.value })}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Manufactured in */}
          <div>
            <label className={fieldLabel}>Manufactured In</label>
            <input
              className={baseInput}
              placeholder="Enter location"
              value={value.manufacturedIn}
              onChange={(e) => onChange({ manufacturedIn: e.target.value })}
            />
          </div>

          {/* Manufacturing year */}
          <div>
            <label className={fieldLabel}>Manufacturing Year</label>
            <select
              className={baseInput}
              value={value.manufacturingYear ?? ""}
              onChange={(e) =>
                onChange({
                  manufacturingYear: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            >
              <option value="">Select year</option>
              {manufacturingYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expected weight */}
        <div>
          <label className={fieldLabel}>
            Expected Product Weight{" "}
            <span className="font-normal italic text-gray-400">(optional)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              step="0.001"
              className={`${baseInput} max-w-xs`}
              placeholder="e.g., 0.285"
              value={value.expectedWeight}
              onChange={(e) => onChange({ expectedWeight: e.target.value })}
            />
            <select
              className={`${baseInput} w-24`}
              value={value.weightUnit}
              onChange={(e) =>
                onChange({ weightUnit: e.target.value as WeightUnit })
              }
            >
              {weightUnits.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Includes packaging toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={value.includesPackaging}
            onClick={() =>
              onChange({ includesPackaging: !value.includesPackaging })
            }
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              value.includesPackaging ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                value.includesPackaging ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">
            Includes packaging
          </span>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default ProductBasicsStep;
