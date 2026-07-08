import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Upload,
  Pencil,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Plus,
  Loader2,
  ClipboardList,
  FileUp,
} from "lucide-react";
import type { BomRow, CompositionMethod } from "./types";
import { makeEmptyRow, sampleBomRows } from "./mockData";
import BomEditableTable from "./BomEditableTable";

interface CompositionStepProps {
  productName: string;
  rows: BomRow[];
  onChange: (rows: BomRow[]) => void;
}

type Phase = "choose" | "uploading" | "generating" | "builder";

const OPTIONS: {
  method: CompositionMethod;
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    method: "template",
    label: "Option 1",
    title: "Start fast with a template",
    description: "Get a list of suggestions based on similar products.",
    icon: Sparkles,
  },
  {
    method: "upload",
    label: "Option 2",
    title: "Upload your Bill of Materials",
    description:
      "Import your existing data for the highest accuracy. Best if you already have a file.",
    icon: Upload,
  },
  {
    method: "manual",
    label: "Option 3",
    title: "Enter Manually",
    description:
      "Build your BoM row by row. Best for a smaller list of components or when you don't have a file ready.",
    icon: Pencil,
  },
];

const CompositionStep: React.FC<CompositionStepProps> = ({
  productName,
  rows,
  onChange,
}) => {
  const [phase, setPhase] = useState<Phase>(
    rows.length > 0 ? "builder" : "choose"
  );

  // Keep the latest onChange without re-triggering the generate timer.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Simulate "Generating your Bill of Materials..." for template/upload flows.
  useEffect(() => {
    if (phase !== "generating") return;
    const t = setTimeout(() => {
      onChangeRef.current(sampleBomRows());
      setPhase("builder");
    }, 1500);
    return () => clearTimeout(t);
  }, [phase]);

  const chooseMethod = (method: CompositionMethod) => {
    if (method === "manual") {
      onChange([makeEmptyRow()]);
      setPhase("builder");
    } else if (method === "upload") {
      setPhase("uploading");
    } else {
      setPhase("generating");
    }
  };

  const handleFilePicked = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // Mocked: we don't parse the file yet, just simulate generation.
    setPhase("generating");
  };

  const startOver = () => {
    onChange([]);
    setPhase("choose");
  };

  const addRow = () => onChange([...rows, makeEmptyRow()]);

  return (
    <div>
      {/* Heading + trust strip */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 shrink-0 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Add your product components and materials
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-gray-500">
            We&apos;ll match each one to an emission factor to calculate the
            carbon footprint. Pick the option that fits best, you can refine
            everything before saving.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 lg:items-end">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <ShieldCheck className="h-4 w-4 shrink-0 text-green-600" />
            Uploaded files are deleted after processing.
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
              ISO 27001
            </span>
            <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
              SOC 2
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {phase === "choose" && (
          <div className="space-y-4">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.method}
                  type="button"
                  onClick={() => chooseMethod(opt.method)}
                  className="group relative flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-green-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/30"
                >
                  <span className="absolute -top-2.5 left-5 rounded-full bg-white px-2 text-xs font-semibold text-gray-400">
                    {opt.label}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-base font-semibold text-gray-900">
                      {opt.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-gray-500">
                      {opt.description}
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-green-600" />
                </button>
              );
            })}
          </div>
        )}

        {phase === "uploading" && (
          <div>
            <label
              htmlFor="bom-file"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-6 py-14 text-center transition hover:border-green-400 hover:bg-green-50/40"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                <FileUp className="h-7 w-7 text-green-600" />
              </div>
              <p className="text-base font-semibold text-gray-800">
                Upload your Bill of Materials
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Drag &amp; drop or click to browse. CSV or Excel, up to 10&nbsp;MB.
              </p>
              <input
                id="bom-file"
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={(e) => handleFilePicked(e.target.files)}
              />
            </label>
            <button
              type="button"
              onClick={startOver}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4" /> Back to options
            </button>
          </div>
        )}

        {phase === "generating" && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
            <Loader2 className="h-9 w-9 animate-spin text-green-600" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Generating your Bill of Materials...
            </p>
          </div>
        )}

        {phase === "builder" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={startOver}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                <RotateCcw className="h-4 w-4" /> Start Over
              </button>
              <button
                type="button"
                onClick={addRow}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-400 hover:text-green-700"
              >
                <Plus className="h-4 w-4" /> Add Row
              </button>
            </div>
            <BomEditableTable rows={rows} onChange={onChange} />
            {productName && (
              <p className="mt-3 text-xs text-gray-400">
                Building the Bill of Materials for{" "}
                <span className="font-medium text-gray-500">{productName}</span>.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompositionStep;
