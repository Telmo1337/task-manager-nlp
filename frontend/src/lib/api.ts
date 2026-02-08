import type { CommandResult } from "../../../shared/command.result";
import type { TaskItem, TaskStatus } from "../types/chat";
import { getAccessToken, refreshAccessToken, removeTokens } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Session storage key
const SESSION_KEY = "task-manager-session-id";

// Store session ID for conversation continuity (load from localStorage)
let sessionId: string | null = localStorage.getItem(SESSION_KEY);

// Helper to get auth headers
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }
  
  return headers;
}

// Wrapper for fetch with auto token refresh
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = { ...getAuthHeaders(), ...(options.headers as Record<string, string> || {}) };
  
  let res = await fetch(url, { ...options, headers });
  
  // If unauthorized, try to refresh token and retry
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newHeaders = { ...getAuthHeaders(), ...(options.headers as Record<string, string> || {}) };
      res = await fetch(url, { ...options, headers: newHeaders });
    } else {
      // Refresh failed, clear tokens
      removeTokens();
      throw new Error("Session expired. Please login again.");
    }
  }
  
  return res;
}

export async function sendCommand(input: string): Promise<CommandResult> {
  const res = await fetchWithAuth(`${API_URL}/execute`, {
    method: "POST",
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
  const res = await fetchWithAuth(`${API_URL}/calendar/${year}/${month}`);
  if (!res.ok) throw new Error("Failed to get calendar tasks");
  const data = await res.json();
  return data.tasks;
}

// Get single task
export async function getTask(id: number): Promise<TaskItem> {
  const res = await fetchWithAuth(`${API_URL}/tasks/${id}`);
  if (!res.ok) throw new Error("Failed to get task");
  const data = await res.json();
  return data.task;
}

// Update task status
export async function updateTaskStatus(id: number, status: TaskStatus): Promise<TaskItem> {
  const res = await fetchWithAuth(`${API_URL}/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update task status");
  const data = await res.json();
  return data.task;
}

// Get history
export async function getTaskHistory(taskId?: number) {
  const url = taskId ? `${API_URL}/history?taskId=${taskId}` : `${API_URL}/history`;
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error("Failed to get history");
  const data = await res.json();
  return data.history;
}
