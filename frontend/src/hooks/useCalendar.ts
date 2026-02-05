import { useState, useEffect, useCallback, useMemo } from "react";
import { getCalendarTasks } from "../lib/api";
import type { TaskItem } from "../types/chat";

export interface CalendarDay {
  day: number | null;
  tasks: TaskItem[];
  isToday: boolean;
  isSelected: boolean;
  isOutsideMonth?: boolean;
}

export interface UseCalendarOptions {
  selectedDate?: Date;
}

export interface UseCalendarReturn {
  // State
  currentDate: Date;
  year: number;
  month: number;
  monthName: string;
  tasks: TaskItem[];
  loading: boolean;
  calendarDays: CalendarDay[];
  
  // Actions
  prevMonth: () => void;
  nextMonth: () => void;
  goToToday: () => void;
  getTasksForDay: (day: number) => TaskItem[];
  
  // Helpers
  isToday: (day: number) => boolean;
  isSelected: (day: number) => boolean;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const { selectedDate } = options;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = MONTHS[month];

  // Load tasks when month changes
  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      try {
        const data = await getCalendarTasks(year, month + 1);
        setTasks(data);
      } catch (err) {
        console.error("Failed to load calendar tasks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [year, month]);

  // Navigation actions
  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1));
  }, [year, month]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Helper functions
  const getTasksForDay = useCallback((day: number): TaskItem[] => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueAt);
      return (
        taskDate.getFullYear() === year &&
        taskDate.getMonth() === month &&
        taskDate.getDate() === day
      );
    });
  }, [tasks, year, month]);

  const isToday = useCallback((day: number): boolean => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  }, [year, month]);

  const isSelected = useCallback((day: number): boolean => {
    if (!selectedDate) return false;
    return (
      year === selectedDate.getFullYear() &&
      month === selectedDate.getMonth() &&
      day === selectedDate.getDate()
    );
  }, [year, month, selectedDate]);

  // Build calendar grid - always 6 weeks (42 cells) for consistent sizing
  const calendarDays = useMemo((): CalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    // Get previous month's last day
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];
    
    // Previous month's trailing days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ 
        day: prevMonthLastDay - i, 
        tasks: [], 
        isToday: false, 
        isSelected: false,
        isOutsideMonth: true 
      });
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        tasks: getTasksForDay(day),
        isToday: isToday(day),
        isSelected: isSelected(day),
        isOutsideMonth: false,
      });
    }
    
    // Next month's leading days to fill remaining cells (up to 42)
    let nextMonthDay = 1;
    while (days.length < 42) {
      days.push({ 
        day: nextMonthDay++, 
        tasks: [], 
        isToday: false, 
        isSelected: false,
        isOutsideMonth: true 
      });
    }
    
    return days;
  }, [year, month, getTasksForDay, isToday, isSelected]);

  return {
    currentDate,
    year,
    month,
    monthName,
    tasks,
    loading,
    calendarDays,
    prevMonth,
    nextMonth,
    goToToday,
    getTasksForDay,
    isToday,
    isSelected,
  };
}
