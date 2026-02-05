// Store the last actions for each session to support undo
export interface UndoableAction {
  type: "CREATE_TASK" | "DELETE_TASK" | "EDIT_TASK";
  taskId?: number;
  data?: {
    title?: string;
    dueAt?: string;
    priority?: string;
    recurrence?: string | null;
  };
  previousData?: {
    title?: string;
    dueAt?: string;
    priority?: string;
    recurrence?: string | null;
  };
  timestamp?: Date;
}

// In-memory store for undo actions per session
const undoStack = new Map<string, UndoableAction[]>();

const MAX_UNDO_HISTORY = 10;

export class UndoService {
  recordAction(sessionId: string, action: UndoableAction) {
    const stack = undoStack.get(sessionId) || [];
    stack.push({ ...action, timestamp: new Date() });
    
    // Keep only last N actions
    if (stack.length > MAX_UNDO_HISTORY) {
      stack.shift();
    }
    
    undoStack.set(sessionId, stack);
  }

  getLastAction(sessionId: string): UndoableAction | null {
    const stack = undoStack.get(sessionId);
    if (!stack || stack.length === 0) return null;
    return stack[stack.length - 1];
  }

  popLastAction(sessionId: string): UndoableAction | null {
    const stack = undoStack.get(sessionId);
    if (!stack || stack.length === 0) return null;
    return stack.pop() || null;
  }

  clearUndoHistory(sessionId: string) {
    undoStack.delete(sessionId);
  }
}
