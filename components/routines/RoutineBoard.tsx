"use client";

import { useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, CheckCircle2, Circle, Clock, X, Trash2, Pencil, Save, BanIcon } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { api } from "@/lib/api/client";
import type { Routine, DayName } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DAY_MAP: Record<number, DayName> = {
  0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday"
};

const DAY_REVERSE_MAP: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6
};

const DAYS: { value: DayName; label: string }[] = [
  { value: "monday", label: "Monday" }, { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" }, { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" }, { value: "saturday", label: "Saturday" }, { value: "sunday", label: "Sunday" },
];

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

export function RoutineBoard() {
  const queryClient = useQueryClient();
  const calendarRef = useRef<any>(null);
  const [viewReady, setViewReady] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const closeModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setSelectedRoutine(null);
      setIsExiting(false);
      setIsEditing(false);
    }, 200);
  };
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [newActivityName, setNewActivityName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDayName, setNewDayName] = useState<DayName>("monday");
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("10:00");

  const { data: routines, isLoading } = useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: async () => {
      const { data } = await api.get("/api/routines/");
      return data;
    },
  });

  const createRoutineMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/api/routines/", {
        activity_name: newActivityName,
        activity_description: newDescription,
        day_name: newDayName,
        start_time: newStartTime + ":00",
        end_time: newEndTime + ":00",
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      setIsAddModalOpen(false);
      resetAddForm();
    },
    onError: (error: any) => {
      setDragError(error?.response?.data?.non_field_errors?.[0] || "Failed to create routine");
      setTimeout(() => setDragError(null), 4000);
    },
  });

  const updateRoutineMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data } = await api.patch(`/api/routines/${id}/`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
    onError: (error: any) => {
      setDragError(error?.response?.data?.non_field_errors?.[0] || "Failed to update routine");
      setTimeout(() => setDragError(null), 4000);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "done" | "not_done" }) => {
      const { data } = await api.patch(`/api/routines/${id}/`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      if (selectedRoutine) {
        setSelectedRoutine(prev => prev ? { ...prev, status: prev.status === 'done' ? 'not_done' : 'done' } : null);
      }
    },
  });

  const deleteRoutineMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/routines/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      setSelectedRoutine(null);
    },
  });

  const resetAddForm = () => {
    setNewActivityName(""); setNewDescription(""); setNewDayName("monday");
    setNewStartTime("09:00"); setNewEndTime("10:00");
  };

  const startEditing = () => {
    if (selectedRoutine) {
      setEditName(selectedRoutine.activity_name);
      setEditDescription(selectedRoutine.activity_description || "");
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditName("");
    setEditDescription("");
  };

  const saveEditing = () => {
    if (selectedRoutine && editName.trim()) {
      updateRoutineMutation.mutate({
        id: selectedRoutine.id,
        updates: { activity_name: editName, activity_description: editDescription }
      }, {
        onSuccess: () => {
          setSelectedRoutine(prev => prev ? { ...prev, activity_name: editName, activity_description: editDescription } : null);
          setIsEditing(false);
        }
      });
    }
  };

  const events = useMemo(() => {
    if (!routines) return [];
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    return routines.map(r => {
      const targetDay = DAY_REVERSE_MAP[r.day_name.toLowerCase()];
      const diff = targetDay - dayOfWeek;
      const eventDate = new Date(now);
      eventDate.setDate(now.getDate() + diff);
      const dateStr = eventDate.toISOString().split('T')[0];

      return {
        id: r.id,
        title: r.activity_name,
        start: `${dateStr}T${r.start_time}`,
        end: `${dateStr}T${r.end_time}`,
        extendedProps: { ...r },
      };
    });
  }, [routines]);

  const handleEventDrop = (info: any) => {
    const routine = info.event.extendedProps as Routine;
    const newStart = info.event.start;
    const newEnd = info.event.end;
    const newDayIndex = newStart.getDay();
    const newDayName = DAY_MAP[newDayIndex];

    const formatTime = (date: Date) => {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`;
    };

    updateRoutineMutation.mutate({
      id: routine.id,
      updates: { day_name: newDayName, start_time: formatTime(newStart), end_time: formatTime(newEnd) }
    }, { onError: () => info.revert() });
  };

  const handleEventResize = (info: any) => {
    const routine = info.event.extendedProps as Routine;
    const newStart = info.event.start;
    const newEnd = info.event.end;

    const formatTime = (date: Date) => {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`;
    };

    updateRoutineMutation.mutate({
      id: routine.id,
      updates: { start_time: formatTime(newStart), end_time: formatTime(newEnd) }
    }, { onError: () => info.revert() });
  };

  const handleEventClick = (info: any) => {
    setSelectedRoutine(info.event.extendedProps as Routine);
    setIsEditing(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityName.trim()) return;
    createRoutineMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Routines</h1>
          <p className="text-sm text-muted-foreground">Schedule your routines, powered by you and AI Coach!</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon className="h-4 w-4" /> Add Routine
        </Button>
      </div>

      {dragError && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg shadow-lg animate-in fade-in">
          {dragError}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left: "", center: "title", right: "" }}
          events={events}
          allDaySlot={false}
          slotMinTime="05:00:00"
          slotMaxTime="23:00:00"
          snapDuration="00:15"
          height="auto"
          nowIndicator={true}
          dayHeaderFormat={{ weekday: 'long' }}
          slotLabelFormat={{ hour: 'numeric', minute: '2-digit', omitZeroMinute: true, meridiem: 'short' }}
          editable={true}
          droppable={false}
          eventResizableFromStart={true}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventClick={handleEventClick}
          eventOverlap={false}
          
          eventContent={(arg) => {
            const routine = arg.event.extendedProps as Routine;
            const isDone = routine.status === 'done';
            const formatTimeWithAmPm = (timeStr: string) => {
              const [hours, minutes] = timeStr.split(':');
              const h = parseInt(hours, 10);
              const ampm = h >= 12 ? 'PM' : 'AM';
              const hour = h % 12 || 12;
              return `${hour}:${minutes} ${ampm}`;
            };
            const startTime = arg.event.start ? formatTimeWithAmPm(arg.event.start.toTimeString().slice(0, 5)) : '';
            const endTime = arg.event.end ? formatTimeWithAmPm(arg.event.end.toTimeString().slice(0, 5)) : '';
            const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : arg.timeText;
            
            return (
              <div className={cn(
                "flex flex-col items-center justify-center h-full w-full py-1 px-1.5 rounded text-[11px] font-medium cursor-grab active:cursor-grabbing text-center",
                isDone ? "bg-muted text-muted-foreground line-through decoration-1" : "bg-primary text-primary-foreground"
              )}>
                <span className="truncate">{arg.event.title}</span>
                <span className={cn("text-[9px] opacity-70", isDone && "opacity-50")}>{timeRange}</span>
              </div>
            );
          }}
          
          datesSet={(info) => {
            const now = new Date();
            const currentWeekStart = new Date(now);
            currentWeekStart.setDate(now.getDate() - now.getDay());
            currentWeekStart.setHours(0, 0, 0, 0);
            const viewStart = new Date(info.view.activeStart);
            const diffDays = Math.abs((viewStart.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 1) calendarRef.current?.getApi()?.gotoDate(currentWeekStart);
            setViewReady(true);
          }}
        />
      </div>

      <div className="flex gap-4 text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary" /><span>Not done yet</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-muted" /><span>Done</span></div>
      </div>

      {/* Details Modal */}
      {selectedRoutine && (
        <div className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
          isExiting ? "animate-out fade-out duration-200" : "animate-in fade-in duration-200"
        )}>
          <div className={cn(
            "w-full max-w-md bg-card rounded-xl border border-border shadow-2xl",
            isExiting ? "animate-out zoom-out-95 duration-200" : "animate-in zoom-in-95 duration-200"
          )}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">Routine Details</h2>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Activity Name</label>
                  {!isEditing && (
                    <button onClick={startEditing} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-lg font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-xl font-bold text-foreground">{selectedRoutine.activity_name}</h3>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  {!isEditing && (
                    <button onClick={startEditing} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Add a description..."
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-muted/50 min-h-[60px]">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {selectedRoutine.activity_description || <span className="text-muted-foreground italic">No description</span>}
                    </p>
                  </div>
                )}
              </div>

              {/* Read-only fields */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(selectedRoutine.start_time)} - {formatTime(selectedRoutine.end_time)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <span className={cn("text-sm font-semibold px-2 py-0.5 rounded-full", selectedRoutine.status === 'done' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400")}>
                    {selectedRoutine.status === 'done' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 p-4 border-t bg-muted/20">
              {isEditing ? (
                <>
                  <Button variant="outline" className="flex-1 gap-2" onClick={cancelEditing}>
                    <BanIcon className="h-4 w-4" /> Cancel
                  </Button>
                  <Button className="flex-1 gap-2" onClick={saveEditing} disabled={updateRoutineMutation.isPending || !editName.trim()}>
                    <Save className="h-4 w-4" /> Save
                  </Button>
                </>
              ) : (
                <>
                  <Button variant={selectedRoutine.status === 'done' ? "outline" : "default"} className="flex-1 gap-2"
                    onClick={() => toggleStatusMutation.mutate({ id: selectedRoutine.id, status: selectedRoutine.status === 'done' ? 'not_done' : 'done' })}>
                    {selectedRoutine.status === 'done' ? <><Circle className="h-4 w-4" /> Mark Incomplete</> : <><CheckCircle2 className="h-4 w-4" /> Mark Complete</>}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteRoutineMutation.mutate(selectedRoutine.id)} disabled={deleteRoutineMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">Add New Routine</h2>
              <button onClick={() => { setIsAddModalOpen(false); resetAddForm(); }} className="p-1 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Activity Name</label>
                <input type="text" value={newActivityName} onChange={(e) => setNewActivityName(e.target.value)} placeholder="e.g., Morning Run"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Day</label>
                <select value={newDayName} onChange={(e) => setNewDayName(e.target.value as DayName)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm">
                  {DAYS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Start Time</label><input type="time" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" required /></div>
                <div className="space-y-2"><label className="text-sm font-medium">End Time</label><input type="time" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" required /></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsAddModalOpen(false); resetAddForm(); }}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={createRoutineMutation.isPending || !newActivityName.trim()}>
                  {createRoutineMutation.isPending ? "Adding..." : "Add Routine"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .fc { --fc-border-color: var(--border); --fc-page-bg-color: var(--card); --fc-today-bg-color: var(--accent); --fc-neutral-bg-color: var(--muted); --fc-now-indicator-color: var(--primary); font-family: inherit; font-size: 13px; }
        .fc .fc-toolbar { padding: 12px 16px; gap: 12px; border-bottom: 1px solid var(--border); }
        .fc .fc-toolbar-title { font-size: 16px; font-weight: 600; color: var(--foreground); }
        .fc .fc-button { background: var(--secondary); border-color: var(--border); color: var(--foreground); font-size: 12px; padding: 4px 12px; border-radius: 6px; }
        .fc .fc-button:hover { background: var(--muted); }
        .fc-theme-standard td, .fc-theme-standard th { border-color: var(--border); }
        .fc .fc-col-header-cell { 
          padding: 16px 0; 
          background: var(--muted); 
          text-align: center;
        }
        .fc .fc-day-today .fc-col-header-cell {
          background: var(--muted);
        }
        .fc .fc-col-header-cell-cushion { 
          font-size: 14px; 
          font-weight: 700; 
          text-transform: capitalize;
          color: var(--foreground); 
          text-decoration: none !important;
          display: block;
          width: 100%;
        }
        .fc .fc-col-header-cell .fc-col-header-top { 
          display: none; 
        }
        .fc .fc-timegrid-slot { height: 48px; border-bottom: 1px solid var(--border) !important; }
        .fc .fc-timegrid-slot-label-cushion { font-size: 10px; font-weight: 500; color: var(--muted-foreground); }
        .fc .fc-day-today .fc-col-header-cell-cushion { color: var(--primary); font-weight: 700; }
        .fc .fc-day-today { background: var(--accent) !important; }
        .fc-v-event { background: transparent !important; border: none !important; }
        .fc-timegrid-event { border-radius: 4px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .fc-event { cursor: grab !important; }
        .fc-event:active { cursor: grabbing !important; }
        .fc-event-resizer { display: block !important; width: 100% !important; height: 6px !important; bottom: -3px !important; cursor: ns-resize !important; }
        .fc-event-resizer-top { display: block !important; width: 100% !important; height: 6px !important; top: -3px !important; cursor: ns-resize !important; }
      `}</style>
    </div>
  );
}
