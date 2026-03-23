# Quoosh

A full-stack, real-time quiz platform inspired by Kahoot-style gameplay.

Quoosh lets hosts create quizzes (manual, JSON import, or AI-generated), run live sessions over Socket.IO, and let players join instantly with an invite code - no account required.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database and Seed](#database-and-seed)
- [API Overview](#api-overview)
- [Socket Events Overview](#socket-events-overview)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Quoosh is a monorepo project with:

- `@quoosh/web`: Next.js web app (hosts, players, and admin dashboard)
- `@quoosh/socket`: Socket.IO real-time game server
- `@quoosh/common`: shared types and validators

### User Roles

- **Host**: Registers/login, creates quizzes, starts live sessions from dashboard
- **Player**: Joins with invite code at `/play`, selects nickname/avatar, plays live
- **Admin**: Accesses `/admin` dashboard for moderation, session control, settings, and analytics

## Core Features

- Real-time multiplayer quiz sessions via Socket.IO
- Invite-code based room joining
- Quiz builder with:
  - Manual editor
  - JSON import parser
  - AI question generation (Google Gemini)
- Question media support:
  - File upload (data URL)
  - Remote image URL (with URL normalization and image proxying)
- Live host controls:
  - Start/skip/abort flow
  - Responses and leaderboard phases
- Final podium with top players
- Reconnect support for both manager and players
- Admin operations:
  - Overview analytics
  - Host/quiz/player/session management
  - Session termination
  - Moderation queue
  - Announcements
  - Platform settings

## Architecture

### Runtime Flow

1. Host creates/edits quiz in web app.
2. Host triggers `POST /api/quizzes/:id/host` to build payload for the socket server.
3. Web emits `manager:hostDirect` with quiz JSON + admin socket secret.
4. Socket server creates a live game and returns `{ gameId, inviteCode }`.
5. Players join by invite code and play through synchronized status updates.
6. Score, responses, leaderboard, and podium are emitted as game states.

### Monorepo Design

- Shared contracts in `@quoosh/common` keep web and socket in sync.
- `@quoosh/web` handles auth, persistence, APIs, and UI.
- `@quoosh/socket` handles in-memory session lifecycle and gameplay orchestration.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Zustand, React Hook Form
- **Backend APIs**: Next.js App Router route handlers
- **Realtime**: Socket.IO (dedicated socket package)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Auth.js (NextAuth v5 beta), Credentials + Google OAuth
- **AI**: Vercel AI SDK + Google Gemini (`gemini-2.0-flash`)
- **Infra/Utils**: Docker multi-stage, Docker Compose, Upstash Redis rate limiting, Resend email

## Project Structure

```txt
.
|-- packages/
|   |-- common/                 # shared game types + validators
|   |-- socket/                 # Socket.IO game server
|   |   `-- src/services/
|   |       |-- game.ts         # game state machine and scoring
|   |       `-- registry.ts     # active game registry and cleanup
|   `-- web/                    # Next.js app
|       |-- prisma/             # schema + migrations + seed
|       `-- src/
|           |-- app/            # pages + API routes
|           |-- components/     # UI components
|           |-- lib/            # auth/db/guards/rate-limit
|           `-- utils/          # helpers and constants
|-- docker-compose.yml
|-- Dockerfile
`-- .env.example
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (or Docker)

### 1) Clone and install

```bash
git clone <your-repo-url>
cd quoosh
pnpm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

Fill the required variables (see [Environment Variables](#environment-variables)).

### 3) Prepare database

```bash
pnpm --filter @quoosh/web exec prisma migrate deploy
pnpm --filter @quoosh/web exec prisma db seed
```

### 4) Run in development

```bash
pnpm dev
```

By default:

- Web app: `http://localhost:3000`
- Socket server: `http://localhost:3001`

## Environment Variables

Use `.env.example` as the source of truth.

### Required for local baseline

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` or `NEXTAUTH_SECRET` | Yes | Auth.js JWT/session signing |
| `SOCKET_URL` | Yes | Server-side socket URL used by web app |
| `NEXT_PUBLIC_SOCKET_URL` | Yes | Client-side socket URL |
| `ADMIN_SOCKET_SECRET` | Yes | Shared secret for manager/admin socket ops (min 32 chars) |
| `NEXT_PUBLIC_ADMIN_SOCKET_SECRET` | Yes | Client-side secret for admin namespace auth |
| `WEB_ORIGIN` | Recommended | CORS origin for socket server |

### Optional but recommended

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth login |
| `GOOGLE_GENERATIVE_AI_API_KEY` | AI quiz generation |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Registration/login rate limiting |
| `RESEND_API_KEY`, `CONTACT_EMAIL` | Contact form email delivery |
| `NEXT_PUBLIC_APP_URL`, `AUTH_URL` | Canonical app/auth URLs |
| `DB_PASSWORD` | Used by `docker-compose` Postgres service |

## Available Scripts

### Root scripts

| Command | Description |
|---|---|
| `pnpm dev` | Runs all workspace apps in parallel |
| `pnpm dev:web` | Starts only Next.js app |
| `pnpm dev:socket` | Starts only socket server |
| `pnpm build` | Builds all packages |
| `pnpm start` | Starts all built apps in parallel |
| `pnpm lint` | Runs lint across workspace |

### Useful package-level commands

```bash
# Prisma workflows
pnpm --filter @quoosh/web exec prisma generate
pnpm --filter @quoosh/web exec prisma migrate dev
pnpm --filter @quoosh/web exec prisma migrate deploy
pnpm --filter @quoosh/web exec prisma db seed
pnpm --filter @quoosh/web exec prisma studio
```

## Database and Seed

Prisma schema lives at:

- `packages/web/prisma/schema.prisma`

Seed file:

- `packages/web/prisma/seed.ts`

Current seed creates/updates an admin user:

- **Email**: `admin@quoosh.local`
- **Password**: `Admin@2026`
- **Role**: `ADMIN`

Change these defaults before production use.

## API Overview

Main routes live in `packages/web/src/app/api`.

### Host-facing routes

- `POST /api/creators/register` - register host account
- `GET /api/quizzes` - list host quizzes
- `POST /api/quizzes` - create quiz
- `GET /api/quizzes/:id` - fetch full quiz
- `PATCH /api/quizzes/:id` - update quiz/questions
- `DELETE /api/quizzes/:id` - delete quiz
- `POST /api/quizzes/:id/host` - transform quiz for live hosting
- `POST /api/quizzes/generate` - AI-generated quiz questions

### Admin routes

- `GET /api/admin/overview`
- `GET /api/admin/hosts`
- `GET /api/admin/players`
- `GET /api/admin/quizzes`
- `GET /api/admin/sessions`
- `GET/PATCH /api/admin/sessions/:id`
- `GET/PATCH /api/admin/moderation`
- `GET/POST /api/admin/settings`
- `GET/POST /api/admin/announcements`
- `PATCH /api/admin/announcements/:id`

### Utility routes

- `GET /api/health` - DB connectivity health check
- `POST /api/contact` - contact form mail dispatch
- `GET /api/env` and `GET /env` - environment diagnostics alias
- `GET /api/images/proxy?url=...` - server-side remote image proxy

## Socket Events Overview

Socket server entry: `packages/socket/src/index.ts`

### Player events

- `player:join`, `player:login`, `player:selectedAnswer`, `player:reconnect`
- Receives: `game:status`, `game:cooldown`, `game:reset`, etc.

### Manager events

- `manager:hostDirect`, `manager:startGame`, `manager:nextQuestion`, `manager:showLeaderboard`, `manager:abortQuiz`, `manager:kickPlayer`, `manager:reconnect`
- Receives: `manager:gameCreated`, `manager:newPlayer`, `manager:errorMessage`, etc.

### Admin namespace (`/admin`)

- Authenticated by `ADMIN_SOCKET_SECRET`
- Supports:
  - `admin:getSessions`
  - `admin:terminateSession`
  - periodic `admin:sessions` broadcasts

## Deployment

### Docker Compose

Run web + socket + postgres together:

```bash
docker compose up --build -d
```

Services:

- `web` on `:3000`
- `socket` on `:3001`
- `db` on `:5432`

### Dockerfile

The root `Dockerfile` is multi-stage with separate targets:

- `web` target: Next.js standalone server
- `socket` target: bundled `dist/index.cjs`

### Railway

`railway.json` is configured for Dockerfile-based build/deploy (socket start command shown there).

## Security Notes

- Auth and role checks enforced via:
  - middleware route protection (`/dashboard`, `/admin`)
  - API guards (`requireHost`, `requireAdmin`)
- Admin pages return rewritten not-found for unauthorized users.
- Registration/login rate limiting is enabled only when Upstash env vars are set.
- `ADMIN_SOCKET_SECRET` must be strong (>=32 chars) in production.
- Default seeded admin credentials should be rotated immediately.

## Troubleshooting

### 1) Prisma or DB connection issues

- Verify `DATABASE_URL`
- Ensure Postgres is reachable
- Re-run:
  - `pnpm --filter @quoosh/web exec prisma generate`
  - `pnpm --filter @quoosh/web exec prisma migrate deploy`

### 2) Socket connection fails

- Verify:
  - `SOCKET_URL`
  - `NEXT_PUBLIC_SOCKET_URL`
  - `WEB_ORIGIN`
- Ensure socket service is running on expected port.

### 3) Admin socket errors

- Confirm `ADMIN_SOCKET_SECRET` and `NEXT_PUBLIC_ADMIN_SOCKET_SECRET` match.

### 4) AI generation fails

- Set `GOOGLE_GENERATIVE_AI_API_KEY`.

### 5) Contact form fails

- Set `RESEND_API_KEY` and `CONTACT_EMAIL`.

## Contributing

1. Create a feature branch.
2. Keep changes focused and small.
3. Run lint/build before opening PR:
   - `pnpm lint`
   - `pnpm build`
4. Describe behavior changes and affected routes/components.

## License

No license file is currently defined in this repository.
Add a `LICENSE` file if you plan to open-source distribution terms.
