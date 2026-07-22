# Greeny Chat App

A full-stack AI chat application with a Next.js frontend and FastAPI backend, powered by OpenAI's GPT-5.4-nano model.

## Features

- Real-time streaming chat with AI responses
- Persistent chat history with PostgreSQL
- Automatic chat naming using AI
- Responsive sidebar with chat list
- Database-backed authentication with JWT sessions
- Markdown rendering for AI responses

## Tech Stack

### Frontend (`chat-app/`)
- **Framework:** Next.js 15.3 (React 19, TypeScript)
- **Styling:** Tailwind CSS v4, shadcn/ui (new-york style)
- **Auth:** Custom JWT-based authentication
- **Icons:** Lucide React, React Icons
- **Markdown:** react-markdown

### Backend (`chat-app-backend/`)
- **Framework:** FastAPI
- **Database:** PostgreSQL with SQLAlchemy ORM
- **AI:** OpenAI API (GPT-5.4-nano)
- **Server:** Uvicorn
- **Auth:** JWT tokens with bcrypt password hashing

## Project Structure

```
chat-app/
├── app/
│   ├── (auth)/          # Sign-in/sign-up pages
│   ├── (chat)/          # Main chat UI with sidebar
│   │   ├── chat/[chatId]/  # Individual chat pages
│   │   └── page.tsx    # Home/new chat page
│   ├── layout.tsx      # Root layout with AuthProvider
│   └── globals.css     # Tailwind + shadcn theme
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── chat.tsx        # Main chat component (client-side)
│   └── sidebar.tsx     # Sidebar with chat list (server component)
├── lib/
│   ├── utils.ts        # cn() utility for Tailwind
│   └── auth-context.tsx # Auth context/provider
└── hooks/
    └── use-mobile.ts   # Mobile detection hook

chat-app-backend/
├── main.py             # FastAPI routes and OpenAI integration
├── auth.py             # Authentication routes and utilities
├── schema.py           # SQLAlchemy models (User, Session, Chat, Message)
├── migrate.py          # Database migration (destructive!)
└── requirements.txt    # Python dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL database
- OpenAI API key

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
```

#### `chat-app-backend/.env`

```
DATABASE_URL=postgresql://user:password@localhost:5432/chatdb
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:3000
JWT_SECRET_KEY=your-secret-key-change-in-production
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

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new user account |
| POST | `/auth/login` | Sign in with email/password |
| POST | `/auth/logout` | Sign out and clear session |
| GET | `/auth/me` | Get current user info |

### Chat
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

### Users Table
- `id` (UUID, primary key)
- `email` (String, unique, indexed)
- `hashed_password` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Sessions Table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to users)
- `token` (String, unique, indexed)
- `expires_at` (DateTime)
- `created_at` (DateTime)

### Chats Table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to users)
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

- Sessions are stored in the database with 7-day expiration
- Passwords are hashed with bcrypt
- JWT tokens are sent as httpOnly cookies for security
- Messages are saved to the database after the streaming response completes
- If a stream is interrupted, messages won't be persisted
- The sidebar fetches chats on each render without caching
