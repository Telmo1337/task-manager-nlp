import { useState, useCallback } from "react";

export interface UseCalendarVisibilityReturn {
  showCalendar: boolean;
  toggleCalendar: () => void;
  setShowCalendar: (show: boolean) => void;
}

export function useCalendarVisibility(initialState = true): UseCalendarVisibilityReturn {
  const [showCalendar, setShowCalendar] = useState(initialState);

  const toggleCalendar = useCallback(() => {
    setShowCalendar((prev) => !prev);
  }, []);

  return {
    showCalendar,
    toggleCalendar,
    setShowCalendar,
  };
}
