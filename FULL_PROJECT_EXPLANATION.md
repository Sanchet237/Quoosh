# Quoosh Full Project Explanation

Version: repository snapshot on March 23, 2026  
Scope: full-stack monorepo (`web`, `socket`, `common`)  
Audience: maintainers, contributors, reviewers, deployment engineers

## 1. Executive Summary

Quoosh is a Kahoot-style, real-time quiz platform with three primary personas:

- Host: creates and edits quizzes, then runs live sessions.
- Player: joins a live session via PIN without creating an account.
- Admin: moderates platform content and operations from an admin dashboard.

The system is a PNPM workspace monorepo:

- `@quoosh/web`: Next.js application (UI + APIs + Prisma + Auth.js).
- `@quoosh/socket`: Socket.IO real-time game orchestration server.
- `@quoosh/common`: shared TypeScript contracts and validators.

Core experience:

1. Host creates a quiz in the web dashboard.
2. Host clicks `Host`; web app prepares quiz JSON and sends it to socket server.
3. Socket server creates an in-memory game room with PIN.
4. Players join with PIN, answer in real time, leaderboard updates, podium ends session.

## 2. Product Features (Complete Functional Inventory)

## 2.1 Public and Marketing Experience

- Landing page at `/` with:
  - Hero section and call-to-actions.
  - Feature cards and value propositions.
  - Three-step "how it works" section.
  - Mockup section.
  - Support and feedback contact form.
  - FAQ accordion.
  - Footer links.
- Embedded FAQ chatbot widget (`QuooshChat`) shown on selected routes only (`/`, auth pages, and play/join routes).
- Static legal pages:
  - `/privacy`
  - `/terms`

## 2.2 Authentication and Identity

- Host authentication:
  - Credentials login (`email/password`).
  - Registration endpoint for host accounts.
  - Optional Google OAuth login.
- Auth stack:
  - Auth.js / NextAuth v5 beta.
  - JWT session strategy (`maxAge: 7 days`).
  - Google sign-in upserts user as `HOST` if not existing.
- Role model:
  - `HOST`
  - `ADMIN`
- Account suspension support (`User.suspended`) enforced at login.

## 2.3 Host Dashboard and Quiz Builder

- Dashboard features:
  - List my quizzes.
  - Create new quiz metadata (title, subject).
  - Delete quiz.
- Quiz editor features:
  - Manual question editing.
  - Question reorder with drag-and-drop.
  - Add/delete questions.
  - JSON import pipeline for bulk questions.
  - AI question generation using Gemini via `/api/quizzes/generate`.
  - Auto-save debounce to persist changes.
  - Live visual quiz preview.
- Question media:
  - Upload file as data URL.
  - External URL input.
  - URL normalization and wrapped-URL resolution.
  - Server-side image proxy for render reliability.

## 2.4 Real-Time Gameplay

- Host game controls:
  - Start game.
  - Kick player in lobby.
  - Abort/skip current answer phase.
  - Show leaderboard.
  - Move next question.
- Player flow:
  - Enter PIN.
  - Pick nickname.
  - Pick avatar.
  - Answer timed questions.
  - See per-question result and rank context.
  - Final podium.
- Reconnection flow:
  - Manager reconnect by `clientId`.
  - Player reconnect by `clientId`.
  - State sync emitted on reconnect.

## 2.5 Admin Platform

Admin dashboard modules:

- Overview analytics (hosts, quizzes, sessions, players, trend charts).
- Hosts management:
  - Search and pagination.
  - Suspend/restore host.
  - Host detail view.
  - Delete host (with manual dependent cleanup logic).
- Quizzes management:
  - Search/status filters.
  - Approve/reject/delete.
  - Quiz detail and reports view.
- Live sessions:
  - Real-time socket monitoring namespace (`/admin`).
  - Terminate live in-memory sessions.
  - Historical DB sessions list and DB-side termination.
- Players activity list.
- Moderation queue (reports).
- Platform settings key/value management.
- Announcements create/list/delete.

## 2.6 Utility and Operations Features

- Health endpoint for DB connectivity (`/api/health`).
- Environment discovery endpoints (`/env`, `/api/env`) for web/socket URL usage.
- SEO support:
  - `sitemap.ts`
  - `robots.ts`
- Global error and not-found pages.

