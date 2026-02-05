// src/components/chat/ChatLayout.tsx

import type { ReactNode } from "react";
import { Calendar, Trash2 } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";

interface ChatLayoutProps {
  children: ReactNode;
  onClearChat?: () => void;
  onToggleCalendar?: () => void;
  showCalendar?: boolean;
}

export function ChatLayout({ children, onClearChat, onToggleCalendar, showCalendar }: ChatLayoutProps) {
  return (
    <div className="
      flex flex-col
      w-full h-full
      border border-neutral-200 dark:border-neutral-800
      rounded-xl
      bg-white dark:bg-neutral-900
      shadow-sm
      overflow-hidden
    ">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
        <h1 className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Task Manager
        </h1>
        <div className="flex items-center gap-1">
          {/* Calendar toggle - hidden on mobile, visible on lg+ */}
          {onToggleCalendar && (
            <button
              onClick={onToggleCalendar}
              className={`hidden lg:flex p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${showCalendar ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
              aria-label="Toggle calendar"
              title="Toggle calendar"
            >
              <Calendar className="w-[18px] h-[18px] text-neutral-500 dark:text-neutral-400" />
            </button>
          )}
          {onClearChat && (
            <button
              onClick={onClearChat}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="w-[18px] h-[18px] text-neutral-500 dark:text-neutral-400" />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
      {children}
    </div>
  );
}
