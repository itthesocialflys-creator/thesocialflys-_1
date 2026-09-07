"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import Papa from "papaparse";
import { Trash2, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Lead, Profile } from "@/lib/types/database";
import { LEAD_STATUS_LABELS } from "@/lib/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [reassignAgent, setReassignAgent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Lead | "bulk" | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const [{ data: leadsData }, { data: agentsData }] = await Promise.all([
      supabase.from("leads").select("*, profiles:assigned_agent_id(full_name)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").eq("role", "AGENT"),
    ]);
    setLeads(leadsData ?? []);
    setAgents(agentsData ?? []);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function bulkReassign() {
    if (!selected.length || !reassignAgent) return;
    const supabase = createClient();
    await supabase.from("leads").update({ assigned_agent_id: reassignAgent }).in("id", selected);
    setSelected([]);
    fetchData();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createClient();

    if (deleteTarget === "bulk") {
      await supabase.from("leads").delete().in("id", selected);
      setSelected([]);
    } else {
      await supabase.from("leads").delete().eq("id", deleteTarget.id);
    }

    setDeleting(false);
    setDeleteTarget(null);
    fetchData();
  }

  function exportCsv() {
    const rows = (selected.length ? leads.filter((l) => selected.includes(l.id)) : leads).map((l) => ({
      first_name: l.first_name,
      last_name: l.last_name ?? "",
      email: l.email ?? "",
      phone: l.phone ?? "",
      company: l.company ?? "",
      status: LEAD_STATUS_LABELS[l.status],
      estimated_value: l.estimated_value,
      source: l.source,
      agent: (l.profiles as Profile | null)?.full_name ?? "",
      created_at: l.created_at,
    }));

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const columns: ColumnDef<Lead>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selected.includes(row.original.id)}
          onChange={() =>
            setSelected((prev) =>
              prev.includes(row.original.id)
                ? prev.filter((id) => id !== row.original.id)
                : [...prev, row.original.id]
            )
          }
        />
      ),
    },
    {
      accessorKey: "first_name",
      header: "Name",
      cell: ({ row }) => `${row.original.first_name} ${row.original.last_name ?? ""}`,
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "company", header: "Company" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant="outline">{LEAD_STATUS_LABELS[row.original.status]}</Badge>,
    },
    {
      accessorKey: "estimated_value",
      header: "Value",
      cell: ({ row }) => formatCurrency(Number(row.original.estimated_value)),
    },
    { accessorKey: "source", header: "Source" },
    {
      accessorKey: "assigned_agent_id",
      header: "Agent",
      cell: ({ row }) => (row.original.profiles as Profile | null)?.full_name ?? "—",
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => setDeleteTarget(row.original)}
          aria-label="Delete lead"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: leads,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Leads</h1>
        <p className="text-muted-foreground">Global lead management and bulk actions</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search leads..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        {selected.length > 0 && (
          <>
            <Select value={reassignAgent} onValueChange={setReassignAgent}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Reassign to..." /></SelectTrigger>
              <SelectContent>
                {agents.filter((a) => a.is_active).map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={bulkReassign} disabled={!reassignAgent}>
              Reassign {selected.length} leads
            </Button>
            <Button
              variant="outline"
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setDeleteTarget("bulk")}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete {selected.length} leads
            </Button>
          </>
        )}

        <Button variant="outline" className="ml-auto" onClick={exportCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export {selected.length ? `${selected.length} selected` : "all"} as CSV
        </Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left font-medium">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget === "bulk" ? `${selected.length} leads` : "lead"}?</DialogTitle>
            <DialogDescription>
              {deleteTarget === "bulk"
                ? `This will permanently delete ${selected.length} selected leads and their activity history. This cannot be undone.`
                : deleteTarget
                  ? `This will permanently delete ${deleteTarget.first_name} ${deleteTarget.last_name ?? ""} and their activity history. This cannot be undone.`
                  : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}