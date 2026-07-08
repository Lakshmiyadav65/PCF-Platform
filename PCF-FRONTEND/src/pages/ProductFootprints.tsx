import React from "react";
import { useNavigate } from "react-router-dom";
import { Boxes, ArrowRight, Plus } from "lucide-react";
import { savedFootprints } from "../features/product-footprint/mockData";

const ProductFootprints: React.FC = () => {
  const navigate = useNavigate();
  const footprints = savedFootprints;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Product Carbon Footprint
              </h1>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                Beta
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Create and view your product carbon footprint.
            </p>
          </div>
          <button
            onClick={() => navigate("/product-footprints/new")}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            <Plus className="h-4 w-4" /> Create a new PCF
          </button>
        </div>

        {/* Create card */}
        <button
          onClick={() => navigate("/product-footprints/new")}
          className="group flex w-full items-start gap-5 rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-green-400 hover:shadow-md"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-600">
            <Boxes className="h-7 w-7" />
          </span>
          <span className="flex-1">
            <span className="block text-lg font-bold text-gray-900">
              Create a new Product Footprint (PCF)
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Calculate product carbon footprints across materials,
              manufacturing and transport.
            </span>
          </span>
          <ArrowRight className="mt-1 h-5 w-5 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-green-600" />
        </button>

        {/* Existing PCFs */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Your Product Carbon Footprints
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3 text-right">Total (kg CO₂e)</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {footprints.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-sm text-gray-400">
                        You haven&apos;t created any PCFs yet.
                      </p>
                    </td>
                  </tr>
                ) : (
                  footprints.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b border-gray-50 last:border-0 transition hover:bg-green-50/40"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {f.product}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {f.createdAt}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
                        {f.totalKgCo2e != null ? f.totalKgCo2e.toFixed(1) : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            f.status === "Complete"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFootprints;
