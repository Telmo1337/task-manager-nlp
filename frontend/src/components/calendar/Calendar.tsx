import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useCalendar, type CalendarDay } from "../../hooks";
import type { TaskItem } from "../../types/chat";

// ============================================================================
// Types
// ============================================================================

interface CalendarProps {
  onSelectTask: (task: TaskItem) => void;
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

// ============================================================================
// Constants
// ============================================================================

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ============================================================================
// Helper Components
// ============================================================================

function getStatusColor(status?: string): string {
  switch (status) {
    case "completed": return "bg-green-500";
    case "in_progress": return "bg-blue-500";
    case "cancelled": return "bg-red-500";
    default: return "bg-amber-500";
  }
}

interface CalendarHeaderProps {
  monthName: string;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

function CalendarHeader({ monthName, year, onPrevMonth, onNextMonth, onToday }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
      <button
        onClick={onPrevMonth}
        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold dark:text-white">
          {monthName} {year}
        </h2>
        <button
          onClick={onToday}
          className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Today
        </button>
      </div>
      <button
        onClick={onNextMonth}
        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded"
        aria-label="Next month"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function WeekdayHeader() {
  return (
    <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          className="text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 py-1"
        >
          {day}
        </div>
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
    </div>
  );
}

interface TaskBadgeProps {
  task: TaskItem;
  onClick: (task: TaskItem) => void;
}

function TaskBadge({ task, onClick }: TaskBadgeProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(task);
      }}
      className={`
        text-xs truncate px-1 py-0.5 rounded cursor-pointer
        ${getStatusColor(task.status)} bg-opacity-20 
        hover:bg-opacity-40 transition-colors
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1 ${getStatusColor(task.status)}`} />
      {task.title}
    </div>
  );
}

interface CalendarDayCellProps {
  calendarDay: CalendarDay;
  year: number;
  month: number;
  onSelectDate?: (date: Date) => void;
  onSelectTask: (task: TaskItem) => void;
}

function CalendarDayCell({ calendarDay, year, month, onSelectDate, onSelectTask }: CalendarDayCellProps) {
  const { day, tasks, isToday, isSelected, isOutsideMonth } = calendarDay;

  if (!day) {
    return (
      <div className="h-12 lg:h-16 p-0.5 lg:p-1 border-b border-r border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
    );
  }

  // Outside month days (previous/next month) - show but non-interactive
  if (isOutsideMonth) {
    return (
      <div className="h-12 lg:h-16 p-0.5 lg:p-1 border-b border-r border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="text-xs font-medium text-neutral-300 dark:text-neutral-700">
          {day}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        h-12 lg:h-16 p-0.5 lg:p-1 border-b border-r border-neutral-100 dark:border-neutral-800
        cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 overflow-hidden
        ${isToday ? "bg-blue-50 dark:bg-blue-900/20" : ""}
        ${isSelected ? "ring-2 ring-blue-500 ring-inset" : ""}
      `}
      onClick={() => onSelectDate?.(new Date(year, month, day))}
    >
      <div
        className={`
          text-xs font-medium
          ${isToday ? "text-blue-600 dark:text-blue-400" : "text-neutral-700 dark:text-neutral-300"}
        `}
      >
        {day}
      </div>
      <div className="hidden lg:block space-y-0.5">
        {tasks.slice(0, 2).map((task) => (
          <TaskBadge key={task.id} task={task} onClick={onSelectTask} />
        ))}
        {tasks.length > 2 && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 px-1">
            +{tasks.length - 2}
          </div>
        )}
      </div>
      {/* Mobile: just show dot indicators */}
      <div className="flex lg:hidden gap-0.5 mt-0.5 flex-wrap">
        {tasks.slice(0, 3).map((task) => (
          <span key={task.id} className={`w-1.5 h-1.5 rounded-full ${getStatusColor(task.status)}`} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function Calendar({ onSelectTask, selectedDate, onSelectDate }: CalendarProps) {
  const {
    year,
    month,
    monthName,
    loading,
    calendarDays,
    prevMonth,
    nextMonth,
    goToToday,
  } = useCalendar({ selectedDate });

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden">
      <CalendarHeader
        monthName={monthName}
        year={year}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onToday={goToToday}
      />

      <WeekdayHeader />

      <div className="flex-1 overflow-auto scrollbar-thin">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-7">
            {calendarDays.map((calendarDay, idx) => (
              <CalendarDayCell
                key={idx}
                calendarDay={calendarDay}
                year={year}
                month={month}
                onSelectDate={onSelectDate}
                onSelectTask={onSelectTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
