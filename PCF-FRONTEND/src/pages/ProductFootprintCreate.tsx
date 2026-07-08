import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import ProductBasicsStep from "../features/product-footprint/ProductBasicsStep";
import { getBasicsErrors } from "../features/product-footprint/validation";
import CompositionStep from "../features/product-footprint/CompositionStep";
import ManufacturingStep from "../features/product-footprint/ManufacturingStep";
import { cn } from "../lib/utils";
import {
  emptyBasics,
  emptyManufacturing,
} from "../features/product-footprint/mockData";
import type {
  BomRow,
  Manufacturing,
  ProductBasics,
} from "../features/product-footprint/types";

const STEPS = [
  { key: "basics", title: "Product Basics" },
  { key: "composition", title: "Product Composition" },
  { key: "manufacturing", title: "Manufacturing" },
];

const ProductFootprintCreate: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [showBasicsErrors, setShowBasicsErrors] = useState(false);

  const [basics, setBasics] = useState<ProductBasics>(emptyBasics);
  const [composition, setComposition] = useState<BomRow[]>([]);
  const [manufacturing, setManufacturing] =
    useState<Manufacturing>(emptyManufacturing);

  const patchBasics = (p: Partial<ProductBasics>) =>
    setBasics((prev) => ({ ...prev, ...p }));
  const patchManufacturing = (p: Partial<Manufacturing>) =>
    setManufacturing((prev) => ({ ...prev, ...p }));

  const canContinue = (): boolean => {
    if (current === 0) {
      // Single source of truth shared with the step's inline validation.
      return Object.keys(getBasicsErrors(basics)).length === 0;
    }
    if (current === 1) {
      return composition.some((r) => r.description.trim());
    }
    return true;
  };

  const isLast = current === STEPS.length - 1;

  const handleBack = () => {
    setShowBasicsErrors(false);
    if (current === 0) {
      navigate("/product-footprints");
    } else {
      setCurrent((c) => c - 1);
    }
  };

  const handleContinue = () => {
    if (!canContinue()) {
      // Surface inline field errors on Product Basics; toast elsewhere.
      if (current === 0) {
        setShowBasicsErrors(true);
      } else {
        message.warning("Please complete the required fields to continue.");
      }
      return;
    }
    setShowBasicsErrors(false);
    if (isLast) {
      message.success(`Product footprint for "${basics.productName}" created.`);
      navigate("/product-footprints");
      return;
    }
    // Prefill manufacturing location from basics when entering the last step.
    if (current === 1 && !manufacturing.location.trim()) {
      patchManufacturing({ location: basics.manufacturedIn });
    }
    setCurrent((c) => c + 1);
  };

  const goToStep = (index: number) => {
    if (index <= current) setCurrent(index);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate("/product-footprints")}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100"
            title="Back to Product Footprints"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xs font-medium text-gray-400">
              Product Footprints → New PCF
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-green-700">
              {basics.productName || "Calculate Product Carbon Footprint"}
            </h1>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {STEPS.map((step, index) => {
            const done = index < current;
            const active = index === current;
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => goToStep(index)}
                disabled={index > current}
                className="text-left"
              >
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-colors",
                    done || active ? "bg-green-600" : "bg-gray-200"
                  )}
                />
                <div className="mt-2 flex items-center gap-1.5">
                  {done && <Check className="h-3.5 w-3.5 text-green-600" />}
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      active
                        ? "text-green-700"
                        : done
                        ? "text-gray-700"
                        : "text-gray-400"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          {current === 0 && (
            <ProductBasicsStep
              value={basics}
              onChange={patchBasics}
              showErrors={showBasicsErrors}
            />
          )}
          {current === 1 && (
            <CompositionStep
              productName={basics.productName}
              rows={composition}
              onChange={setComposition}
            />
          )}
          {current === 2 && (
            <ManufacturingStep
              value={manufacturing}
              onChange={patchManufacturing}
              basics={basics}
              rows={composition}
            />
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <p className="text-sm text-gray-500">
            Step <span className="font-semibold text-gray-800">{current + 1}</span>{" "}
            of {STEPS.length} · {STEPS[current].title}
          </p>

          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            {isLast ? "Create PCF" : "Continue"}
            {isLast ? (
              <Check className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFootprintCreate;