## 3. Tech Stack

## 3.1 Frontend

- Next.js 16.1.5 (App Router)
- React 19.2.4
- Tailwind CSS v4
- Zustand (state stores)
- React Hook Form + Zod resolver
- DnD Kit (sortable question list)
- Framer Motion (`motion`) for leaderboard animation
- `use-sound` for SFX
- `react-hot-toast`, `react-qr-code`, `react-confetti`

## 3.2 Backend and APIs

- Next.js route handlers for HTTP API layer
- Prisma ORM + PostgreSQL
- Auth.js (NextAuth v5 beta)
- Resend for contact emails
- Upstash Redis rate limiter (optional but security-recommended)
- Vercel AI SDK + `@ai-sdk/google` (Gemini generation)

## 3.3 Real-Time Layer

- Socket.IO server (dedicated package)
- Socket.IO client in web app
- Shared event typing from `@quoosh/common`

## 3.4 Tooling and DevOps

- PNPM workspaces monorepo
- TypeScript strict mode
- ESLint (Next config for web, stricter custom configs for socket/common)
- Docker multi-stage build (web + socket targets)
- Docker Compose (web + socket + postgres)
- Railway config present (currently socket-focused)

## 4. Monorepo Architecture

## 4.1 Workspace Layout

```text
/
├─ package.json
├─ pnpm-workspace.yaml
├─ Dockerfile
├─ docker-compose.yml
├─ railway.json
├─ .env.example
├─ config/
│  ├─ game.json
│  └─ quizz/example.json
└─ packages/
   ├─ common/
   │  └─ src/
   │     ├─ types/game/
   │     └─ validators/
   ├─ socket/
   │  ├─ src/
   │  │  ├─ index.ts
   │  │  ├─ env.ts
   │  │  ├─ services/
   │  │  └─ utils/
   │  └─ esbuild.config.js
   └─ web/
      ├─ prisma/
      │  ├─ schema.prisma
      │  ├─ seed.ts
      │  └─ migrations/
      └─ src/
         ├─ app/
         ├─ components/
         ├─ contexts/
         ├─ lib/
         ├─ stores/
         ├─ utils/
         ├─ hooks/
         └─ assets/
```

## 4.2 Package Responsibilities

### `packages/common`

- Owns shared game domain contracts:
  - `Player`, `Answer`, `Quizz`.
  - status names and status payload maps.
  - typed socket event contracts.
- Owns input validators used by socket server:
  - invite code validator.
  - username validator.

### `packages/socket`

- Runs Socket.IO server.
- Owns gameplay state machine (`Game` class).
- Owns active game registry and cleanup.
- Owns live session administration namespace (`/admin`).

### `packages/web`

- Hosts all pages and UI.
- Hosts all HTTP APIs.
- Owns authentication, authorization, and middleware.
- Owns Prisma schema/migrations/seeding.
- Owns dashboard, builder, game UI, and admin UI.

## 5. Frontend Application Architecture (`@quoosh/web`)

## 5.1 Route Segments and UI Areas

- `(auth)` segment:
  - `/` landing page
  - `/play`
  - `/privacy`
  - `/terms`
- `/auth` segment:
  - `/auth/login`
  - `/auth/register`
  - `/auth/google-redirect`
- `/dashboard` (host area):
  - quiz list
  - new quiz
  - edit quiz
- `/game`:
  - player runtime: `/game/[gameId]`
  - manager runtime: `/game/manager/[gameId]`
- `/admin`:
  - overview, hosts, quizzes, sessions, players, moderation, settings, announcements

## 5.2 Layout and Provider Design

- Root layout:
  - wraps app in `SocketProvider`.
  - mounts toaster and chatbot globally.
- `(auth)/layout`:
  - ensures socket connection for non-landing routes.
  - shows loading state while connecting.
- `dashboard/layout`:
  - includes host sidebar and session info.
  - mounts `SocketConnector` for dashboard-wide socket connection.
- `admin/(dashboard)/layout`:
  - server-side auth context in sidebar.
  - admin navigation shell.
- `game/layout`:
  - enforces socket connect on game routes.

## 5.3 State Management

- `useManagerStore`:
  - manager gameId, status, players.
- `usePlayerStore`:
  - player profile, gameId, status, points.
