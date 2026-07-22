# AGENTS.md

## Repo structure

Two independent packages — no workspace tooling or shared build:

- `chat-app/` — Next.js 15 frontend (React 19, TypeScript, Tailwind v4, shadcn/ui)
- `chat-app-backend/` — FastAPI backend (Python, SQLAlchemy, OpenAI API)

No monorepo manager (nx, turborepo, etc.). Each package is managed independently.

## Frontend commands (`chat-app/`)

```bash
npm run dev      # next dev --turbopack (port 3000)
npm run build    # next build
npm run lint     # next lint (eslint: next/core-web-vitals + next/typescript)
```

No test suite exists. No typecheck script separate from lint/build.

## Backend commands (`chat-app-backend/`)

```bash
pip install -r requirements.txt  # Install Python dependencies
python main.py   # or: uvicorn main:app --reload
python migrate.py  # DANGER: drops ALL tables then recreates (drop_all → create_all)
```

## Environment variables

### Backend
- `DATABASE_URL` — PostgreSQL connection string (used by engine and migrate.py)
- `OPENAI_API_KEY` — for GPT-5.4-nano completions
- `FRONTEND_URL` — allowed CORS origin

### Frontend
- `NEXT_PUBLIC_API_URL` — backend base URL (used in fetch calls from both server and client components)

No `.env` files are committed. Both packages expect you to create them locally.

## Key architecture notes

- **Auth:** Clerk (`@clerk/nextjs`). Root layout wraps everything in `<ClerkProvider>`. Middleware at `chat-app/middleware.ts` — currently all routes are marked public (the matcher includes `/(.*)`), so auth protection is effectively disabled.
- **Route groups:** `(auth)` for sign-in/sign-up pages, `(chat)` for the main chat UI with sidebar.
- **Chat streaming:** Frontend reads SSE from `POST /chat`. Backend streams OpenAI completions, then saves both user and assistant messages to DB after the stream ends.
- **Auto-naming:** After the first assistant reply, frontend calls `POST /chat/{chatId}/auto-name` which uses OpenAI to generate a 3-5 word chat title.
- **UI components:** shadcn/ui (new-york style, lucide icons). Components in `components/ui/`, use `cn()` from `@/lib/utils`. Add new components via `npx shadcn@latest add <component>`.
- **Path alias:** `@/*` maps to `chat-app/` root (configured in tsconfig.json).

## Gotchas

- `migrate.py` is destructive — it calls `drop_all()` before `create_all()`. Never run against a database with data you need.
- Backend saves messages inside a generator function (after streaming completes). If the stream is interrupted, messages won't be persisted.
- Backend has duplicate route names: two `get_chat` endpoints at different paths (`/chat/{chat_id}` and `/chat/{chat_id}/messages`). FastAPI resolves by registration order.
- Frontend `sidebar.tsx` is an async server component that fetches chats at render time — no revalidation or caching strategy is configured.
