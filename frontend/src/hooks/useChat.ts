import { useState, useCallback, useEffect } from "react";
import { sendCommand, resetSession } from "../lib/api";
import type { ChatMessage, TaskItem } from "../types/chat";

// Storage key for persisting messages
const MESSAGES_KEY = "task-manager-messages";

// Load messages from localStorage
function loadMessages(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load messages:", e);
  }
  return [];
}

// Save messages to localStorage
function saveMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save messages:", e);
  }
}

export interface UseChatReturn {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  
  // Actions
  handleCommand: (input: string) => Promise<void>;
  clearChat: () => void;
  updateTaskInMessages: (updatedTask: TaskItem) => void;
}

// Helper to format response messages
function formatTaskMessage(task: { title: string; dueAt: string; priority?: string; recurrence?: string }): string {
  const date = new Date(task.dueAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const priorityIcon = task.priority === "urgent" ? "[!]" :
                        task.priority === "high" ? "[!!]" :
                        task.priority === "low" ? "[-]" : "";
  const recurrenceText = task.recurrence ? ` (repeats: ${task.recurrence})` : "";
  return `${priorityIcon} "${task.title}" scheduled for ${date}${recurrenceText}`;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(MESSAGES_KEY);
    resetSession();
  }, []);

  const updateTaskInMessages = useCallback((updatedTask: TaskItem) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.tasks) {
          return {
            ...msg,
            tasks: msg.tasks.map((t) =>
              t.id === updatedTask.id ? updatedTask : t
            ),
          };
        }
        return msg;
      })
    );
  }, []);

  // Helper to add a natural delay before responding
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Random delay between min and max ms for more natural feel
  const naturalDelay = () => delay(600 + Math.random() * 600); // 600-1200ms

  const handleCommand = useCallback(async (input: string) => {
    // Add user message
    addMessage({ role: "user", content: input });
    setIsLoading(true);

    try {
      const res = await sendCommand(input);
      
      // Add natural delay before showing response
      await naturalDelay();

      if (res.status === "QUESTION") {
        addMessage({ role: "system", content: res.message! });
      }

      if (res.status === "SUCCESS") {
        const data = res.data as unknown;

        // List tasks response
        if (Array.isArray(data) && data.length > 0 && "title" in data[0]) {
          addMessage({
            role: "system",
            content: `Found ${data.length} task(s):`,
            tasks: data as TaskItem[],
          });
        }
        // Empty list
        else if (Array.isArray(data) && data.length === 0) {
          addMessage({ role: "system", content: "No tasks found." });
        }
        // Single task created/edited
        else if (data && typeof data === "object" && "title" in data) {
          const task = data as { title: string; dueAt: string; priority?: string; recurrence?: string };
          addMessage({ role: "system", content: formatTaskMessage(task) });
        }
        // Delete all tasks
        else if (data && typeof data === "object" && "deleted" in data && "count" in data) {
          const deleteData = data as { deleted: boolean; count: number; message: string };
          addMessage({ role: "system", content: deleteData.message });
        }
        // Delete single task
        else if (data && typeof data === "object" && "deleted" in data) {
          addMessage({ role: "system", content: "Task deleted." });
        }
        // Undo action
        else if (data && typeof data === "object" && "undone" in data) {
          const undoData = data as { undone: boolean; message: string };
          addMessage({ role: "system", content: undoData.message });
        }
        // Info/feedback message from the system
        else if (data && typeof data === "object" && "message" in data) {
          const infoData = data as { message: string };
          addMessage({ role: "system", content: infoData.message });
        }
        // Default success
        else {
          addMessage({ role: "system", content: "Done." });
        }
      }

      if (res.status === "ERROR") {
        addMessage({ role: "system", content: `Error: ${res.error?.message}` });
      }
    } catch (err) {
      console.error("Command failed:", err);
      addMessage({ role: "system", content: "Connection error" });
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  return {
    messages,
    isLoading,
    handleCommand,
    clearChat,
    updateTaskInMessages,
  };
}