- `useQuestionStore`:
  - current/total question indicator for header badge.

## 5.4 Socket Client Context

- `SocketProvider`:
  - generates/persists `client_id` in localStorage.
  - fetches `/env` for URL configuration.
  - initializes socket with `NEXT_PUBLIC_SOCKET_URL`.
  - exposes `connect`, `disconnect`, `reconnect`.
- `useEvent` helper:
  - typed event binding with stable callback refs.

## 5.5 Media URL Reliability Pipeline

- `utils/image.ts`:
  - unwraps wrapped URLs (`imgurl`, `mediaurl`, `q` patterns).
  - normalizes encoded URLs.
  - supports data URLs.
  - creates renderable proxy path.
- `/api/images/proxy`:
  - fetches remote media server-side.
  - validates `image/*` response type.
  - rejects oversized payloads (>8 MB).
  - returns cached proxy response for client rendering.
- UI components use `getRenderableImageSrc(...)` for both preview and gameplay.

## 6. API Layer (Complete Endpoint Catalog)

All endpoints below are under `packages/web/src/app/api` unless stated otherwise.

## 6.1 Auth and Public Utility

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET`,`POST` | `/api/auth/[...nextauth]` | Public | Auth.js handlers |
| `GET` | `/api/health` | Public | DB health check |
| `GET` | `/api/env` | Public | Exposes web/socket URLs |
| `GET` | `/env` | Public | Alias of `/api/env` |
| `GET` | `/api/images/proxy?url=...` | Public | Proxy remote image links |
| `POST` | `/api/contact` | Public | Send contact form via Resend |
| `POST` | `/api/creators/register` | Public | Host registration |

## 6.2 Host Quiz APIs

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/quizzes` | Host session | List host quizzes |
| `POST` | `/api/quizzes` | Host session | Create quiz metadata |
| `GET` | `/api/quizzes/[id]` | Owner host | Fetch quiz with ordered questions |
| `PATCH` | `/api/quizzes/[id]` | Owner host | Update title/subject/questions in transaction |
| `DELETE` | `/api/quizzes/[id]` | Owner host | Delete quiz |
| `POST` | `/api/quizzes/[id]/host` | Owner host | Build quiz payload for socket host |
| `POST` | `/api/quizzes/generate` | Host session | AI-generated questions via Gemini |

