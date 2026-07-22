# Greeny Chat App

A full-stack AI chat application with a Next.js frontend and FastAPI backend, powered by OpenAI's GPT-5.4-nano model.

## Features

- Real-time streaming chat with AI responses
- Persistent chat history with PostgreSQL
- Automatic chat naming using AI
- Responsive sidebar with chat list
- Clerk authentication integration
- Markdown rendering for AI responses

## Tech Stack

### Frontend (`chat-app/`)
- **Framework:** Next.js 15.3 (React 19, TypeScript)
- **Styling:** Tailwind CSS v4, shadcn/ui (new-york style)
- **Auth:** Clerk (`@clerk/nextjs`)
- **Icons:** Lucide React, React Icons
- **Markdown:** react-markdown

### Backend (`chat-app-backend/`)
- **Framework:** FastAPI
- **Database:** PostgreSQL with SQLAlchemy ORM
- **AI:** OpenAI API (GPT-5.4-nano)
- **Server:** Uvicorn

## Project Structure

```
chat-app/
├── app/
│   ├── (auth)/          # Sign-in/sign-up pages (Clerk)
│   ├── (chat)/          # Main chat UI with sidebar
│   │   ├── chat/[chatId]/  # Individual chat pages
│   │   └── page.tsx    # Home/new chat page
│   ├── layout.tsx      # Root layout with ClerkProvider
│   └── globals.css     # Tailwind + shadcn theme
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── chat.tsx        # Main chat component (client-side)
│   └── sidebar.tsx     # Sidebar with chat list (server component)
├── lib/
│   └── utils.ts        # cn() utility for Tailwind
└── hooks/
    └── use-mobile.ts   # Mobile detection hook

chat-app-backend/
├── main.py             # FastAPI routes and OpenAI integration
├── schema.py           # SQLAlchemy models (Chat, Message)
├── migrate.py          # Database migration (destructive!)
└── requirements.txt    # Python dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL database
- OpenAI API key
- Clerk account (for authentication)

### Installation

#### Frontend

```bash
cd chat-app
npm install
```

#### Backend

```bash
cd chat-app-backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### Environment Variables

Create `.env` files in both directories:

#### `chat-app/.env`

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

#### `chat-app-backend/.env`

```
DATABASE_URL=postgresql://user:password@localhost:5432/chatdb
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:3000
```

### Database Setup

```bash
cd chat-app-backend
python migrate.py
```

**Warning:** This drops all tables and recreates them. Only use on a fresh database.

## Running the App

Start both servers in separate terminals:

```bash
# Terminal 1 - Frontend
cd chat-app
npm run dev

# Terminal 2 - Backend
cd chat-app-backend
python main.py
```

The frontend runs at `http://localhost:3000` and the backend at `http://localhost:8000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | Send messages and receive streaming AI response |
| POST | `/new-chat` | Create a new chat session |
| GET | `/chat/{chatId}/messages` | Get messages for a chat |
| GET | `/chat/{chatId}` | Get chat details |
| POST | `/chat/{chatId}/auto-name` | Generate AI-powered chat name |
| GET | `/chats` | List all chats |
| GET | `/health` | Health check endpoint |

## Database Schema

### Chats Table
- `id` (UUID, primary key)
- `chat_name` (String, nullable)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Messages Table
- `id` (UUID, primary key)
- `role` (String: "user" or "assistant")
- `content` (String)
- `chat_id` (UUID, foreign key to chats)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## Development

### Frontend Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # Run ESLint
```

### Adding shadcn/ui Components

```bash
cd chat-app
npx shadcn@latest add <component-name>
```

## Notes

- The Clerk middleware currently marks all routes as public (auth protection is disabled)
- Messages are saved to the database after the streaming response completes
- If a stream is interrupted, messages won't be persisted
- The sidebar fetches chats on each render without caching
