"use client";

import { useState, useCallback } from "react";
import { Upload, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  parseCsvFile,
  autoMapColumns,
  mapRowsToLeads,
  validateLeads,
  LEAD_FIELD_OPTIONS,
  type ColumnMapping,
} from "@/lib/utils/csvParser";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Profile } from "@/lib/types/database";

interface CsvImporterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agents: Profile[];
  onImportComplete: () => void;
}

export function CsvImporterModal({
  open,
  onOpenChange,
  agents,
  onImportComplete,
}: CsvImporterModalProps) {
  const [step, setStep] = useState<"upload" | "map" | "validate" | "importing">("upload");
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [validation, setValidation] = useState<ReturnType<typeof validateLeads> | null>(null);
  const [allocationMode, setAllocationMode] = useState<"round_robin" | "manual">("round_robin");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [error, setError] = useState("");
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);

  const reset = useCallback(() => {
    setStep("upload");
    setMappings([]);
    setValidation(null);
    setParsedRows([]);
    setError("");
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const result = await parseCsvFile(file);
    if (result.errors.length) {
      setError(result.errors.join(", "));
      return;
    }
    setParsedRows(result.rows);
    setMappings(autoMapColumns(result.headers));
    setStep("map");
  }

  function handleValidate() {
    const leads = mapRowsToLeads(parsedRows, mappings);
    const result = validateLeads(leads);
    setValidation(result);
    setStep("validate");
  }

  async function handleImport() {
    if (!validation?.valid.length) return;
    setStep("importing");
    setError("");

    try {
      const res = await fetch("/api/admin/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads: validation.valid,
          allocationMode,
          agentId: allocationMode === "manual" ? selectedAgent : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Import failed");
      }

      onImportComplete();
      onOpenChange(false);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
      setStep("validate");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>CSV Lead Importer</DialogTitle>
          <DialogDescription>Upload and map CSV columns to lead fields</DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <Label htmlFor="csv-file" className="cursor-pointer">
              <div className="rounded-lg border-2 border-dashed px-8 py-6 text-center hover:bg-accent">
                <p className="font-medium">Drop CSV file or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Supports .csv files</p>
              </div>
              <input id="csv-file" type="file" accept=".csv" className="hidden" onChange={handleFile} />
            </Label>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        {step === "map" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Map CSV columns to lead fields:</p>
            {mappings.map((m, i) => (
              <div key={m.csvColumn} className="grid grid-cols-2 gap-4 items-center">
                <span className="text-sm font-medium">{m.csvColumn}</span>
                <Select
                  value={m.leadField || "skip"}
                  onValueChange={(v) => {
                    const updated = [...mappings];
                    updated[i] = { ...m, leadField: v === "skip" ? "" : (v as ColumnMapping["leadField"]) };
                    setMappings(updated);
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skip">— Skip —</SelectItem>
                    {LEAD_FIELD_OPTIONS.map((f) => (
                      <SelectItem key={f.key} value={f.key}>{f.label}{f.required ? " *" : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button onClick={handleValidate} className="w-full">Validate & Preview</Button>
          </div>
        )}

        {step === "validate" && validation && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />
                <p className="mt-1 text-lg font-bold">{validation.valid.length}</p>
                <p className="text-xs text-muted-foreground">Valid</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <AlertTriangle className="mx-auto h-5 w-5 text-yellow-500" />
                <p className="mt-1 text-lg font-bold">{validation.invalid.length}</p>
                <p className="text-xs text-muted-foreground">Invalid</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <AlertTriangle className="mx-auto h-5 w-5 text-orange-500" />
                <p className="mt-1 text-lg font-bold">{validation.duplicates.length}</p>
                <p className="text-xs text-muted-foreground">Duplicates</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Allocation Mode</Label>
              <Select value={allocationMode} onValueChange={(v) => setAllocationMode(v as typeof allocationMode)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="round_robin">Round-Robin (Active Agents)</SelectItem>
                  <SelectItem value="manual">Manual (Single Agent)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {allocationMode === "manual" && (
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
                  <SelectContent>
                    {agents.filter((a) => a.is_active).map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              onClick={handleImport}
              disabled={!validation.valid.length || (allocationMode === "manual" && !selectedAgent)}
              className="w-full"
            >
              Import {validation.valid.length} Leads
            </Button>
          </div>
        )}

        {step === "importing" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p>Importing leads...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
