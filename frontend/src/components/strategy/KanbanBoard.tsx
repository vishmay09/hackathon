import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
} from "lucide-react";
import clsx from "clsx";

interface KanbanProps {
  kanban?: any;
  onKanbanChange?: (updatedKanban: Record<string, KanbanTask[]>) => void;
}

export interface KanbanTask {
  id: string;
  title: string;
  assigned_to?: string;
  priority?: string;
}

// Failsafe helper to ensure any value turns into a clean array
function ensureArray(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    return val
      .split(/[\n,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (val && typeof val === "object") {
    return Object.values(val);
  }
  return [];
}

// Normalizes LLM kanban responses into standardized column objects with unique IDs
function normalizeKanbanData(rawKanban: any): Record<string, KanbanTask[]> {
  const defaultCols: Record<string, KanbanTask[]> = {
    "To Do": [],
    "In Progress": [],
    Done: [],
  };

  if (!rawKanban) return defaultCols;

  const parseItemToTask = (item: any, idx: number): KanbanTask => {
    if (item && typeof item === "object") {
      return {
        id: item.id || `task-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title || item.name || item.task || JSON.stringify(item),
        assigned_to: item.assigned_to || item.role || item.assignee,
        priority: item.priority,
      };
    }
    return {
      id: `task-${Math.random().toString(36).substr(2, 9)}-${idx}`,
      title: String(item),
    };
  };

  // Case 1: Array of column objects: [{ title: "To Do", tasks: [...] }, ...]
  if (Array.isArray(rawKanban)) {
    const columns: Record<string, KanbanTask[]> = {};
    rawKanban.forEach((col, idx) => {
      if (col && typeof col === "object") {
        const title = col.title || col.name || col.column || `Column ${idx + 1}`;
        const rawTasks = ensureArray(col.tasks || col.items || col.cards || col.todos || []);
        columns[title] = rawTasks.map((t, i) => parseItemToTask(t, i));
      } else {
        columns[`Column ${idx + 1}`] = [parseItemToTask(col, 0)];
      }
    });
    return Object.keys(columns).length > 0 ? columns : defaultCols;
  }

  // Case 2: Object dictionary: { todo: [...], in_progress: [...], done: [...] }
  if (typeof rawKanban === "object") {
    const columns: Record<string, KanbanTask[]> = {};
    Object.entries(rawKanban).forEach(([key, val]) => {
      const formattedKey = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      columns[formattedKey] = ensureArray(val).map((t, i) => parseItemToTask(t, i));
    });
    return Object.keys(columns).length > 0 ? columns : defaultCols;
  }

  return defaultCols;
}

export default function KanbanBoard({ kanban, onKanbanChange }: KanbanProps) {
  const [columns, setColumns] = useState<Record<string, KanbanTask[]>>(() =>
    normalizeKanbanData(kanban)
  );

  // Sync internal state when external strategy props change
  useEffect(() => {
    setColumns(normalizeKanbanData(kanban));
  }, [kanban]);

  // Drag & Drop State
  const [draggedTask, setDraggedTask] = useState<{
    task: KanbanTask;
    sourceCol: string;
    sourceIndex: number;
  } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // Editing & Adding State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [addingToCol, setAddingToCol] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const updateColumns = (newCols: Record<string, KanbanTask[]>) => {
    setColumns(newCols);
    if (onKanbanChange) onKanbanChange(newCols);
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (
    e: React.DragEvent,
    task: KanbanTask,
    sourceCol: string,
    sourceIndex: number
  ) => {
    setDraggedTask({ task, sourceCol, sourceIndex });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, colTitle: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colTitle) {
      setDragOverCol(colTitle);
    }
  };

  const handleDragLeave = (colTitle: string) => {
    if (dragOverCol === colTitle) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    setDragOverCol(null);

    if (!draggedTask) return;
    const { task, sourceCol, sourceIndex } = draggedTask;

    if (sourceCol === targetCol) return;

    // Remove from source column and append to target column
    const newSourceList = [...columns[sourceCol]];
    newSourceList.splice(sourceIndex, 1);

    const newTargetList = [...(columns[targetCol] || []), task];

    const nextCols = {
      ...columns,
      [sourceCol]: newSourceList,
      [targetCol]: newTargetList,
    };

    updateColumns(nextCols);
    setDraggedTask(null);
  };

  // --- Inline Edit Handlers ---
  const startEditing = (task: KanbanTask) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEditing = (colTitle: string, taskId: string) => {
    if (!editingTitle.trim()) return;

    const nextCols = {
      ...columns,
      [colTitle]: columns[colTitle].map((t) =>
        t.id === taskId ? { ...t, title: editingTitle.trim() } : t
      ),
    };

    updateColumns(nextCols);
    setEditingTaskId(null);
    setEditingTitle("");
  };

  // --- Add Task Handlers ---
  const handleAddTask = (colTitle: string) => {
    if (!newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
    };

    const nextCols = {
      ...columns,
      [colTitle]: [...(columns[colTitle] || []), newTask],
    };

    updateColumns(nextCols);
    setNewTaskTitle("");
    setAddingToCol(null);
  };

  // --- Delete Task Handler ---
  const deleteTask = (colTitle: string, taskId: string) => {
    const nextCols = {
      ...columns,
      [colTitle]: columns[colTitle].filter((t) => t.id !== taskId),
    };
    updateColumns(nextCols);
  };

  const getColumnIcon = (colName: string) => {
    const lower = colName.toLowerCase();
    if (lower.includes("done") || lower.includes("complete"))
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    if (lower.includes("progress") || lower.includes("doing"))
      return <Clock className="w-4 h-4 text-amber-600" />;
    return <ListTodo className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {Object.entries(columns).map(([colTitle, tasks]) => {
        const isDragTarget = dragOverCol === colTitle;

        return (
          <div
            key={colTitle}
            onDragOver={(e) => handleDragOver(e, colTitle)}
            onDragLeave={() => handleDragLeave(colTitle)}
            onDrop={(e) => handleDrop(e, colTitle)}
            className={clsx(
              "bg-slate-50 border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200",
              isDragTarget
                ? "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-md"
                : "border-slate-200/90 hover:border-slate-300"
            )}
          >
            <div>
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  {getColumnIcon(colTitle)}
                  <h4 className="font-bold text-sm text-slate-900">{colTitle}</h4>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-xs">
                  {tasks.length}
                </span>
              </div>

              {/* Task Cards List */}
              <div className="space-y-2.5 min-h-[140px]">
                {tasks.length === 0 ? (
                  <div className="h-28 flex flex-col items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200/80 rounded-xl p-4 text-center">
                    <span>Drop tasks here</span>
                  </div>
                ) : (
                  tasks.map((task, taskIdx) => {
                    const isEditing = editingTaskId === task.id;

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        draggable={!isEditing}
                        onDragStart={(e) =>
                          handleDragStart(e, task, colTitle, taskIdx)
                        }
                        className={clsx(
                          "group p-3.5 bg-white border border-slate-200 rounded-xl text-xs space-y-2 shadow-xs hover:border-indigo-300 transition relative cursor-grab active:cursor-grabbing",
                          draggedTask?.task.id === task.id && "opacity-40 border-indigo-400 border-dashed"
                        )}
                      >
                        {isEditing ? (
                          /* Inline Edit Form */
                          <div className="space-y-2">
                            <textarea
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="w-full text-xs p-2 bg-slate-50 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 resize-none font-medium"
                              rows={2}
                              autoFocus
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditingTaskId(null)}
                                className="p-1 text-slate-500 hover:bg-slate-100 rounded-md"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => saveEditing(colTitle, task.id)}
                                className="p-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Display Mode */
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <GripVertical className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                                <span
                                  onClick={() => startEditing(task)}
                                  className="font-semibold text-slate-800 leading-relaxed hover:text-indigo-600 cursor-pointer transition"
                                  title="Click to edit task"
                                >
                                  {task.title}
                                </span>
                              </div>

                              <button
                                onClick={() => deleteTask(colTitle, task.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition p-1 hover:bg-red-50 rounded"
                                title="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {(task.assigned_to || task.priority) && (
                              <div className="flex items-center justify-between text-[10px] pt-2 mt-1.5 text-slate-500 border-t border-slate-100">
                                {task.assigned_to && (
                                  <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
                                    {task.assigned_to}
                                  </span>
                                )}
                                {task.priority && (
                                  <span className="text-amber-600 font-bold ml-auto">
                                    {task.priority}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Column Footer: Add Task Button */}
            <div className="mt-3 pt-2">
              {addingToCol === colTitle ? (
                <div className="space-y-2 p-2.5 bg-white border border-indigo-200 rounded-xl shadow-xs">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTask(colTitle);
                      if (e.key === "Escape") setAddingToCol(null);
                    }}
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setAddingToCol(null)}
                      className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-md font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddTask(colTitle)}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-md hover:bg-indigo-700 shadow-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAddingToCol(colTitle);
                    setNewTaskTitle("");
                  }}
                  className="w-full py-2 border border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-500 hover:text-indigo-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}