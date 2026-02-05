import { useState, useCallback, useMemo } from "react";
import { updateTaskStatus } from "../lib/api";
import type { TaskItem, TaskStatus } from "../types/chat";

export interface StatusOption {
  value: TaskStatus;
  label: string;
  color: string;
  icon: string;
}

export interface PriorityStyle {
  bg: string;
  text: string;
}

export interface UseTaskDetailOptions {
  task: TaskItem | null;
  onStatusChange?: (task: TaskItem) => void;
}

export interface UseTaskDetailReturn {
  // State
  updating: boolean;
  
  // Computed
  dueDate: Date | null;
  isOverdue: boolean;
  priorityStyle: PriorityStyle;
  
  // Actions
  handleStatusChange: (newStatus: TaskStatus) => Promise<void>;
  
  // Constants
  statusOptions: StatusOption[];
  priorityIcon: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: "pending", label: "Pending", color: "amber", icon: "clock" },
  { value: "in_progress", label: "In Progress", color: "blue", icon: "loader" },
  { value: "completed", label: "Completed", color: "green", icon: "check" },
  { value: "cancelled", label: "Cancelled", color: "red", icon: "x" },
];

const PRIORITY_STYLES: Record<string, PriorityStyle> = {
  urgent: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
  high: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  normal: { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-700 dark:text-neutral-300" },
  low: { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-500 dark:text-neutral-400" },
};

const PRIORITY_ICONS: Record<string, string> = {
  urgent: "alert-circle",
  high: "circle-alert",
  low: "circle",
  normal: "",
};

export function useTaskDetail({ task, onStatusChange }: UseTaskDetailOptions): UseTaskDetailReturn {
  const [updating, setUpdating] = useState(false);

  const dueDate = useMemo(() => {
    return task ? new Date(task.dueAt) : null;
  }, [task]);

  const isOverdue = useMemo(() => {
    if (!task || !dueDate) return false;
    return (
      task.status !== "completed" &&
      task.status !== "cancelled" &&
      dueDate < new Date()
    );
  }, [task, dueDate]);

  const priorityStyle = useMemo(() => {
    const priority = task?.priority || "normal";
    return PRIORITY_STYLES[priority] || PRIORITY_STYLES.normal;
  }, [task?.priority]);

  const priorityIcon = useMemo(() => {
    const priority = task?.priority || "normal";
    return PRIORITY_ICONS[priority] || "";
  }, [task?.priority]);

  const handleStatusChange = useCallback(async (newStatus: TaskStatus) => {
    if (!task || updating || task.status === newStatus) return;

    setUpdating(true);
    try {
      const updated = await updateTaskStatus(task.id, newStatus);
      onStatusChange?.(updated);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  }, [task, updating, onStatusChange]);

  return {
    updating,
    dueDate,
    isOverdue,
    priorityStyle,
    handleStatusChange,
    statusOptions: STATUS_OPTIONS,
    priorityIcon,
  };
}