## 6.3 Admin APIs

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/admin/overview` | Admin | Global metrics and trends |
| `GET` | `/api/admin/hosts` | Admin | Host list/search |
| `GET` | `/api/admin/hosts/[id]` | Admin | Host detail |
| `PATCH` | `/api/admin/hosts/[id]` | Admin | Suspend/restore host |
| `DELETE` | `/api/admin/hosts/[id]` | Admin | Delete host and dependencies |
| `GET` | `/api/admin/quizzes` | Admin | Quiz list/filter |
| `GET` | `/api/admin/quizzes/[id]` | Admin | Quiz detail |
| `PATCH` | `/api/admin/quizzes/[id]` | Admin | Update quiz metadata/status |
| `DELETE` | `/api/admin/quizzes/[id]` | Admin | Delete quiz |
| `GET` | `/api/admin/sessions` | Admin | Session history list |
| `GET` | `/api/admin/sessions/[id]` | Admin | Session detail with answers |
| `PATCH` | `/api/admin/sessions/[id]` | Admin | Terminate persisted session |
| `GET` | `/api/admin/players` | Admin | Player records list |
| `GET` | `/api/admin/moderation` | Admin | Report queue list |
| `PATCH` | `/api/admin/moderation` | Admin | Resolve/dismiss report |
| `GET` | `/api/admin/settings` | Admin | Read platform settings |
| `POST` | `/api/admin/settings` | Admin | Upsert platform settings |
| `GET` | `/api/admin/announcements` | Admin | List announcements |
| `POST` | `/api/admin/announcements` | Admin | Create announcement |
| `DELETE` | `/api/admin/announcements/[id]` | Admin | Delete announcement |

## 6.4 Security Boundaries

- Page protection:
  - middleware protects `/dashboard` (must be logged in).
  - middleware rewrites unauthorized `/admin*` access to real 404.
- API protection:
  - `requireHost()` and `requireAdmin()` helpers.
  - some routes use direct role checks from `auth()`.

## 7. Real-Time Architecture (`@quoosh/socket`)

## 7.1 Runtime Model

- One socket process maintains all live games in memory.
- Each game has:
  - generated `gameId`
  - generated numeric `inviteCode`
  - manager identity (socket + persistent clientId)
  - player collection
  - current round state
  - live leaderboard snapshot
- No Redis adapter or horizontal session sharing is currently implemented.

## 7.2 Game Lifecycle

1. Manager emits `manager:hostDirect` with password + quiz JSON.
2. Socket server validates admin secret and quiz payload.
3. New `Game` instance emits `manager:gameCreated` with `{ gameId, inviteCode }`.
4. Players join by invite code and then login with username/avatar.
5. Manager starts game, progression runs by status broadcasts.
6. Players answer; points derived from answer latency.
7. Manager sees response distribution, then leaderboard.
8. Final question completes and `FINISHED` podium is broadcast.

## 7.3 Status State Machine

Shared statuses (`STATUS`):

- `SHOW_ROOM`
- `SHOW_START`
- `SHOW_PREPARED`
- `SHOW_QUESTION`
- `SELECT_ANSWER`
- `SHOW_RESULT`
- `SHOW_RESPONSES`
- `SHOW_LEADERBOARD`
- `FINISHED`
- `WAIT`

## 7.4 Scoring Logic

Function: `timeToPoint(startTime, seconds)`

- Starts from 1000.
- Deducts proportionally to elapsed time.
- Clamps at minimum 0.
- Correctness is evaluated against question solution index.

## 7.5 Reconnection Logic

- `clientId` is the durable identity key for reconnect.
- Manager reconnect:
  - blocked if manager already connected.
  - receives prior status, player list, and question progress.
- Player reconnect:
  - blocked if same player already connected.
  - old socket id swapped with new id in player state/status map.

## 7.6 Registry and Cleanup

- Registry tracks:
  - active `games`.
  - `emptyGames` where manager disconnected.
- Cleanup worker:
  - runs every 60 seconds.
  - removes empty games older than 5 minutes.
- If manager disconnects before game start:
  - room is reset and removed immediately.

## 7.7 Admin Socket Namespace

Namespace: `/admin`

- Requires auth secret (`ADMIN_SOCKET_SECRET`) via handshake.
- Emits serialized live sessions.
- Supports:
  - `admin:getSessions`
  - `admin:terminateSession`
- Broadcast refresh interval: every 5 seconds while admin clients are connected.

## 8. Shared Contract Layer (`@quoosh/common`)

Shared package contents:

- `types/game/index.ts`: domain entities (`Player`, `Answer`, `Quizz`).
- `types/game/status.ts`: status constants + payload maps.
- `types/game/socket.ts`: typed client/server socket events.
- `validators/auth.ts`: invite code and username validation.

This package prevents event drift between frontend and socket backend.

## 9. Database Design (Prisma + PostgreSQL)

## 9.1 ORM and Source of Truth

- Schema: `packages/web/prisma/schema.prisma`
- Provider: PostgreSQL
- Client: Prisma Client JS

## 9.2 Entity Relationship Overview

```text
User (HOST/ADMIN)
 ├─< Quiz
 │    ├─< Question
 │    │    └─< PlayerAnswer
 │    ├─< QuizSession
 │    │    ├─< PlayerSession
 │    │    └─< PlayerAnswer
 │    └─< Report
 └─< Announcement (as sender)

