import { useEffect, useRef } from "react"
import { AlertCircle, ChevronRight, Circle, CircleAlert, Repeat } from "lucide-react"
import type { ChatMessage, TaskItem } from "@/types/chat"

// ============================================================================
// Types
// ============================================================================

interface ChatHistoryProps {
  messages: ChatMessage[]
  onTaskClick?: (task: TaskItem) => void
  isLoading?: boolean
}

interface TaskListItemProps {
  task: TaskItem
  onTaskClick?: (task: TaskItem) => void
}

interface MessageBubbleProps {
  message: ChatMessage
  onTaskClick?: (task: TaskItem) => void
}

// ============================================================================
// Typing Indicator Component
// ============================================================================

function TypingIndicator() {
  return (
    <div className="max-w-[80%] bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-lg mr-auto">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getPriorityIcon(priority?: string): React.ReactNode {
  switch (priority) {
    case "urgent": return <AlertCircle className="w-3.5 h-3.5 text-red-500" />
    case "high": return <CircleAlert className="w-3.5 h-3.5 text-orange-500" />
    case "low": return <Circle className="w-3.5 h-3.5 text-neutral-400" />
    default: return null
  }
}

function getStatusColor(status?: string): string {
  switch (status) {
    case "completed": return "bg-green-500"
    case "in_progress": return "bg-blue-500"
    case "cancelled": return "bg-red-500"
    default: return "bg-amber-500"
  }
}

function getMessageClasses(role: string): string {
  if (role === "user") {
    return "max-w-[80%] bg-neutral-800 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg ml-auto"
  }
  return "max-w-[80%] bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2 rounded-lg mr-auto"
}

function getTitleClasses(status?: string): string {
  const base = "flex-1 font-medium text-neutral-900 dark:text-neutral-100"
  if (status === "completed") return `${base} line-through text-neutral-500 dark:text-neutral-400`
  if (status === "cancelled") return `${base} line-through text-red-400 dark:text-red-500`
  return base
}

// ============================================================================
// Sub-Components
// ============================================================================

function StatusIndicator({ status }: { status?: string }) {
  return (
    <span
      className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(status)}`}
      title={status || "pending"}
    />
  )
}

function ChevronIcon() {
  return <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
}

function TaskListItem({ task, onTaskClick }: TaskListItemProps) {
  const isClickable = Boolean(onTaskClick)

  return (
    <li
      onClick={() => onTaskClick?.(task)}
      className={`
        flex items-center gap-2 text-sm
        bg-white dark:bg-neutral-700 rounded px-2 py-1.5
        border dark:border-neutral-600
        ${isClickable ? "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors" : ""}
      `}
    >
      <StatusIndicator status={task.status} />
      
      <span className="text-neutral-400 dark:text-neutral-500 text-xs">#{task.id}</span>
      
      {task.priority && task.priority !== "normal" && (
        <span title={task.priority}>{getPriorityIcon(task.priority)}</span>
      )}
      
      <span className={getTitleClasses(task.status)}>{task.title}</span>
      
      {task.recurrence && (
        <span className="text-blue-500 dark:text-blue-400" title={`Recurs: ${task.recurrence}`}>
          <Repeat className="w-3 h-3" />
        </span>
      )}
      
      <span className="text-neutral-500 dark:text-neutral-400 text-xs">
        {formatDate(task.dueAt)}
      </span>
      
      {isClickable && <ChevronIcon />}
    </li>
  )
}

function TaskList({ tasks, onTaskClick }: { tasks: TaskItem[]; onTaskClick?: (task: TaskItem) => void }) {
  return (
    <ul className="mt-2 space-y-1">
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} onTaskClick={onTaskClick} />
      ))}
    </ul>
  )
}

// Simple markdown-like formatting for messages
function formatMessageContent(content: string): React.ReactNode {
  // Split by newlines and process each line
  const lines = content.split('\n');
  
  return lines.map((line, i) => {
    // Bold text: **text**
    let formattedLine: React.ReactNode = line;
    
    if (line.includes('**')) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      formattedLine = parts.map((part, j) => 
        j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
      );
    }
    
    // Bullet points
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return (
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-neutral-400">•</span>
          <span className="text-neutral-600 dark:text-neutral-300">{typeof formattedLine === 'string' ? formattedLine.slice(2) : formattedLine}</span>
        </div>
      );
    }
    
    // Headers (lines ending with :)
    if (line.endsWith(':') && line.length < 50 && !line.startsWith('•')) {
      return <div key={i} className="font-medium mt-2 first:mt-0">{formattedLine}</div>;
    }
    
    // Regular lines
    return <div key={i}>{formattedLine || <br />}</div>;
  });
}

function MessageBubble({ message, onTaskClick }: MessageBubbleProps) {
  const isSystemMessage = message.role === "system";
  const hasFormatting = isSystemMessage && (
    message.content.includes('\n') || 
    message.content.includes('**') ||
    message.content.includes('• ')
  );
  
  return (
    <div className={getMessageClasses(message.role)}>
      {hasFormatting ? (
        <div className="text-sm space-y-0.5">{formatMessageContent(message.content)}</div>
      ) : (
        message.content
      )}
      {message.tasks && message.tasks.length > 0 && (
        <TaskList tasks={message.tasks} onTaskClick={onTaskClick} />
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function ChatHistory({ messages, onTaskClick, isLoading }: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} onTaskClick={onTaskClick} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
