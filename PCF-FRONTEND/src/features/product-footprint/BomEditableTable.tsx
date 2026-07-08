import React from "react";
import { Trash2, Boxes } from "lucide-react";
import type { BomRow, BomRowType, WeightUnit } from "./types";
import { weightUnits } from "./mockData";

interface BomEditableTableProps {
  rows: BomRow[];
  onChange: (rows: BomRow[]) => void;
  readOnly?: boolean;
}

const ROW_TYPES: BomRowType[] = ["Component", "Material", "Packaging", "Transport"];
const TRANSPORT_MODES = ["Auto", "Road", "Rail", "Sea", "Air"];

const cellInput =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder:text-gray-400";
const cellSelect =
  "w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20";

const BomEditableTable: React.FC<BomEditableTableProps> = ({
  rows,
  onChange,
  readOnly = false,
}) => {
  const updateRow = (id: string, patch: Partial<BomRow>) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = (id: string) => {
    onChange(rows.filter((r) => r.id !== id));
  };

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
          <Boxes className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-sm font-medium text-gray-700">No components yet</p>
        <p className="mt-1 text-sm text-gray-400">
          Add your first row to start building the Bill of Materials.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">
              Type <span className="text-green-600">*</span>
            </th>
            <th className="px-4 py-3">
              Description <span className="text-green-600">*</span>
            </th>
            <th className="px-4 py-3 w-24">Quantity</th>
            <th className="px-4 py-3 w-52">
              Per-unit Weight <span className="text-green-600">*</span>
            </th>
            <th className="px-4 py-3 w-44">
              Location <span className="text-green-600">*</span>
            </th>
            <th className="px-4 py-3 w-36">Transport</th>
            <th className="px-4 py-3 w-24">Waste %</th>
            {!readOnly && <th className="px-2 py-3 w-10" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="group align-top hover:bg-green-50/30">
              {/* Type */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 shrink-0 text-green-500" />
                  <select
                    className={cellSelect}
                    value={row.type}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(row.id, { type: e.target.value as BomRowType })
                    }
                  >
                    {ROW_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </td>

              {/* Description */}
              <td className="px-4 py-3">
                <input
                  className={cellInput}
                  value={row.description}
                  disabled={readOnly}
                  placeholder="e.g. Main Housing Shell (Aluminum)"
                  onChange={(e) =>
                    updateRow(row.id, { description: e.target.value })
                  }
                />
              </td>

              {/* Quantity */}
              <td className="px-4 py-3">
                <input
                  type="number"
                  min={0}
                  className={cellInput}
                  value={row.quantity}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateRow(row.id, { quantity: e.target.value })
                  }
                />
              </td>

              {/* Per-unit weight + unit */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step="0.001"
                    className={cellInput}
                    value={row.perUnitWeight}
                    disabled={readOnly}
                    placeholder="0.00"
                    onChange={(e) =>
                      updateRow(row.id, { perUnitWeight: e.target.value })
                    }
                  />
                  <select
                    className={`${cellSelect} w-20`}
                    value={row.weightUnit}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateRow(row.id, {
                        weightUnit: e.target.value as WeightUnit,
                      })
                    }
                  >
                    {weightUnits.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </td>

              {/* Location */}
              <td className="px-4 py-3">
                <input
                  className={cellInput}
                  value={row.location}
                  disabled={readOnly}
                  placeholder="e.g. Berlin"
                  onChange={(e) =>
                    updateRow(row.id, { location: e.target.value })
                  }
                />
              </td>

              {/* Transport */}
              <td className="px-4 py-3">
                <select
                  className={cellSelect}
                  value={row.transport}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateRow(row.id, { transport: e.target.value })
                  }
                >
                  {TRANSPORT_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </td>

              {/* Waste % */}
              <td className="px-4 py-3">
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={cellInput}
                  value={row.wastePct}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateRow(row.id, { wastePct: e.target.value })
                  }
                />
              </td>

              {/* Delete */}
              {!readOnly && (
                <td className="px-2 py-3">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-500 group-hover:text-gray-400"
                    title="Remove row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BomEditableTable;