PlatformSetting (key/value singleton-style rows)
```

## 9.3 Model-by-Model Summary

### `User`

- Identity: `id`, `email` (unique), `name`, optional `password`.
- Access: `role` (`HOST`/`ADMIN`), `suspended`.
- Relations: quizzes, sessions, announcements.

### `Quiz`

- Core content container: `title`, `subject`, moderation `status`.
- Owner: `creatorId -> User`.
- Relations: questions, sessions, reports.

### `Question`

- Belongs to quiz.
- Stores:
  - question text
  - optional image
  - answer options array
  - solution index
  - time and cooldown
  - explicit order index

### `QuizSession`

- Persistent record for a live run:
  - `inviteCode` (unique)
  - host and quiz references
  - start/end timestamps
  - terminated flag

### `PlayerSession`

- One row per player joining a session.
- Stores nickname, avatar, score, joined timestamp.

### `PlayerAnswer`

- One row per player answer attempt per question.
- Stores answer index, correctness, points, timestamp.

### `Report`

- Moderation reports tied to quizzes.
- Status: `OPEN`, `RESOLVED`, `DISMISSED`.

### `Announcement`

- Admin broadcast messages.
- Stores title/body/sender/timestamp.

### `PlatformSetting`

- Key-value table for global admin-managed runtime settings.

## 9.4 Migrations Timeline

1. `20260301165217_init`:
   - initial `User`, `Quiz`, `Question`.
2. `20260312000000_admin_dashboard`:
   - roles, suspension, statuses, sessions, players, answers, reports, announcements, settings.
3. `20260322041603_fix_schema`:
   - converted role/status strings to PostgreSQL enums.
4. `20260322130121_google_oauth`:
   - made `User.password` optional (OAuth support).

## 9.5 Seed Data

- `prisma/seed.ts` upserts default admin:
  - email: `admin@quoosh.local`
  - password: `Admin@2026`
  - role: `ADMIN`

Production note: rotate these credentials immediately.

## 10. Environment Variables (Full Reference)

Source references:

- `.env.example`
- `packages/web/src/env.ts`
- `packages/socket/src/env.ts`
- direct `process.env.*` usages in code

| Variable | Used by | Required | Purpose |
|---|---|---|---|
| `DATABASE_URL` | Prisma/web | Yes | PostgreSQL connection |
| `AUTH_SECRET` | Auth.js | Yes (or `NEXTAUTH_SECRET`) | JWT/session signing |
| `NEXTAUTH_SECRET` | Auth.js | Yes (or `AUTH_SECRET`) | Secret fallback for signing |
| `AUTH_URL` | Auth.js ecosystem | Recommended | Canonical auth URL |
| `GOOGLE_CLIENT_ID` | Auth.js | Optional | Google OAuth provider |
| `GOOGLE_CLIENT_SECRET` | Auth.js | Optional | Google OAuth provider |
| `GOOGLE_GENERATIVE_AI_API_KEY` | AI route | Optional | Gemini quiz generation |
| `RESEND_API_KEY` | Contact API | Optional (required for email sending) | Resend auth |
| `CONTACT_EMAIL` | Contact API/env | Optional | Contact inbox target |
| `NEXT_PUBLIC_APP_URL` | SEO routes | Recommended | sitemap/robots absolute base |
| `WEB_ORIGIN` | web env + socket env | Recommended | front-end origin |
| `SOCKET_PORT` | socket env | Optional | socket listen port default |
| `SOCKET_URL` | web env | Yes | server-side socket URL |
| `NEXT_PUBLIC_SOCKET_URL` | web client/admin page | Yes | browser socket URL |
| `ADMIN_SOCKET_SECRET` | socket + host route | Yes | manager/admin socket auth secret |
| `NEXT_PUBLIC_ADMIN_SOCKET_SECRET` | admin sessions page + env schema | Yes for admin live monitor | browser secret for `/admin` namespace |
| `UPSTASH_REDIS_REST_URL` | rate limiter | Optional (security recommended) | Upstash URL |
| `UPSTASH_REDIS_REST_TOKEN` | rate limiter | Optional (security recommended) | Upstash token |
| `DB_PASSWORD` | docker-compose | Docker only | local postgres password |
| `PORT` | socket runtime | Optional | process-level port override |
| `NODE_ENV` | web/socket | Runtime | env behavior toggles |

Important note:

- Contact API depends on `RESEND_API_KEY`, but this key is not currently listed in `.env.example`.

## 11. Security Architecture

## 11.1 Auth and Authorization

- Credentials login uses bcrypt compare.
- Optional email-based brute-force rate limiting through Upstash.
- Registration endpoint IP-rate-limited (if Upstash configured).
- Role checks:
  - middleware for route layer.
  - guard helpers for API layer.

## 11.2 HTTP Security Headers

Configured in Next.js headers:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-DNS-Prefetch-Control: on`

## 11.3 Socket Security

- CORS allowlist currently hardcoded in socket server to:
  - `https://quoosh.vercel.app`
  - `http://localhost:3000`
- Admin namespace requires shared secret.
- Manager hosting requires secret password match.

## 11.4 Data Handling and Sanitization

