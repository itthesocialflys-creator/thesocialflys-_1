"use client";

import { useEffect, useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { CsvImporterModal } from "@/components/crm/CsvImporterModal";

export default function AdminImporterPage() {
  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState<Profile[]>([]);

  const fetchAgents = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("profiles").select("*").eq("role", "AGENT");
    setAgents(data ?? []);
  }, []);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CSV Lead Importer</h1>
        <p className="text-muted-foreground">
          Upload CSV files with auto-column mapping and round-robin allocation
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
        <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="mb-4 text-muted-foreground">Import leads from a CSV spreadsheet</p>
        <Button onClick={() => setOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Open Importer
        </Button>
      </div>

      <CsvImporterModal
        open={open}
        onOpenChange={setOpen}
        agents={agents}
        onImportComplete={fetchAgents}
      />
    </div>
  );
}
