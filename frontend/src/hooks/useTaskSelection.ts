import { useState, useCallback } from "react";
import type { TaskItem } from "../types/chat";

export interface UseTaskSelectionReturn {
  selectedTask: TaskItem | null;
  selectTask: (task: TaskItem) => void;
  clearSelection: () => void;
  updateSelectedTask: (task: TaskItem) => void;
}

export function useTaskSelection(): UseTaskSelectionReturn {
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const selectTask = useCallback((task: TaskItem) => {
    setSelectedTask(task);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTask(null);
  }, []);

  const updateSelectedTask = useCallback((task: TaskItem) => {
    setSelectedTask(task);
  }, []);

  return {
    selectedTask,
    selectTask,
    clearSelection,
    updateSelectedTask,
  };
}