- Contact form validates and escapes user-provided HTML fields before email render.
- Media proxy validates image content-type and payload size.

## 11.5 Privacy Surface

- Players can join without creating user accounts.
- Session gameplay data models exist in DB schema.
- Legal pages are present (`privacy`, `terms`) as static content.

## 12. Deployment and Runtime Topology

## 12.1 Local Development

Monorepo scripts:

- `pnpm dev`: run all workspace dev servers.
- `pnpm dev:web`: web only.
- `pnpm dev:socket`: socket only.

Default local ports:

- Web: `3000`
- Socket: `3001`
- Postgres (compose): `5432`

## 12.2 Docker Compose Deployment

`docker-compose.yml` services:

- `web` (Dockerfile target `web`)
- `socket` (Dockerfile target `socket`)
- `db` (`postgres:16-alpine`)

Dependency wiring:

- web depends on DB healthcheck.
- both app services read from `.env`.

## 12.3 Multi-Stage Dockerfile

Stages:

1. `base`: node+pnpm setup
2. `deps`: install workspace deps and prisma context
3. `builder`: install, generate prisma client, build all packages
4. `web`: copy standalone Next output, serve on 3000
5. `socket`: copy esbuild bundle, serve on 3001

## 12.4 Railway

- `railway.json` is configured for Dockerfile-based build with socket start command.
- Current Railway config appears focused on socket runtime (`node dist/index.cjs`).

## 13. Build, Scripts, and Tooling

## 13.1 Root Scripts

- `dev`
- `dev:web`
- `dev:socket`
- `build`
- `start`
- `clean`
- `lint`

## 13.2 Web Scripts

- `next dev --turbo`
- `next build`
- `next start`
- `eslint`
- `postinstall` Prisma generate

## 13.3 Socket Scripts

- `tsx watch src/index.ts`
- `node esbuild.config.js`
- `node dist/index.cjs`
- `eslint`

## 13.4 Quality Status

- No automated test suite scripts are currently defined.
- Linting is present across packages.
- TypeScript strict mode is enabled.

## 14. Detailed Directory Guide ("What contains what")

## 14.1 Root

- `package.json`: workspace scripts.
- `pnpm-workspace.yaml`: workspace package declaration.
- `Dockerfile`, `docker-compose.yml`, `railway.json`: deployment.
- `.env.example`: environment variable template.
- `config/`: legacy quiz/game config examples.
- `README.md`: main project readme.

## 14.2 `packages/common/src`

- `types/game/index.ts`: foundational game entities.
- `types/game/status.ts`: status enum-like constants + payload maps.
- `types/game/socket.ts`: typed event contracts for socket client/server.
- `validators/auth.ts`: invite/username validation.

## 14.3 `packages/socket/src`

- `index.ts`: server bootstrap, event handlers, admin namespace.
- `env.ts`: env schema and runtime extraction.
- `services/game.ts`: gameplay engine.
- `services/registry.ts`: room registry and cleanup timer.
- `utils/game.ts`: helpers (`withGame`, code generation, scoring).
- `utils/sleep.ts`: async delay helper.

## 14.4 `packages/web/prisma`

- `schema.prisma`: data model source of truth.
- `migrations/*`: schema evolution history.
- `seed.ts`: admin bootstrap.

## 14.5 `packages/web/src/lib`

- `auth.ts`: Auth.js config and callbacks.
- `db.ts`: Prisma singleton.
- `adminGuard.ts`: `requireHost` / `requireAdmin`.
- `ratelimit.ts`: Upstash-based optional rate limiting.

## 14.6 `packages/web/src/contexts`

- `socketProvider.tsx`: shared socket client + connect lifecycle.

## 14.7 `packages/web/src/stores`

- `manager.tsx`: manager runtime state.
- `player.tsx`: player runtime state.
- `question.tsx`: question progress indicator state.

## 14.8 `packages/web/src/components`

- `quiz-builder/*`: full editor (manual/json/AI/reorder/preview).
- `game/join/*`: PIN and player onboarding.
- `game/states/*`: all runtime screens by status.
- `dashboard/*`: host dashboard cards/nav/actions.
- `admin/*`: admin shell and stats UI.
- `ui/*`: shared layout shells.
- `QuooshChat.tsx`: on-page FAQ assistant.

