import { ConversationalKey } from "./patterns";

type ResponseValue = string | string[] | (() => string);

export const responses: Record<ConversationalKey, ResponseValue> = {
  identity:
    "Hi! I'm your personal Task Manager assistant. I help you organize your tasks, set reminders, and stay on top of your schedule. Just tell me what you need!",

  name: "I'm Task Manager, your friendly productivity assistant! You can just call me TM if you like. 😊",

  creator:
    "I was crafted with care to help you stay organized and productive. Think of me as your digital sidekick!",

  capabilities:
    "I can help you with:\n• Create tasks: 'add buy groceries tomorrow at 3pm'\n• View tasks: 'show my tasks' or 'tasks for today'\n• Edit tasks: 'edit #1 to Friday'\n• Delete tasks: 'delete task #1'\n• Set priorities: 'high priority meeting tomorrow'\n• Add descriptions: 'description: bring the documents'",

  help: "Here's how to use me:\n• Create: 'create task [name] [date] [time]'\n• List: 'show tasks', 'today's tasks', 'pending tasks'\n• Edit: 'edit #[id] [changes]'\n• Delete: 'delete #[id]' or 'delete all'\n• Undo: 'undo'\nTip: You can use natural language like 'remind me to call mom tomorrow at 5pm'!",

  explain: `**Quick Commands:**

**Creating Tasks:**
• "add meeting tomorrow at 2pm"
• "create buy groceries next friday"
• "remind me to call mom at 5pm"
• "high priority report due monday"

**Viewing Tasks:**
• "show my tasks" or "list tasks"
• "today's tasks" or "tasks for today"
• "pending tasks" or "completed tasks"
• "show tasks for february 10"

**Editing Tasks:**
• "edit #5 to next week"
• "change #3 to high priority"
• "rename #2 to new title"
• "edit #1 description: add notes here"

**Deleting Tasks:**
• "delete #5" or "remove task #5"
• "delete all tasks"

**Other:**
• "undo" - undo last action
• "help" - show help
• "who are you?" - about me`,

  greeting:
    "Hello! I'm ready to help you manage your tasks. What would you like to do today?",

  goodbye:
    "Goodbye! Stay productive and come back anytime you need help with your tasks! 👋",

  thanks: "You're welcome! Let me know if you need anything else. 😊",

  howAreYou:
    "I'm doing great, thanks for asking! Ready to help you stay organized. What can I do for you?",

  compliment:
    "Aw, thank you! That means a lot. I'm here to make your life easier! 💪",

  apology: "No worries at all! How can I help you?",

  frustration:
    "I'm sorry you're frustrated. Let me try to help - what are you trying to do? Maybe I can explain it better.",

  joke: [
    "Why did the task go to therapy? It had too many issues to resolve! 😄",
    "I tried to organize a hide and seek tournament, but it was a disaster. Good players are hard to find!",
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
    "What do you call a task that's been waiting forever? Pro-crastinated! ⏰",
  ],

  motivation: [
    "You've got this! Remember: every big accomplishment starts with a single task. Let's tackle one thing at a time! 💪",
    "Take a deep breath. Progress, not perfection! What's one small task you can finish right now?",
    "Even the longest journey begins with a single step. You're doing great just by being here! ⭐",
    "Feeling overwhelmed? Let's break things down. Show me your tasks and we'll prioritize together!",
  ],

  boredom:
    "Bored? Perfect time to get ahead! Try 'show my tasks' to see what you can knock out, or create a new task for something you've been putting off!",

  productivity:
    "Here are some productivity tips:\n• Break big tasks into smaller ones\n• Use priorities (urgent, high, normal, low)\n• Set specific times for tasks\n• Review your completed tasks to stay motivated\n• Don't forget to take breaks! 🧘",

  acknowledge: "Great! What would you like to do next?",

  nevermind: "No problem! Let me know when you need something.",

  love: "That makes me happy! I love helping you stay on top of things! ❤️",

  whatTime: () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `Today is ${dateStr}. Need to create a task for today?`;
  },

  coinFlip: () => (Math.random() < 0.5 ? "🪙 Heads!" : "🪙 Tails!"),

  rollDice: () => `🎲 You rolled a ${Math.floor(Math.random() * 6) + 1}!`,

  song: "🎵 Task, task, baby! Too many tasks to do today... 🎵 (I'm better at organizing than singing!)",

  meaningOfLife:
    "42? Ah, I see you're a person of culture! But here, the meaning of life is getting things done! 📋",
};
