import Papa from "papaparse";
import type { CsvLeadRow } from "@/lib/types/database";

export const LEAD_FIELD_OPTIONS = [
  { key: "first_name", label: "First Name", required: true },
  { key: "last_name", label: "Last Name", required: false },
  { key: "email", label: "Email", required: false },
  { key: "phone", label: "Phone", required: false },
  { key: "company", label: "Company", required: false },
  { key: "estimated_value", label: "Estimated Value", required: false },
] as const;

export type LeadFieldKey = (typeof LEAD_FIELD_OPTIONS)[number]["key"];

export interface ColumnMapping {
  csvColumn: string;
  leadField: LeadFieldKey | "";
}

export interface ParsedCsvResult {
  headers: string[];
  rows: Record<string, string>[];
  errors: string[];
}

export interface ValidationResult {
  valid: CsvLeadRow[];
  invalid: { row: number; reason: string; data: Record<string, string> }[];
  duplicates: { row: number; email: string }[];
}

const AUTO_MAP: Record<string, LeadFieldKey> = {
  first_name: "first_name",
  firstname: "first_name",
  "first name": "first_name",
  fname: "first_name",
  last_name: "last_name",
  lastname: "last_name",
  "last name": "last_name",
  lname: "last_name",
  email: "email",
  "e-mail": "email",
  mail: "email",
  phone: "phone",
  mobile: "phone",
  tel: "phone",
  telephone: "phone",
  company: "company",
  organization: "company",
  org: "company",
  estimated_value: "estimated_value",
  value: "estimated_value",
  amount: "estimated_value",
  deal_value: "estimated_value",
};

export function parseCsvFile(file: File): Promise<ParsedCsvResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        resolve({
          headers,
          rows: results.data as Record<string, string>[],
          errors: results.errors.map((e) => e.message),
        });
      },
      error: (error) => {
        resolve({ headers: [], rows: [], errors: [error.message] });
      },
    });
  });
}

export function autoMapColumns(headers: string[]): ColumnMapping[] {
  return headers.map((header) => {
    const normalized = header.toLowerCase().trim();
    return {
      csvColumn: header,
      leadField: AUTO_MAP[normalized] ?? "",
    };
  });
}

export function mapRowsToLeads(
  rows: Record<string, string>[],
  mappings: ColumnMapping[]
): CsvLeadRow[] {
  return rows.map((row) => {
    const lead: CsvLeadRow = { first_name: "" };
    for (const mapping of mappings) {
      if (!mapping.leadField) continue;
      const value = row[mapping.csvColumn]?.trim() ?? "";
      if (mapping.leadField === "estimated_value") {
        lead.estimated_value = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
      } else if (mapping.leadField === "first_name") {
        lead.first_name = value;
      } else if (mapping.leadField === "last_name") {
        lead.last_name = value;
      } else if (mapping.leadField === "email") {
        lead.email = value;
      } else if (mapping.leadField === "phone") {
        lead.phone = value;
      } else if (mapping.leadField === "company") {
        lead.company = value;
      }
    }
    return lead;
  });
}

export function validateLeads(
  leads: CsvLeadRow[],
  existingEmails: Set<string> = new Set()
): ValidationResult {
  const valid: CsvLeadRow[] = [];
  const invalid: ValidationResult["invalid"] = [];
  const duplicates: ValidationResult["duplicates"] = [];
  const seenEmails = new Set<string>();

  leads.forEach((lead, index) => {
    const row = index + 2;
    if (!lead.first_name?.trim()) {
      invalid.push({ row, reason: "First name is required", data: lead as unknown as Record<string, string> });
      return;
    }
    if (lead.email) {
      const email = lead.email.toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        invalid.push({ row, reason: "Invalid email format", data: lead as unknown as Record<string, string> });
        return;
      }
      if (existingEmails.has(email) || seenEmails.has(email)) {
        duplicates.push({ row, email });
        return;
      }
      seenEmails.add(email);
    }
    valid.push(lead);
  });

  return { valid, invalid, duplicates };
}
