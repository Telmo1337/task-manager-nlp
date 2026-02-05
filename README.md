# Task Manager NLP

A modern task management application with a **natural language chat interface**. Instead of clicking buttons and filling forms, simply type what you want to do in plain English.

![Task Manager](https://img.shields.io/badge/React-19.2-blue) ![Node](https://img.shields.io/badge/Node-20-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Prisma](https://img.shields.io/badge/Prisma-6.19-purple)

## ✨ Features

- 💬 **Natural Language Processing** - Create, edit, and delete tasks using conversational commands
- 📅 **Smart Date Parsing** - Understands "tomorrow", "next friday", "in 3 days", etc.
- 🎯 **Priority Levels** - Set high, medium, or low priority for tasks
- 🔄 **Recurring Tasks** - Support for daily, weekly, monthly recurrence
- 📝 **Task Descriptions** - Add detailed descriptions to your tasks
- 📆 **Calendar View** - Visual calendar showing tasks by due date
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 💾 **Chat Persistence** - Your conversation history is saved locally
- ↩️ **Undo Support** - Made a mistake? Just type "undo"

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS, Lucide Icons |
| Backend | Express 5, Prisma ORM, MySQL |
| NLP Engine | Custom `command-task-core` module |
| Database | MySQL 8.0 (Docker) |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### Quick Start (Docker)

Run everything with Docker:

```bash
# Clone the repository
git clone https://github.com/Telmo1337/task-manager-nlp.git
cd task-manager-nlp

# Start all services (database, backend, frontend)
npm run docker:up

# Open in browser
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

### Development Setup

For local development with hot reload:

```bash
# 1. Install dependencies
npm run install:all

# 2. Start MySQL database
cd backend
docker-compose up -d
cd ..

# 3. Run database migrations
cd backend
npx prisma migrate dev
cd ..

# 4. Start dev servers (backend + frontend)
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="mysql://root:root@localhost:3306/taskmanager"
PORT=3000
```

## 💬 How to Use

Just type naturally in the chat! Here are some examples:

### Creating Tasks

```
add buy groceries tomorrow
create meeting with John next monday at 2pm
new task finish report by friday high priority
remind me to call mom in 3 days
```

### Listing Tasks

```
show my tasks
list all tasks
what do I have today
show tasks for next week
```

### Editing Tasks

```
rename task 1 to buy vegetables
change task 2 to tomorrow
set task 3 priority to high
mark task 1 as done
complete task 2
```

### Deleting Tasks

```
delete task 1
remove task 3
delete all tasks
clear everything
```

### Other Commands

```
undo                    # Undo last action
help                    # Show available commands
explain                 # Detailed command guide
```

### Conversational Features

The assistant also responds to casual conversation:

```
hello / hi / hey        # Greetings
thanks / thank you      # Appreciation
what can you do?        # Capabilities
tell me a joke          # Fun responses
flip a coin             # Random decisions
roll a dice             # Random number
```

## 📁 Project Structure

```
projeto-task-manager/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utilities
│   └── Dockerfile
├── backend/            # Express API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── executor/   # Command handlers
│   ├── prisma/         # Database schema
│   └── Dockerfile
├── command-task-core/  # NLP processing engine
│   └── src/core/
│       ├── intent/     # Intent detection
│       ├── slots/      # Entity extraction
│       └── pipeline/   # Processing pipeline
├── shared/             # Shared types
└── docker-compose.yml  # Full stack Docker setup
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in dev mode |
| `npm run build` | Build both frontend and backend |
| `npm run docker:up` | Start all Docker containers |
| `npm run docker:down` | Stop all Docker containers |
| `npm run docker:build` | Rebuild Docker images |
| `npm run docker:logs` | View container logs |
| `npm run docker:restart` | Rebuild and restart everything |

## 📱 Responsive Layout

- **Desktop** (1280px+): Three-column layout with chat, calendar, and task details
- **Tablet** (1024px+): Two-column with slide-over panel for task details
- **Mobile** (<1024px): Single column with bottom sheet overlays

## 🧠 NLP Engine

The `command-task-core` module processes natural language through a pipeline:

1. **Normalize** - Clean and standardize input
2. **Intent Detection** - Identify command type (create, edit, delete, list)
3. **Slot Extraction** - Extract entities (title, date, time, priority)
4. **Ambiguity Resolution** - Handle unclear inputs with follow-up questions

Supported date formats:
- Relative: "today", "tomorrow", "next week", "in 5 days"
- Absolute: "January 15", "01/15/2026", "15th of March"
- Day names: "monday", "next friday", "this saturday"

## 📄 License

MIT License - feel free to use this project for learning or building your own task manager!

---

Made with ❤️ by [Telmo](https://github.com/Telmo1337)
