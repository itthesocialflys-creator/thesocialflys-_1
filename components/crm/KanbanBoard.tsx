"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, type Lead, type LeadStatus } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onLeadClick: (lead: Lead) => void;
}

export function KanbanBoard({ leads, onStatusChange, onLeadClick }: KanbanBoardProps) {
  const columns = LEAD_STATUSES.map((status) => ({
    status,
    leads: leads.filter((l) => l.status === status),
  }));

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as LeadStatus;
    const leadId = result.draggableId;
    const lead = leads.find((l) => l.id === leadId);
    if (lead && lead.status !== newStatus) {
      onStatusChange(leadId, newStatus);
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(({ status, leads: colLeads }) => (
          <div key={status} className="w-72 shrink-0">
            <div className="mb-3 flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", LEAD_STATUS_COLORS[status])} />
              <h3 className="text-sm font-semibold">{LEAD_STATUS_LABELS[status]}</h3>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">{colLeads.length}</span>
            </div>
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "min-h-[400px] space-y-2 rounded-lg border p-2 transition-colors",
                    snapshot.isDraggingOver && "bg-indigo-500/5 border-indigo-500/30"
                  )}
                >
                  {colLeads.map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onLeadClick(lead)}
                          className={cn(
                            "cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md",
                            snapshot.isDragging && "shadow-lg ring-2 ring-indigo-500/30"
                          )}
                        >
                          <p className="font-medium text-sm">
                            {lead.first_name} {lead.last_name}
                          </p>
                          {lead.company && (
                            <p className="text-xs text-muted-foreground">{lead.company}</p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-emerald-600">
                              {formatCurrency(Number(lead.estimated_value))}
                            </span>
                            <span className="text-xs text-muted-foreground">{lead.source}</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
