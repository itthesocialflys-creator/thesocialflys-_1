import Link from "next/link";
import type { Lead } from "@/lib/types/database";
import { formatCurrency, getLeadDisplayName } from "@/lib/utils";
import { LEAD_STATUS_LABELS } from "@/lib/types/database";
import { Badge } from "@/components/ui/badge";

interface LeadCardPreviewProps {
  lead: Lead;
  onClick?: () => void;
  compact?: boolean;
}

export function LeadCardPreview({ lead, onClick, compact }: LeadCardPreviewProps) {
  const content = (
    <div
      className="rounded-lg border bg-card p-3 text-sm hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium">{getLeadDisplayName(lead)}</span>
        <Badge variant="outline" className="text-xs shrink-0">
          {LEAD_STATUS_LABELS[lead.status]}
        </Badge>
      </div>
      {!compact && (
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatCurrency(Number(lead.estimated_value))}</span>
          {lead.email && <span>· {lead.email}</span>}
        </div>
      )}
    </div>
  );

  if (onClick) return content;
  return (
    <Link href={`/pipeline?lead=${lead.id}`} className="block">
      {content}
    </Link>
  );
}
