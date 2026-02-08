// src/components/chat/ChatLayout.tsx

import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Trash2, LogOut, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useAuth } from "../../hooks";

interface ChatLayoutProps {
  children: ReactNode;
  onClearChat?: () => void;
  onToggleCalendar?: () => void;
  showCalendar?: boolean;
}

export function ChatLayout({ children, onClearChat, onToggleCalendar, showCalendar }: ChatLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate("/", { replace: true });
  };

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
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-700 bg-linear-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h1 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            TaskFlow
          </h1>
          {user && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
              · {user.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Calendar toggle - hidden on mobile, visible on lg+ */}
          {onToggleCalendar && (
            <button
              onClick={onToggleCalendar}
              className={`hidden lg:flex p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors ${showCalendar ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Toggle calendar"
              title="Toggle calendar"
            >
              <Calendar className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400" />
            </button>
          )}
          {onClearChat && (
            <button
              onClick={onClearChat}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400" />
            </button>
          )}
          <ThemeToggle />
          <button
            onClick={() => setShowLogoutModal(true)}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-4.5 h-4.5 text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
          </button>
        </div>
      </div>
      {children}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign out?"
        description="You'll need to sign in again to access your tasks."
        confirmText="Sign out"
        cancelText="Stay signed in"
        variant="danger"
        icon={<LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
