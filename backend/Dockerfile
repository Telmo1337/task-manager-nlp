# Backend Dockerfile - built from project root context
FROM node:20-alpine

WORKDIR /app

# Copy workspace config
COPY package*.json ./
COPY tsconfig*.json ./

# Copy all workspace packages
COPY shared/ ./shared/
COPY command-task-core/ ./command-task-core/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install

# Copy backend source
COPY backend/ ./backend/

# Generate Prisma client
WORKDIR /app/backend
RUN npx prisma generate

EXPOSE 3000

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
