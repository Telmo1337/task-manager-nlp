/* import { Input } from "../ui/input";

export function CommandInput() {
  return (
    <div className="border-t p-3">
      <Input
        placeholder="What do you wanna do today? :)"
        autoFocus
        className="text-sm"
      />
    </div>
  );
}
 */

import { useState } from "react"
import { Send } from "lucide-react";
import { Input } from "../ui/input";
interface Props {
  onSubmit: (value: string) => void
  isLoading?: boolean
}

export function CommandInput({ onSubmit, isLoading }: Props) {
  const [value, setValue] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim() || isLoading) return

    onSubmit(value)
    setValue("")
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-neutral-200 dark:border-neutral-700 p-3 bg-linear-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10">
      <div className="flex gap-2">
        <Input
          placeholder={isLoading ? "Thinking..." : "What do you wanna do today? :)"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
          className="dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder:text-neutral-500 flex-1"
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}
