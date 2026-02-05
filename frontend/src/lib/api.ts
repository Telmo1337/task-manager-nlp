import type { CommandResult } from "../../../shared/command.result";
import type { TaskItem, TaskStatus } from "../types/chat";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Session storage key
const SESSION_KEY = "task-manager-session-id";

// Store session ID for conversation continuity (load from localStorage)
let sessionId: string | null = localStorage.getItem(SESSION_KEY);

export async function sendCommand(input: string): Promise<CommandResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  const res = await fetch(`${API_URL}/execute`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: "COMMAND",
      intent: "RAW_INPUT",
      payload: {
        text: input,
      },
    }),
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  // Store session ID from response for future requests
  const newSessionId = res.headers.get("x-session-id");
  if (newSessionId) {
    sessionId = newSessionId;
    localStorage.setItem(SESSION_KEY, newSessionId);
  }

  return res.json();
}

export function resetSession() {
  sessionId = null;
  localStorage.removeItem(SESSION_KEY);
}

// Calendar API
export async function getCalendarTasks(year: number, month: number): Promise<TaskItem[]> {
  const res = await fetch(`${API_URL}/calendar/${year}/${month}`);
  if (!res.ok) throw new Error("Failed to get calendar tasks");
  const data = await res.json();
  return data.tasks;
}

// Get single task
export async function getTask(id: number): Promise<TaskItem> {
  const res = await fetch(`${API_URL}/tasks/${id}`);
  if (!res.ok) throw new Error("Failed to get task");
  const data = await res.json();
  return data.task;
}

// Update task status
export async function updateTaskStatus(id: number, status: TaskStatus): Promise<TaskItem> {
  const res = await fetch(`${API_URL}/tasks/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update task status");
  const data = await res.json();
  return data.task;
}

// Get history
export async function getTaskHistory(taskId?: number) {
  const url = taskId ? `${API_URL}/history?taskId=${taskId}` : `${API_URL}/history`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to get history");
  const data = await res.json();
  return data.history;
}