## 14.9 `packages/web/src/utils`

- `constants.ts`: state-component maps, sound constants, button labels.
- `image.ts`: URL normalization + render path resolution.
- `avatars.ts`: avatar registry and resolver.
- `score.ts`: response percentage utility.
- `createStatus.ts`: typed status object constructor.

## 14.10 `packages/web/src/app`

- `app/api/*`: server endpoints.
- `app/(auth)/*`: landing/play/legal pages.
- `app/auth/*`: login/register/google redirect.
- `app/dashboard/*`: host workflow.
- `app/game/*`: live game screens.
- `app/admin/*`: admin panels.
- `app/layout.tsx`: root app composition.
- `app/globals.css`: full style and animation layer.

## 15. End-to-End Data Flows

## 15.1 Host Builds and Saves Quiz

1. User edits in `ManualTab` or imports/generates questions.
2. Frontend validates via Zod.
3. Debounced save triggers `PATCH /api/quizzes/[id]`.
4. API transaction replaces question rows atomically.
5. Builder refetches fresh quiz state.

## 15.2 Host Starts Live Session

1. Edit page calls `POST /api/quizzes/[id]/host`.
2. API validates ownership and returns host payload + socket secret.
3. Frontend emits `manager:hostDirect`.
4. Socket server creates game and emits `manager:gameCreated`.
5. Manager UI navigates to `/game/manager/[gameId]`.

## 15.3 Player Joins and Plays

1. Player enters PIN at `/play`.
2. Client emits `player:join`.
3. Server emits `game:successRoom` with gameId.
4. Player chooses nickname/avatar and emits `player:login`.
5. Server admits player and emits `game:successJoin`.
6. Live status updates continue through question flow until podium.

## 15.4 Admin Monitors Live Sessions

1. Admin sessions page connects to socket namespace `/admin` with secret.
2. Socket emits `admin:sessions` snapshots.
3. Admin can emit `admin:terminateSession` for hard termination.
4. DB history view is read from `/api/admin/sessions`.

## 16. Current Implementation Notes and Gaps

These are implementation realities from current code (not hypothetical):

1. Live game state is in-memory in socket server.
   - Horizontal scale requires sticky routing or shared state store.
2. Database session/report schemas are present, but writes from socket runtime are not implemented in current socket package.
   - Admin history/moderation views depend on DB rows existing.
3. `api/chat` folder exists but has no route file.
4. Contact email API uses `RESEND_API_KEY`, but `.env.example` does not include it.
5. No automated tests are currently defined in package scripts.
6. License file is not present in repo root (despite legal references in UI).

## 17. Suggested Next Technical Milestones

1. Implement durable gameplay persistence from socket runtime:
   - write `QuizSession`, `PlayerSession`, and `PlayerAnswer` records.
2. Add test strategy:
   - unit tests for validators/utilities,
   - integration tests for API routes,
   - gameplay event flow tests for socket service.
3. Introduce distributed real-time strategy:
   - Redis adapter for Socket.IO,
   - shared game state or session orchestration.
4. Harden env management:
   - sync `.env.example` with actual runtime keys,
   - add startup validation for missing critical keys.
5. Add observability:
   - structured logs,
   - request tracing and metrics dashboards.
6. Add security hardening:
   - stronger image proxy SSRF controls (host allowlist/blocklist),
   - configurable CORS origins via env.

## 18. File Index for Fast Navigation

- Root architecture and setup: `README.md`
- DB schema: `packages/web/prisma/schema.prisma`
- Socket engine: `packages/socket/src/services/game.ts`
- Socket registry: `packages/socket/src/services/registry.ts`
- Socket entrypoint: `packages/socket/src/index.ts`
- Auth config: `packages/web/src/lib/auth.ts`
- Host quiz APIs: `packages/web/src/app/api/quizzes/*`
- Admin APIs: `packages/web/src/app/api/admin/*`
- Quiz editor UI: `packages/web/src/components/quiz-builder/*`
- Game runtime UI: `packages/web/src/components/game/states/*`
- Web socket client context: `packages/web/src/contexts/socketProvider.tsx`
- Shared socket contracts: `packages/common/src/types/game/socket.ts`

---

This document is intended to be a living architecture reference. Update it whenever core routes, schema, event contracts, or deployment topology changes.
