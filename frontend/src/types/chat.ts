export type ChatMessage = {
  role: "user" | "system"
  content: string
  tasks?: TaskItem[]
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled"

export type TaskItem = {
  id: number
  title: string
  description?: string | null
  dueAt: string
  status?: TaskStatus
  completedAt?: string | null
  priority?: string
  recurrence?: string
  createdAt?: string
}
