# TaskFlow - Natural Language Task Manager

> ⚠️ **Disclaimer**: This is a **fictional product** created for **educational and learning purposes only**. It is not intended for commercial use or production deployment. The branding, pricing, and "Pro" features mentioned are part of the demo experience.

A modern task management application with a **natural language chat interface**. Instead of clicking buttons and filling forms, simply type what you want to do in plain English.

![Task Manager](https://img.shields.io/badge/React-19.2-blue) ![Node](https://img.shields.io/badge/Node-20-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Prisma](https://img.shields.io/badge/Prisma-6.19-purple)

## Features

- **Natural Language Processing** - Create, edit, and delete tasks using conversational commands
- **Smart Date Parsing** - Understands "tomorrow", "next friday", "in 3 days", etc.
- **Priority Levels** - Set high, medium, or low priority for tasks
- **Recurring Tasks** - Support for daily, weekly, monthly recurrence
- **Task Descriptions** - Add detailed descriptions to your tasks
- **Calendar View** - Visual calendar showing tasks by due date
- **User Authentication** - Secure login/register with JWT tokens
- **Dark/Light Theme** - Toggle between dark and light modes
- **Responsive Design** - Works on desktop, tablet, and mobile with hamburger menu
- **Animated UI** - Smooth page transitions and micro-interactions with Framer Motion
- **Smooth Scroll** - Butter-smooth scrolling experience with Lenis
- **Chat Persistence** - Your conversation history is saved locally
- **Undo Support** - Made a mistake? Just type "undo"
- **Security Hardened** - Helmet, rate limiting, and secure headers
- **Performance Optimized** - Gzip compression and lazy loading

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion, Lucide Icons |
| Backend | Express 5, Prisma ORM, MySQL, JWT Authentication |
| Security | Helmet, express-rate-limit, bcrypt, CORS |
| Performance | Compression (gzip), React.lazy code splitting |
| NLP Engine | Custom `command-task-core` module |
| Database | MySQL 8.0 (Docker) |
| Smooth Scroll | Lenis |

## Getting Started

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
CORS_ORIGIN=http://localhost:5173

# Authentication (required in production)
JWT_SECRET="your-secure-jwt-secret-min-32-chars"
JWT_REFRESH_SECRET="your-secure-refresh-secret-min-32-chars"
NODE_ENV=development
```

## How to Use

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

## Project Structure

```
projeto-task-manager/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/       # Login, Register, ProtectedRoute
│   │   │   ├── landing/    # Landing page sections
│   │   │   ├── features/   # Features page
│   │   │   ├── pricing/    # Pricing page  
│   │   │   ├── about/      # About page
│   │   │   ├── calendar/   # Calendar components
│   │   │   ├── chat/       # Chat interface
│   │   │   ├── task/       # Task components
│   │   │   └── ui/         # Shared UI components
│   │   ├── contexts/   # Auth context
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utilities, animations, theme
│   └── Dockerfile
├── backend/            # Express API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── guards/     # Auth guards
│   │   ├── middleware/ # JWT middleware
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

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in dev mode |
| `npm run build` | Build both frontend and backend |
| `npm run docker:up` | Start all Docker containers |
| `npm run docker:down` | Stop all Docker containers |
| `npm run docker:build` | Rebuild Docker images |
| `npm run docker:logs` | View container logs |
| `npm run docker:restart` | Rebuild and restart everything |

## Responsive Layout

- **Desktop** (1280px+): Three-column layout with chat, calendar, and task details
- **Tablet** (1024px+): Two-column with slide-over panel for task details
- **Mobile** (<1024px): Single column with bottom sheet overlays

## NLP Engine

The `command-task-core` module processes natural language through a pipeline:

1. **Normalize** - Clean and standardize input
2. **Intent Detection** - Identify command type (create, edit, delete, list)
3. **Slot Extraction** - Extract entities (title, date, time, priority)
4. **Ambiguity Resolution** - Handle unclear inputs with follow-up questions

Supported date formats:
- Relative: "today", "tomorrow", "next week", "in 5 days"
- Absolute: "January 15", "01/15/2026", "15th of March"
- Day names: "monday", "next friday", "this saturday"

## Security & Performance

### Security Features

| Feature | Description |
|---------|-------------|
| **Helmet** | Sets secure HTTP headers (CSP, XSS protection, frame options) |
| **Rate Limiting** | 100 requests/15min globally, 10/15min for auth routes |
| **Zod Validation** | Strong input validation with detailed error messages |
| **Password Policy** | 8+ chars, uppercase, lowercase, number, special char required |
| **Password Hashing** | bcrypt with 12 salt rounds |
| **JWT Tokens** | Short-lived access tokens (15m) + refresh tokens (7d) |
| **httpOnly Cookies** | Secure cookie storage for tokens (XSS protection) |
| **Account Lockout** | 5 failed attempts = 15 minute lockout |
| **Audit Logging** | Security events logged to database |
| **HTTPS Redirect** | Automatic redirect to HTTPS in production |
| **CORS** | Configurable origin whitelist with credentials |
| **Body Size Limit** | JSON payloads limited to 10KB |
| **Env Enforcement** | Required secrets in production, warnings in dev |

### Performance Optimizations

| Feature | Description |
|---------|-------------|
| **Compression** | Gzip compression for all responses |
| **Code Splitting** | React.lazy() for route-based lazy loading |
| **Suspense** | Loading states during chunk downloads |

## License

MIT License - This project is for **educational and personal learning purposes only**. 

The "TaskFlow" brand, pricing tiers, and Pro features are fictional and part of the demo experience. Feel free to use this project as a reference for learning React, Express, Prisma, or building your own applications.

---

Made with ❤️ for learning by [Telmo](https://github.com/Telmo1337)
