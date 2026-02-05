import { useTaskDetail } from "../../hooks";
import { X, Clock, Loader2, Check, XCircle, Calendar, RefreshCw, AlertCircle, CircleAlert, Circle, FileText, ClipboardList } from "lucide-react";
import type { TaskItem, TaskStatus } from "../../types/chat";

// ============================================================================
// Types
// ============================================================================

interface TaskDetailProps {
  task: TaskItem | null;
  onClose: () => void;
  onStatusChange?: (task: TaskItem) => void;
  hideHeader?: boolean;
}

// ============================================================================
// Helper Components
// ============================================================================

function EmptyState() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-neutral-400 dark:text-neutral-500">
        <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-40" strokeWidth={1.5} />
        <p className="text-xs">Select a task</p>
      </div>
    </div>
  );
}

interface HeaderProps {
  onClose: () => void;
}

function Header({ onClose }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
      <h2 className="text-sm font-medium dark:text-white">Task Details</h2>
      <button
        onClick={onClose}
        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

interface StatusButtonsProps {
  currentStatus?: TaskStatus;
  statusOptions: { value: TaskStatus; label: string; color: string; icon: string }[];
  updating: boolean;
  onStatusChange: (status: TaskStatus) => void;
}

function getStatusIcon(iconName: string) {
  switch (iconName) {
    case "clock": return <Clock className="w-3.5 h-3.5" />;
    case "loader": return <Loader2 className="w-3.5 h-3.5" />;
    case "check": return <Check className="w-3.5 h-3.5" />;
    case "x": return <XCircle className="w-3.5 h-3.5" />;
    default: return null;
  }
}

function StatusButtons({ currentStatus, statusOptions, updating, onStatusChange }: StatusButtonsProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
        Status
      </label>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            disabled={updating}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              transition-all duration-200
              ${currentStatus === option.value
                ? `bg-${option.color}-500 text-white ring-2 ring-${option.color}-300`
                : `bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700`
              }
              ${updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {getStatusIcon(option.icon)}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface DueDateDisplayProps {
  dueDate: Date;
  isOverdue: boolean;
}

function DueDateDisplay({ dueDate, isOverdue }: DueDateDisplayProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
        Due Date
      </label>
      <div className={`flex items-center gap-2 ${isOverdue ? "text-red-500" : "dark:text-white"}`}>
        <Calendar className="w-4 h-4" />
        <span className="text-sm">
          {dueDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        {isOverdue && (
          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
            Overdue
          </span>
        )}
      </div>
      <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 ml-6">
        {dueDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

interface PriorityBadgeProps {
  priority?: string;
  priorityStyle: { bg: string; text: string };
  priorityIcon: string;
}

function getPriorityIcon(iconName: string) {
  switch (iconName) {
    case "alert-circle": return <AlertCircle className="w-3.5 h-3.5" />;
    case "circle-alert": return <CircleAlert className="w-3.5 h-3.5" />;
    case "circle": return <Circle className="w-3.5 h-3.5" />;
    default: return null;
  }
}

function PriorityBadge({ priority, priorityStyle, priorityIcon }: PriorityBadgeProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
        Priority
      </label>
      <span className={`
        inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium capitalize
        ${priorityStyle.bg}
        ${priorityStyle.text}
      `}>
        {getPriorityIcon(priorityIcon)}
        {priority || "normal"}
      </span>
    </div>
  );
}

interface RecurrenceDisplayProps {
  recurrence: string;
}

function RecurrenceDisplay({ recurrence }: RecurrenceDisplayProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
        Recurrence
      </label>
      <div className="flex items-center gap-2 text-sm dark:text-white">
        <RefreshCw className="w-4 h-4" />
        <span className="capitalize">{recurrence}</span>
      </div>
    </div>
  );
}

interface DescriptionDisplayProps {
  description: string;
}

function DescriptionDisplay({ description }: DescriptionDisplayProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
        <FileText className="w-3.5 h-3.5" />
        Description
      </label>
      <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2">
        {description}
      </p>
    </div>
  );
}

interface TimestampDisplayProps {
  label: string;
  date: string;
  className?: string;
}

function TimestampDisplay({ label, date, className = "" }: TimestampDisplayProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
        {label}
      </label>
      <div className={`text-sm ${className}`}>
        {new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TaskDetail({ task, onClose, onStatusChange, hideHeader }: TaskDetailProps) {
  const {
    updating,
    dueDate,
    isOverdue,
    priorityStyle,
    priorityIcon,
    handleStatusChange,
    statusOptions,
  } = useTaskDetail({ task, onStatusChange });

  if (!task) {
    return <EmptyState />;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {!hideHeader && <Header onClose={onClose} />}

      <div className="flex-1 overflow-auto p-3 space-y-3 scrollbar-thin">
        {/* Task ID */}
        <div className="text-xs text-neutral-400 dark:text-neutral-500">
          #{task.id}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold dark:text-white capitalize">
            {task.title}
          </h3>
        </div>

        {/* Status */}
        <StatusButtons
          currentStatus={task.status}
          statusOptions={statusOptions}
          updating={updating}
          onStatusChange={handleStatusChange}
        />

        {/* Due Date */}
        {dueDate && (
          <DueDateDisplay dueDate={dueDate} isOverdue={isOverdue} />
        )}

        {/* Priority */}
        <PriorityBadge
          priority={task.priority}
          priorityStyle={priorityStyle}
          priorityIcon={priorityIcon}
        />

        {/* Recurrence */}
        {task.recurrence && (
          <RecurrenceDisplay recurrence={task.recurrence} />
        )}

        {/* Description */}
        {task.description && (
          <DescriptionDisplay description={task.description} />
        )}

        {/* Completed At */}
        {task.completedAt && (
          <TimestampDisplay
            label="Completed"
            date={task.completedAt}
            className="text-green-600 dark:text-green-400"
          />
        )}

        {/* Created At */}
        {task.createdAt && (
          <TimestampDisplay
            label="Created"
            date={task.createdAt}
            className="text-neutral-500 dark:text-neutral-400"
          />
        )}
      </div>
    </div>
  );
}
