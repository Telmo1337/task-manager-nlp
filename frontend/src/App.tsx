import { useState } from "react"
import { Calendar as CalendarIcon, ListTodo } from "lucide-react"
import { ChatLayout } from "./components/chat/ChatLayout"
import { CommandInput } from "./components/chat/CommandInput"
import { ChatHistory } from "./components/chat/ChatHistory"
import { Calendar } from "./components/calendar/Calendar"
import { TaskDetail } from "./components/task/TaskDetail"
import { BottomSheet } from "./components/ui/BottomSheet"
import { SlideOver } from "./components/ui/SlideOver"
import { useChat, useTaskSelection } from "./hooks"
import { useCalendarVisibility } from "./hooks/useCalendarVisibility"
import type { TaskItem } from "./types/chat"

function App() {
  // Hooks for state management
  const { messages, isLoading, handleCommand, clearChat, updateTaskInMessages } = useChat()
  const { selectedTask, selectTask, clearSelection, updateSelectedTask } = useTaskSelection()
  const { showCalendar, toggleCalendar } = useCalendarVisibility()
  
  // Mobile overlay states
  const [showMobileCalendar, setShowMobileCalendar] = useState(false)
  const [showMobileTaskDetail, setShowMobileTaskDetail] = useState(false)

  // Event handlers
  function handleClearChat() {
    clearChat()
    clearSelection()
  }

  function handleTaskStatusChange(updatedTask: TaskItem) {
    updateTaskInMessages(updatedTask)
    updateSelectedTask(updatedTask)
  }

  function handleDateSelect(date: Date) {
    const dateStr = date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    handleCommand(`show tasks for ${dateStr}`)
    setShowMobileCalendar(false) // Close mobile calendar after selection
  }

  function handleTaskClick(task: TaskItem) {
    selectTask(task)
    // On mobile, show the task detail bottom sheet
    setShowMobileTaskDetail(true)
  }

  function handleMobileTaskClose() {
    setShowMobileTaskDetail(false)
    clearSelection()
  }

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-6 pb-16 lg:pb-6">
        
        {/* Desktop Container - groups all panels with gaps */}
        <div className="flex gap-4 h-full max-h-[600px] w-full max-w-5xl">
          
          {/* Calendar Panel - Desktop only (lg+) */}
          {showCalendar && (
            <div className="hidden lg:flex flex-col w-64 max-h-[420px] flex-shrink-0 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <Calendar 
                onSelectTask={handleTaskClick}
                onSelectDate={handleDateSelect}
              />
            </div>
          )}

          {/* Chat Panel - Center, full width on mobile */}
          <div className="w-full flex-1 min-w-0 max-h-[600px] flex flex-col">
            <ChatLayout 
              onClearChat={handleClearChat}
              onToggleCalendar={toggleCalendar}
              showCalendar={showCalendar}
            >
              <ChatHistory 
                messages={messages} 
                onTaskClick={handleTaskClick}
                isLoading={isLoading}
              />
              <CommandInput onSubmit={handleCommand} isLoading={isLoading} />
            </ChatLayout>
          </div>

          {/* Task Detail Panel - Desktop only (xl+) */}
          {selectedTask && (
            <div className="hidden xl:flex flex-col w-72 max-h-[420px] flex-shrink-0 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <TaskDetail 
                task={selectedTask}
                onClose={clearSelection}
                onStatusChange={handleTaskStatusChange}
              />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-4 py-2 z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => setShowMobileCalendar(true)}
            className="flex flex-col items-center gap-1 p-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="text-xs">Calendar</span>
          </button>
          
          {selectedTask && (
            <button
              onClick={() => setShowMobileTaskDetail(true)}
              className="flex flex-col items-center gap-1 p-2 text-blue-500 dark:text-blue-400"
            >
              <ListTodo className="w-5 h-5" />
              <span className="text-xs">Task</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Calendar - Bottom Sheet */}
      <BottomSheet
        isOpen={showMobileCalendar}
        onClose={() => setShowMobileCalendar(false)}
        title="Calendar"
      >
        <div className="p-2">
          <Calendar 
            onSelectTask={(task) => {
              handleTaskClick(task)
              setShowMobileCalendar(false)
            }}
            onSelectDate={handleDateSelect}
          />
        </div>
      </BottomSheet>

      {/* Mobile Task Detail - Bottom Sheet */}
      <BottomSheet
        isOpen={showMobileTaskDetail && !!selectedTask}
        onClose={handleMobileTaskClose}
        title="Task Details"
      >
        <TaskDetail 
          task={selectedTask}
          onClose={handleMobileTaskClose}
          onStatusChange={handleTaskStatusChange}
          hideHeader
        />
      </BottomSheet>

      {/* Tablet Task Detail - SlideOver (hidden on lg+ where it's inline) */}
      <div className="hidden md:block xl:hidden">
        <SlideOver
          isOpen={!!selectedTask}
          onClose={clearSelection}
          title="Task Details"
          side="right"
        >
          <TaskDetail 
            task={selectedTask}
            onClose={clearSelection}
            onStatusChange={handleTaskStatusChange}
            hideHeader
          />
        </SlideOver>
      </div>
    </div>
  )
}

export default App
