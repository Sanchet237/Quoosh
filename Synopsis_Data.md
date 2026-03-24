# Quoosh Synopsis Data (Codebase-Verified)

> Scope note: This report is based only on the current repository contents. Where data is missing, it is explicitly marked **"Not found in codebase"**.

---

### 1. PROJECT IDENTITY

| Item | Value |
|---|---|
| Project name (exact) | `quoosh` (root `package.json`) |
| Branded name in UI/docs | `Quoosh` |
| Version (packages/web/package.json) | `1.1.0` |
| Repository URL | `https://github.com/Sanchet237/Quoosh` |
| Live web URL | `https://quoosh.vercel.app` (hardcoded in Socket.IO CORS allowlist) |
| Live socket URL | **Not found in codebase** |
| Database provider | `postgresql` (`packages/web/prisma/schema.prisma`) |
| Database region | **Not found in codebase** |
| Academic submission details | **Not found in codebase** |

---

### 2. EXACT TECH STACK WITH VERSIONS

Format: `Package Name | Version | Purpose | Used in`

#### Frontend frameworks and libraries

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| next | 16.1.5 | App framework (SSR/Route Handlers/App Router) | `packages/web` |
| react | 19.2.4 | UI runtime | `packages/web` |
| react-dom | 19.2.4 | React DOM renderer | `packages/web` |
| ky | ^1.14.3 | HTTP client | `packages/web` |
| clsx | ^2.1.1 | Classname composition | `packages/web` |
| lucide-react | ^0.575.0 | Icon library | `packages/web` |
| motion | ^12.29.2 | Animations | `packages/web` |
| react-confetti | ^6.4.0 | Podium confetti effect | `packages/web` |
| react-qr-code | ^2.0.18 | Invite QR rendering | `packages/web` |
| use-sound | ^5.0.0 | SFX playback | `packages/web` |

#### Backend / API libraries

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| @t3-oss/env-nextjs | ^0.13.10 | Typed env validation (web) | `packages/web` |
| @t3-oss/env-core | ^0.13.10 | Typed env validation (socket) | `packages/socket` |
| dayjs | ^1.11.19 | Time math in registry cleanup | `packages/socket` |
| ky | ^1.14.3 | Server/client calls from web code | `packages/web` |
| zod | ^4.3.6 | Runtime schema validation | `packages/web`, `packages/socket`, `packages/common` |

#### Authentication

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| next-auth | 5.0.0-beta.30 | Auth.js integration | `packages/web` |
| bcryptjs | ^3.0.3 | Password hashing/verification | `packages/web` |
| @types/bcryptjs | ^3.0.0 | TS typings for bcryptjs | `packages/web` (dev) |

#### Database and ORM

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| prisma | ^5.22.0 | ORM CLI/migrations/client generation | `packages/web` (dev) |
| @prisma/client | ^5.22.0 | Prisma client runtime import | `packages/web` (dev dependency declaration) |

#### Real-time / WebSocket

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| socket.io | ^4.8.3 | Socket server + shared typings package dep | `packages/socket`, `packages/common` |
| socket.io-client | ^4.8.3 | Browser/admin socket clients | `packages/web` |

#### AI and ML

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| ai | ^6.0.116 | Vercel AI SDK primitives | `packages/web` |
| @ai-sdk/google | ^3.0.43 | Gemini provider for AI quiz generation | `packages/web` |

#### Email

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| resend | ^6.9.4 | Contact-form email sending | `packages/web` |

#### Rate limiting

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| @upstash/ratelimit | ^2.0.8 | Sliding-window rate limiting | `packages/web` |
| @upstash/redis | ^1.37.0 | Upstash Redis client | `packages/web` |

#### State management

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| zustand | ^5.0.10 | Client game/session stores | `packages/web` |

#### UI and styling

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| tailwindcss | ^4.2.2 | Utility-first CSS | `packages/web` (dev) |
| @tailwindcss/postcss | ^4.1.18 | Tailwind PostCSS plugin | `packages/web` (dev) |
| postcss | ^8.5.8 | CSS transform pipeline | `packages/web` (dev) |
| autoprefixer | ^10.4.27 | Vendor prefixing | `packages/web` (dev) |

#### Form handling

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| react-hook-form | ^7.71.2 | Form state/validation binding | `packages/web` |
| @hookform/resolvers | ^5.2.2 | Resolver bridge for Zod | `packages/web` |
| yup | ^1.7.1 | Declared schema lib dependency | `packages/web` |

#### Drag/drop and editor UX

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| @dnd-kit/core | ^6.3.1 | Drag context/sensors | `packages/web` |
| @dnd-kit/sortable | ^10.0.0 | Sortable list behavior | `packages/web` |
| @dnd-kit/utilities | ^3.2.2 | DnD utilities (CSS transforms) | `packages/web` |

#### Shared/internal workspace packages

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| @quoosh/common | workspace:* | Shared game types + validators | `packages/web`, `packages/socket` |
| @quoosh/socket | workspace:* | Imported typings/package transpilation target | `packages/web` |

#### Dev tools and build tools

| Package Name | Version | Purpose | Used in |
|---|---|---|---|
| concurrently | ^9.2.1 | Parallel workspace scripts | root |
| dotenv-cli | ^11.0.0 | Inject `.env` into script execution | root |
| typescript | ^5.9.3 | TypeScript compiler | root, `packages/web` (dev), `packages/common` (dev) |
| tsx | ^4.21.0 | TS runtime (socket dev watch) | `packages/socket` (dev) |
| esbuild | ^0.27.2 | Socket bundle build | `packages/socket` (dev) |
| eslint | ^9.39.2 | Linting | `packages/web` (dev), `packages/socket` (dev), `packages/common` (dev) |
| @eslint/js | ^9.39.4 / ^9.39.2 | ESLint config presets | `packages/web` (dev), `packages/socket` (dev), `packages/common` (dev) |
| @eslint/eslintrc | ^3.3.3 | ESLint config compatibility | `packages/web` (dev) |
| eslint-config-next | 16.1.5 | Next.js lint config | `packages/web` (dev) |
| @next/eslint-plugin-next | 16.1.5 | Next lint plugin | `packages/web` (dev) |
| eslint-plugin-react | ^7.37.5 | React lint rules | `packages/web` (dev) |
| eslint-plugin-react-hooks | ^7.0.1 | Hooks lint rules | `packages/web` (dev) |
| globals | ^17.2.0 | Global variable sets for linting | `packages/web` (dev), `packages/socket` (dev), `packages/common` (dev) |
| prettier | ^3.8.1 | Code formatting | `packages/web` (dev) |
| prettier-plugin-tailwindcss | ^0.7.2 | Tailwind class sorting | `packages/web` (dev) |
| typescript-eslint | ^8.54.0 | ESLint TypeScript tooling | `packages/web` (dev), `packages/socket` (dev), `packages/common` (dev) |
| @types/node | ^25.0.10 | Node typings | `packages/web` (dev), `packages/socket` (dev), `packages/common` (dev) |
| @types/react | ^19.2.10 | React typings | `packages/web` (dev) |
| @types/react-dom | ^19.2.3 | React DOM typings | `packages/web` (dev) |

#### Testing (if any)

`Not found in codebase` (no test framework dependency declared in the four package manifests).

---

### 3. ARCHITECTURE

#### 3.1 Monorepo structure

| Package | Version | Purpose |
|---|---|---|
| root (`quoosh`) | Not found in codebase (no `version` at root) | Workspace orchestration scripts (`pnpm -r`, dotenv bootstrap, parallel dev/build/start) |
| `@quoosh/web` | 1.1.0 | Next.js app (UI + App Router APIs + auth + Prisma access) |
| `@quoosh/socket` | 1.1.0 | Dedicated Socket.IO game server (in-memory live game runtime) |
| `@quoosh/common` | 1.1.0 | Shared TS types (`Status`, socket event contracts) + Zod validators |

#### 3.2 Port configuration

| Port | Service | Source |
|---|---|---|
| `3000` | Web app (`next` / standalone server) | `Dockerfile`, `docker-compose.yml`, web scripts |
| `3001` | Socket server | socket env default, docker-compose socket mapping |
| `5432` | Postgres in compose | `docker-compose.yml` |
| `5433` | Local DB host in current `.env` | `.env` `DATABASE_URL` |

#### 3.3 How the web app and socket server communicate

1. Browser `SocketProvider` calls `GET /env` (or `/api/env` alias) to fetch `{ webUrl, socketUrl }`.
2. Socket client connection is created with `io(process.env.NEXT_PUBLIC_SOCKET_URL, { auth: { clientId } })`.
3. `webUrl` from `/env` is used in manager room UI for join links/QR (`webUrl?pin=...`).
4. Socket server CORS is hardcoded to:
   - `https://quoosh.vercel.app`
   - `http://localhost:3000`
   with credentials enabled.
5. `WEB_ORIGIN` exists in env schemas and `/env` output, but current socket CORS config does not consume it.

#### 3.4 How quiz data flows from DB to socket server

Current implemented flow (direct JSON hosting):

1. Quizzes are persisted in PostgreSQL via Prisma (`Quiz` + `Question` tables).
2. Host clicks **Host**, web calls `POST /api/quizzes/[id]/host`.
3. Route loads host-owned quiz from DB (`where: { id, creatorId: session.user.id }`), orders questions, transforms shape for socket runtime, and returns:
   - `success`
   - `quiz` object
   - `managerPassword` (`ADMIN_SOCKET_SECRET`)
4. Frontend emits `manager:hostDirect` with `{ password, quiz }`.
5. Socket server validates password, instantiates `new Game(io, socket, quiz)`, stores it in `Registry`.

File-based bridge status:

- `game:create` file-based path is explicitly disabled in socket server (`"Direct JSON hosting is required; file-based quizzes are disabled"`).
- Existing `config/quizz/_hosted_*.json` files are present in repository, but runtime writing from `/api/quizzes/[id]/host` is **not implemented in current code**.

Design reason in current code:

- Removes runtime dependency on file writes and uses direct in-memory object handoff.

Limitations:

- No persisted session/answer writes from socket runtime to Prisma were found.
- Manager password is returned to browser in host response.

---
### 4. DATABASE SCHEMA

#### Provider and connection strategy

- Provider: `postgresql`
- URL: `env("DATABASE_URL")`
- Prisma client strategy in app runtime: singleton on `globalThis` in non-production (`packages/web/src/lib/db.ts`).

#### Enums

| Enum | Values |
|---|---|
| `Role` | `HOST`, `ADMIN` |
| `QuizStatus` | `PENDING`, `APPROVED`, `REJECTED` |
| `ReportStatus` | `OPEN`, `RESOLVED`, `DISMISSED` |

#### Models (fields, relations, indexes)

##### `User`
- Fields:
  - `id String @id @default(cuid())`
  - `email String @unique`
  - `name String`
  - `password String?`
  - `role Role @default(HOST)`
  - `suspended Boolean @default(false)`
  - `createdAt DateTime @default(now())`
  - `quizzes Quiz[]`
  - `sessions QuizSession[]`
  - `announcements Announcement[]`
- Relations:
  - `Quiz.creator` via `creatorId`
  - `QuizSession.host` via `hostId`
  - `Announcement.admin` via `sentBy`
- Indexes:
  - Primary key on `id`
  - Unique index on `email`

##### `Quiz`
- Fields:
  - `id String @id @default(cuid())`
  - `title String`
  - `subject String`
  - `status QuizStatus @default(APPROVED)`
  - `creatorId String`
  - `createdAt DateTime @default(now())`
  - `updatedAt DateTime @updatedAt`
  - `questions Question[]`
  - `sessions QuizSession[]`
  - `reports Report[]`
- Relations:
  - `creator User @relation(fields: [creatorId], references: [id], onDelete: Cascade)`
- Indexes:
  - Primary key on `id`

##### `Question`
- Fields:
  - `id String @id @default(cuid())`
  - `quizId String`
  - `text String`
  - `image String?`
  - `answers String[]`
  - `solution Int`
  - `time Int @default(20)`
  - `cooldown Int @default(5)`
  - `order Int`
  - `playerAnswers PlayerAnswer[]`
- Relations:
  - `quiz Quiz @relation(fields: [quizId], references: [id], onDelete: Cascade)`
  - `PlayerAnswer.question` via `questionId`
- Indexes:
  - Primary key on `id`

##### `QuizSession`
- Fields:
  - `id String @id @default(cuid())`
  - `inviteCode String @unique`
  - `hostId String`
  - `quizId String`
  - `startedAt DateTime @default(now())`
  - `endedAt DateTime?`
  - `terminated Boolean @default(false)`
  - `playerSessions PlayerSession[]`
  - `playerAnswers PlayerAnswer[]`
- Relations:
  - `host User @relation(fields: [hostId], references: [id])`
  - `quiz Quiz @relation(fields: [quizId], references: [id])`
- Indexes:
  - Primary key on `id`
  - Unique index on `inviteCode`

##### `PlayerSession`
- Fields:
  - `id String @id @default(cuid())`
  - `sessionId String`
  - `nickname String`
  - `avatar String?`
  - `score Int @default(0)`
  - `joinedAt DateTime @default(now())`
  - `answers PlayerAnswer[]`
- Relations:
  - `session QuizSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)`
  - `PlayerAnswer.player` via `playerSessionId`
- Indexes:
  - Primary key on `id`

##### `PlayerAnswer`
- Fields:
  - `id String @id @default(cuid())`
  - `sessionId String`
  - `playerSessionId String`
  - `questionId String`
  - `answerId Int`
  - `correct Boolean`
  - `points Int`
  - `answeredAt DateTime @default(now())`
- Relations:
  - `session QuizSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)`
  - `player PlayerSession @relation(fields: [playerSessionId], references: [id], onDelete: Cascade)`
  - `question Question @relation(fields: [questionId], references: [id], onDelete: Cascade)`
- Indexes:
  - Primary key on `id`

##### `Report`
- Fields:
  - `id String @id @default(cuid())`
  - `quizId String`
  - `reason String`
  - `reportedBy String`
  - `status ReportStatus @default(OPEN)`
  - `adminNote String?`
  - `createdAt DateTime @default(now())`
  - `resolvedAt DateTime?`
- Relations:
  - `quiz Quiz @relation(fields: [quizId], references: [id], onDelete: Cascade)`
- Indexes:
  - Primary key on `id`

##### `Announcement`
- Fields:
  - `id String @id @default(cuid())`
  - `title String`
  - `body String`
  - `sentBy String`
  - `createdAt DateTime @default(now())`
  - `admin User @relation(fields: [sentBy], references: [id])`
- Indexes:
  - Primary key on `id`

##### `PlatformSetting`
- Fields:
  - `key String @id`
  - `value String`
  - `updatedAt DateTime @updatedAt`
- Indexes:
  - Primary key on `key`

#### Migration count and names

- Count: `4`
- Names:
  1. `20260301165217_init`
  2. `20260312000000_admin_dashboard`
  3. `20260322041603_fix_schema`
  4. `20260322130121_google_oauth`

---

### 5. AUTHENTICATION SYSTEM

#### Core config

- Auth.js package/version: `next-auth@5.0.0-beta.30`
- Session strategy: `jwt`
- Session `maxAge`: `60*60*24*7 = 604800` seconds = `7 days`
- Session cookie options:
  - `httpOnly: true`
  - `sameSite: "lax"`
  - `secure: process.env.NODE_ENV === "production"`
  - `path: "/"`

#### Providers configured

- `CredentialsProvider` (always configured)
- `GoogleProvider` (only when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are present)

#### `authorize()` logic (Credentials) step-by-step

1. Reject if email/password missing.
2. If `authRatelimit` exists, apply rate limit by email key.
3. Reject on rate-limit failure (`return null`).
4. Load user by email (`prisma.user.findUnique`).
5. Reject if user not found.
6. Reject if user is suspended.
7. Reject if password is absent (Google-only account).
8. Compare submitted password via `bcrypt.compare`.
9. On success return `{ id, name, email, role }`, else `null`.

#### `signIn()` callback logic (Google) step-by-step

1. If provider is Google, require `user.email`.
2. `upsert` user by email:
   - update name if exists
   - create `{ email, name, role: "HOST" }` if not
3. Reject sign-in if resulting user is suspended.
4. Attach DB identity to auth user object:
   - `user.id = existingUser.id`
   - `(user as any).role = existingUser.role`
5. On DB error, return `false`.

#### JWT/session payload

- JWT callback sets:
  - `token.id = user.id`
  - `token.role = user.role ?? "HOST"`
- Session callback maps:
  - `session.user.id = token.id`
  - `session.user.role = token.role`

#### Role storage and access

- Stored in DB: `User.role` enum (`HOST`/`ADMIN`)
- Copied into JWT (`token.role`)
- Read in:
  - middleware (`proxy.ts`) for route gating
  - API guards (`requireAdmin`, `requireHost`)
  - frontend redirects (`/auth/google-redirect`, login role redirect)

#### bcrypt cost factor

- Host registration hash: `bcrypt.hash(password, 12)` (`/api/creators/register`)
- Seeded admin hash: `bcrypt.hash("Admin@2026", 10)` (`prisma/seed.ts`)

#### Rate limiting rules

- Registration (`/api/creators/register`):
  - `Ratelimit.slidingWindow(5, "10 m")`
  - Key: `x-forwarded-for` IP (fallback `"anonymous"`)
- Credentials login (`authorize`):
  - `Ratelimit.slidingWindow(10, "5 m")`
  - Key: email

When exceeded:

- Register route: HTTP `429`, JSON `{ error: "Too many requests. Please try again later." }`
- Login authorize: returns `null` (Auth.js handles as failed credentials; no explicit 429 response in route file)

#### `/admin` protection (exact middleware behavior)

In `src/proxy.ts`:

1. Detect `pathname.startsWith("/admin")`.
2. If no auth session: rewrite to `/not-found` with status `404`.
3. If logged in but role is not `ADMIN`: rewrite to `/not-found` with status `404`.

#### `/dashboard` protection (exact middleware behavior)

In `src/proxy.ts`:

1. Detect `pathname.startsWith("/dashboard")`.
2. If unauthenticated: redirect to `/auth/login`.
3. No role restriction beyond being authenticated.

---
### 6. API ROUTES

> `22` route files found under `packages/web/src/app/api`.

| Path | Methods | Auth Required | Rate Limited | Request Body Shape | Responses / Status | Key Business Logic |
|---|---|---|---|---|---|---|
| `/api/auth/[...nextauth]` | `GET`, `POST` (re-export) | Auth.js internal | No | Auth.js provider flows | Managed by Auth.js | Re-exports handlers from `lib/auth` |
| `/api/creators/register` | `POST` | No | Yes (`5/10m` by IP when Upstash configured) | `{ name, email, password }` (Zod) | `201` user payload, `400` validation, `409` existing email, `429` too many requests, `500` error | Creates HOST user with bcrypt hash cost 12 |
| `/api/contact` | `POST` | No | No | `{ name, email, type, message }` (Zod) | `200` success, `400` invalid body, `500` email send failure | Escapes HTML fields, sends Resend email to configured contact recipient |
| `/api/env` | `GET` (re-export) | No | No | None | `200` JSON | Alias to `/env` route |
| `/api/health` | `GET` | No | No | None | `200` db connected payload, `503` db disconnected payload | Runs `SELECT 1` via Prisma |
| `/api/images/proxy` | `GET` | No | No | Query: `url` | `200` image bytes, `400` invalid URL, `404` fetch fail, `413` >8MB, `415` non-image, `502` upstream error | Server-side image fetch/proxy with size/type checks and cache headers |
| `/api/quizzes` | `GET`, `POST` | `GET`: authenticated user; `POST`: HOST role (`requireHost`) | No | `POST` expects `{ title, subject }` | `GET`: `200` list or `401`; `POST`: `200` created or `400/401/403/500` | Host quiz listing and creation |
| `/api/quizzes/[id]` | `GET`, `PATCH`, `DELETE` | Yes (owner only) | No | `PATCH`: optional `{ title, subject, questions[] }` with Zod | `401` unauthorized, `404` not found, `400` invalid patch body, `500` internal, success JSON on valid ops | Owner-checked CRUD; transaction-based quiz + questions replacement |
| `/api/quizzes/[id]/host` | `POST` | Yes (owner only) | No | No JSON body required | `401` unauthorized, `404` not found, `400` no questions, `500` error, `200` `{ success, quiz, managerPassword }` | Transforms DB quiz to socket runtime payload for direct hosting |
| `/api/quizzes/generate` | `POST` | HOST role (`requireHost`) | No | `{ messages }` | `200` generated JSON, `500` errors | Calls Gemini model via Vercel AI SDK, strips code fences, parses JSON |
| `/api/admin/overview` | `GET` | ADMIN | No | None | `200` analytics JSON; guard may return `401/403` | Counts hosts/quizzes/sessions/players, plus weekly/monthly raw SQL aggregates |
| `/api/admin/hosts` | `GET` | ADMIN | No | Query: `search`, `page` | `200` paginated host list; guard `401/403` | Host search + pagination with quiz/session counts |
| `/api/admin/hosts/[id]` | `GET`, `PATCH`, `DELETE` | ADMIN | No | `PATCH`: `{ suspended }` | `GET 200/404`, `PATCH 200`, `DELETE 204`; guard `401/403` | Host detail, suspend/restore, manual cascade delete of dependent records then user delete |
| `/api/admin/quizzes` | `GET` | ADMIN | No | Query: `search`, `status`, `page` | `200` paginated quiz list; guard `401/403` | Quiz moderation listing with creator and counts |
| `/api/admin/quizzes/[id]` | `GET`, `PATCH`, `DELETE` | ADMIN | No | `PATCH`: subset of `{ status, title, subject }` | `GET 200/404`, `PATCH 200`, `DELETE 204`; guard `401/403` | Quiz detail, admin status/title/subject updates, delete |
| `/api/admin/sessions` | `GET` | ADMIN | No | Query: `page`, `active=true` | `200` paginated session list; guard `401/403` | Lists historical/live session records in DB |
| `/api/admin/sessions/[id]` | `GET`, `PATCH` | ADMIN | No | `PATCH`: `{ action: "terminate" }` | `GET 200/404`, `PATCH 200` or `400` unknown action; guard `401/403` | Session detail and DB-level terminate flagging |
| `/api/admin/players` | `GET` | ADMIN | No | Query: `sessionId`, `search`, `page` | `200` paginated player sessions; guard `401/403` | Player session analytics/search |
| `/api/admin/moderation` | `GET`, `PATCH` | ADMIN | No | `PATCH`: `{ id, status, adminNote }` | `200` list/update; guard `401/403` | Report queue with status transitions and admin notes |
| `/api/admin/settings` | `GET`, `POST` | ADMIN | No | `POST`: `Record<string,string>` | `GET 200`, `POST 200 {ok:true}`; guard `401/403` | Reads defaults + stored settings; upserts platform settings |
| `/api/admin/announcements` | `GET`, `POST` | ADMIN | No | `POST`: `{ title, body }` | `GET 200`, `POST 201`, `400` missing fields; guard `401/403` | Lists and creates announcements with sender id |
| `/api/admin/announcements/[id]` | `DELETE` | ADMIN | No | None | `204`, `404`, `500`; explicit `401/403` in handler | Deletes announcement by id with Prisma not-found handling |

---
### 7. SOCKET.IO EVENT SYSTEM

#### Client ? Server events (declared contract + server behavior)

| Event | Payload Type | Server Behavior |
|---|---|---|
| `game:create` | `quizzId: string` | Intentionally disabled; emits error message about file-based quizzes being disabled |
| `manager:auth` | `password: string` | Validates against `ADMIN_SOCKET_SECRET`; on success emits empty `manager:quizzList` (legacy compatibility) |
| `manager:hostDirect` | `{ password, quiz }` | Validates password and quiz shape; creates `Game`; registers in `Registry` |
| `manager:reconnect` | `{ gameId }` | Looks up manager game by `clientId`; reconnects manager or emits reset |
| `manager:kickPlayer` | `{ gameId, playerId }` | Manager-only kick; removes player and emits reset to kicked socket |
| `manager:startGame` | `{ gameId }` | Starts quiz flow |
| `manager:abortQuiz` | `{ gameId }` | Aborts current answer cooldown |
| `manager:nextQuestion` | `{ gameId }` | Advances round if possible |
| `manager:showLeaderboard` | `{ gameId }` | Shows leaderboard or final podium |
| `player:join` | `inviteCode: string` | Validates invite code and routes player to game room stage |
| `player:login` | `{ gameId, data:{ username, avatar? } }` | Validates username, joins game as player |
| `player:reconnect` | `{ gameId }` | Reconnects player by `clientId` |
| `player:selectedAnswer` | `{ gameId, data:{ answerKey:number } }` | Stores answer with computed points and updates answer counts |

#### Server ? Client events

Custom events defined in shared contract:

- `game:status`
- `game:successRoom`
- `game:successJoin`
- `game:totalPlayers`
- `game:errorMessage`
- `game:startCooldown`
- `game:cooldown`
- `game:reset`
- `game:updateQuestion`
- `game:playerAnswer`
- `player:successReconnect`
- `player:updateLeaderboard` (declared; not emitted in current server implementation)
- `manager:successReconnect`
- `manager:quizzList`
- `manager:gameCreated`
- `manager:statusUpdate` (declared; not emitted in current server implementation)
- `manager:newPlayer`
- `manager:removePlayer`
- `manager:errorMessage`
- `manager:playerKicked`

Also includes socket built-in `connect` callback in typings.

#### Admin namespace events (`/admin`)

- Namespace: `/admin`
- Handshake auth: `socket.handshake.auth.secret === ADMIN_SOCKET_SECRET`
- On connect: emits `admin:sessions` serialized active in-memory games
- Listeners:
  - `admin:getSessions` ? emits latest `admin:sessions`
  - `admin:terminateSession` (`gameId`) ? emits `game:reset` to room, removes game, broadcasts updated `admin:sessions`
- Error event emitted: `admin:error` when game not found
- Periodic push: `admin:sessions` broadcast every `5_000 ms` while admin sockets connected

#### Socket authentication and reconnect model

- `clientId` is sent in handshake auth from browser (`SocketProvider`).
- Manager reconnect:
  - lookup by gameId + manager `clientId`
  - emits `manager:successReconnect` with game status, players, question progress
- Player reconnect:
  - lookup by gameId + player `clientId`
  - remaps old socket id to new
  - emits `player:successReconnect` with player snapshot and status

#### Registry behavior

- Singleton registry (`Registry.getInstance()`).
- Stores:
  - `games[]`
  - `emptyGames[]` with timestamp.
- On manager disconnect:
  - marks game empty.
  - if game not started, resets room and removes game immediately.
- Cleanup task:
  - interval every `60_000 ms`
  - removes empty games older than `5 minutes`.

#### Game class state management

- Holds manager identity, players list, quiz payload, current round, cooldown state.
- Broadcast model:
  - `broadcastStatus` to room
  - `sendStatus` to specific socket (manager/player-specific snapshots)
- Core lifecycle:
  - create ? wait room
  - start intro
  - prepared/question/answer windows
  - results
  - leaderboard/final podium

#### State machine (`STATUS`) and transitions

Status values:

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

Observed transitions:

1. Host UI sets `SHOW_ROOM` after `manager:gameCreated`.
2. `manager:startGame` ? `SHOW_START` ? cooldown ? round.
3. Round flow:
   - `SHOW_PREPARED` ? `SHOW_QUESTION` ? `SELECT_ANSWER`
4. End of answer window:
   - Players get `SHOW_RESULT`
   - Manager gets `SHOW_RESPONSES`
5. `manager:showLeaderboard`:
   - if last round: `FINISHED`
   - else manager gets `SHOW_LEADERBOARD`
6. `manager:nextQuestion` returns to step 3 for next question.
7. `WAIT` used for player waiting states and reconnect fallback.

#### Scoring logic

From `timeToPoint(startTime, secondes)`:

- Start at `1000` points.
- Subtract proportional elapsed time:
  - `points -= (1000 / secondes) * elapsedSeconds`
- Clamp minimum `0`.
- In result calculation:
  - points awarded only if answer is correct
  - `Math.round` applied before adding to total.

#### Cleanup task

- Registry cleanup interval: `60_000 ms`
- Empty-game timeout: `5 minutes`
- Also clears memory on process `SIGINT` and `SIGTERM`.

---
### 8. FRONTEND PAGES

| Route Path | Auth Required | Purpose | Key Components Used | Chatbot Visible |
|---|---|---|---|---|
| `/` | No | Landing page, marketing, support/contact section | Inline sections + internal contact form | Yes |
| `/play` | No | Player join/login flow entry | `game/join/Room`, `game/join/Username` | Yes |
| `/privacy` | No | Privacy policy content page | None (static content) | No |
| `/terms` | No | Terms of service content page | None (static content) | No |
| `/auth/login` | No | Host/admin login with credentials/Google | `ui/QuooshLayout` | Yes |
| `/auth/register` | No | Host registration + Google signup | `ui/QuooshLayout` | Yes |
| `/auth/google-redirect` | Session checked in page logic | Post-Google redirect to role destination | None | No |
| `/dashboard` | Yes (logged-in) | Host quiz listing and management | `dashboard/QuizCard`, `dashboard/DeleteQuizDialog` | No |
| `/dashboard/quizzes/new` | Yes (logged-in) | Create new quiz metadata | None (inline form) | No |
| `/dashboard/quizzes/[id]/edit` | Yes (logged-in, quiz-owner API checks) | Quiz builder/editor/import/AI + host action | `QuestionList`, `QuestionEditor`, `ManualTab` | No |
| `/game/[gameId]` | No route auth; gameplay state required | Player live game screen | `GameWrapper`, player state components | No |
| `/game/manager/[gameId]` | No route auth; manager socket flow required | Host live game control screen | `GameWrapper`, manager state components | No |
| `/admin` | Yes (`ADMIN` via middleware) | Redirect entry to admin overview | None | No |
| `/admin/overview` | Yes (`ADMIN`) | Admin analytics dashboard | `admin/StatCard` | No |
| `/admin/hosts` | Yes (`ADMIN`) | Host management list | Inline table/actions | No |
| `/admin/hosts/[id]` | Yes (`ADMIN`) | Host detail, suspend/restore/delete | Inline detail tables | No |
| `/admin/quizzes` | Yes (`ADMIN`) | Quiz moderation list | Inline table/actions | No |
| `/admin/quizzes/[id]` | Yes (`ADMIN`) | Quiz detail + report view + moderation actions | Inline detail cards | No |
| `/admin/sessions` | Yes (`ADMIN`) | Live session monitor + DB session history | Inline socket-based monitor | No |
| `/admin/players` | Yes (`ADMIN`) | Player activity records | Inline table | No |
| `/admin/moderation` | Yes (`ADMIN`) | Report queue resolution workflow | Inline cards/forms | No |
| `/admin/settings` | Yes (`ADMIN`) | Platform setting CRUD UI | Inline settings controls | No |
| `/admin/announcements` | Yes (`ADMIN`) | Compose/list announcements | Inline form/history list | No |
| `/not-found` | No | Custom 404 page route | `NotFoundContent` | No |
| `/unauthorized` | No | Access denied UI page | None (inline) | No |

---

### 9. KEY COMPONENTS

#### 9.1 Component inventory (all `.tsx` in `src/components`)

| Component | File Path | Props | State | Key Behavior | Pages Using It |
|---|---|---|---|---|---|
| `AdminSidebar` | `components/admin/AdminSidebar.tsx` | none | none | Admin nav links + active highlight | `admin/(dashboard)/layout` |
| `StatCard` | `components/admin/StatCard.tsx` | `label,value,sub?,icon,accent?` | none | Reusable metric tile | `/admin/overview` |
| `AnswerButton` | `components/AnswerButton.tsx` | button attrs + `icon` | none | Colored answer UI button | Indirect via game state components |
| `Button` | `components/Button.tsx` | button attrs + children | none | Shared styled button | Indirect |
| `ContactForm` | `components/ContactForm.tsx` | none | `name,email,type,message,loading,success,error` | Calls `/api/contact`; success fallback UI | Not directly imported by current pages |
| `DeleteQuizDialog` | `components/dashboard/DeleteQuizDialog.tsx` | `quizId,quizTitle,isOpen,onClose,onDeleted` | `isDeleting` | Confirm + delete quiz API call | `/dashboard` |
| `QuizCard` | `components/dashboard/QuizCard.tsx` | quiz meta + `onDelete` | `isHosting,hostError` | Hosts via `/api/quizzes/:id/host` then emits `manager:hostDirect` | `/dashboard` |
| `SidebarNav` | `components/dashboard/SidebarNav.tsx` | none | none | Dashboard nav links | `dashboard/layout` |
| `SocketConnector` | `components/dashboard/SocketConnector.tsx` | none | none | Ensures socket connects when dashboard mounts | `dashboard/layout` |
| `Form` | `components/Form.tsx` | children | none | Shared panel wrapper | Indirect |
| `ManagerPassword` | `components/game/create/ManagerPassword.tsx` | `onSubmit(password)` | `password` | Password capture + manager error toast listener | Not directly imported by current pages |
| `SelectQuizz` | `components/game/create/SelectQuizz.tsx` | `quizzList,onSelect` | `selected` | Select quiz from list and submit | Not directly imported by current pages |
| `GameWrapper` | `components/game/GameWrapper.tsx` | `statusName,onNext?,manager?` | `isDisabled` | Shared game shell; handles question progress display and manager next button | `/game/[gameId]`, `/game/manager/[gameId]` |
| `AvatarPicker` | `components/game/join/AvatarPicker.tsx` | `selected,onChange` | none | Avatar selection grid | Indirect via `/play` |
| `Room` (join) | `components/game/join/Room.tsx` | none | `invitation` | Join by PIN, auto-join by `?pin=...` | `/play` |
| `Username` | `components/game/join/Username.tsx` | none | `username,selectedAvatar` | Emits `player:login`, routes to game | `/play` |
| `Answers` | `components/game/states/Answers.tsx` | `SELECT_ANSWER` payload | `cooldown,totalAnswer` | Renders answer grid, sends selected answer, handles countdown/player-answer updates | Player + manager game pages |
| `Leaderboard` | `components/game/states/Leaderboard.tsx` | `SHOW_LEADERBOARD` payload | `displayedLeaderboard,isAnimating` | Animated leaderboard transition between old/new rankings | `/game/manager/[gameId]` |
| `Podium` | `components/game/states/Podium.tsx` | `FINISHED` payload + `onGoHome?` | `apparition` | Podium reveal sequence, confetti, SFX | Player + manager game pages |
| `Prepared` | `components/game/states/Prepared.tsx` | `SHOW_PREPARED` payload | none | Pre-question visual prep screen | Player + manager game pages |
| `Question` | `components/game/states/Question.tsx` | `SHOW_QUESTION` payload | none | Shows prompt/media and progress bar; plays show SFX | Player + manager game pages |
| `Responses` | `components/game/states/Responses.tsx` | `SHOW_RESPONSES` payload | `percentages,isMusicPlaying` | Manager response histogram + correct answer highlighting | `/game/manager/[gameId]` |
| `Result` | `components/game/states/Result.tsx` | `SHOW_RESULT` payload | none | Correct/incorrect result card and point update | `/game/[gameId]` |
| `Room` (manager state) | `components/game/states/Room.tsx` | `SHOW_ROOM` payload | `playerList,totalPlayers` | Waiting room with QR, player list, kick control | `/game/manager/[gameId]` |
| `Start` | `components/game/states/Start.tsx` | `SHOW_START` payload | `showTitle,cooldown` | Start intro and synchronized countdown | Player + manager game pages |
| `Wait` | `components/game/states/Wait.tsx` | `WAIT` payload | none | Waiting screen with loader | `/game/[gameId]` |
| `Circle` | `components/icons/Circle.tsx` | `className?,fill?` | none | SVG icon | Indirect |
| `CricleCheck` | `components/icons/CricleCheck.tsx` | `className?` | none | Correct-result icon | Indirect |
| `CricleXmark` | `components/icons/CricleXmark.tsx` | `className?` | none | Incorrect-result icon | Indirect |
| `Pentagon` | `components/icons/Pentagon.tsx` | `className?,fill?,stroke?` | none | SVG icon | Indirect |
| `Rhombus` | `components/icons/Rhombus.tsx` | `className?,fill?` | none | SVG icon | Indirect |
| `Square` | `components/icons/Square.tsx` | `className?,fill?` | none | SVG icon | Indirect |
| `Triangle` | `components/icons/Triangle.tsx` | `className?,fill?` | none | SVG icon | Indirect |
| `Input` | `components/Input.tsx` | all input attrs | none | Shared styled text input | Indirect |
| `Loader` | `components/Loader.tsx` | `className?` | none | Loader SVG component | `(auth)/layout` |
| `NotFoundContent` | `components/NotFoundContent.tsx` | none | none | Shared 404 content used by middleware rewrite + routes | `/not-found` + top-level `not-found.tsx` |
| `AITab` | `components/quiz-builder/AITab.tsx` | `onAdd(questions)` | `input,messages,isLoading,parsedQuestions,selectedIndices` | AI chat-like quiz generation + selection | Indirect via `/dashboard/quizzes/[id]/edit` |
| `ImportTab` | `components/quiz-builder/ImportTab.tsx` | `onImport(questions)` | `jsonText,error,previewData` | JSON parse/validate/import with preview | Indirect via `/dashboard/quizzes/[id]/edit` |
| `ManualTab` | `components/quiz-builder/ManualTab.tsx` | `initialData?,onSave,isSaving` | `imageMode,previewLoadFailed` | Manual question editor with react-hook-form + auto-save debounce | Indirect via `/dashboard/quizzes/[id]/edit` |
| `QuestionEditor` | `components/quiz-builder/QuestionEditor.tsx` | `activeQuestion,onSaveManual,onAddBulk,isSaving` | `activeTab` | Tabbed editor orchestration (manual/import/AI) | `/dashboard/quizzes/[id]/edit` |
| `QuestionList` | `components/quiz-builder/QuestionList.tsx` | question list + handlers | none | DnD list/reorder/select/add/delete | `/dashboard/quizzes/[id]/edit` |
| `QuizPreview` | `components/quiz-builder/QuizPreview.tsx` | `text,image,answers,time` | none | Live visual preview of question card | Not directly imported by current pages |
| `QuooshChat` | `components/QuooshChat.tsx` | none | `open,input,messages` | Floating FAQ chatbot with keyword matching and route guard | Root layout (global) |
| `Toaster` | `components/Toaster.tsx` | none | none | Global toast renderer wrapper | Root layout (global) |
| `DashboardShell` | `components/ui/DashboardShell.tsx` | `sidebar,children,mobileBrandText?` | `sidebarOpen` | Shared responsive shell for dashboard/admin sidebars | `dashboard/layout`, `admin/(dashboard)/layout` |
| `QuooshLayout` | `components/ui/QuooshLayout.tsx` | `children,showLogo?` | none | Shared auth-page centered card layout | `/auth/login`, `/auth/register` |

#### 9.2 QuooshChat.tsx (special extraction)

- Allowed exact routes:
  - `/`
  - `/auth/login`
  - `/auth/register`
- Allowed prefixes:
  - `/play`
  - `/join`
- FAQ entries: `30`
- Matching logic:
  1. Convert input to lowercase.
  2. Iterate FAQ in order.
  3. Return first answer where any keyword is included (`lower.includes(keyword)`).
  4. If no match, return fallback help message.

#### 9.3 socketProvider.tsx (special extraction)

File: `packages/web/src/contexts/socketProvider.tsx`

- Context value shape:
  - `socket: TypedSocket | null`
  - `webUrl: string | null`
  - `isConnected: boolean`
  - `clientId: string`
  - `connect(): void`
  - `disconnect(): void`
  - `reconnect(): void`
- `clientId` generation:
  - tries `localStorage.getItem("client_id")`
  - if absent, generates UUID v7 (`uuid.v7()`), stores in `localStorage`
  - fallback to fresh UUID if storage access fails
- Socket init:
  - calls `/env` to get server URLs
  - connects using `NEXT_PUBLIC_SOCKET_URL`
  - sends handshake auth `{ clientId }`
  - transport forced to websocket in client config

#### 9.4 Game state components focus

- `Wait`: waiting text + loader.
- `Room` (manager): invite PIN, QR, live player list, kick action.
- `Question`: question/media reveal with progress bar.
- `Answers`: answer selection, cooldown tracking, answer count.
- `Responses`: manager histogram + correct-answer emphasis.
- `Result`: per-player correctness and points delta.
- `Leaderboard`: animated old?new rank display.
- `Podium`: top-3 reveal sequence with confetti/audio.
- `Prepared`: pre-question staging visualization.
- `Start`: intro and synchronized countdown.

---

### 10. ENVIRONMENT VARIABLES

> Variables enumerated from `.env.example` plus `packages/web/src/env.ts` and `packages/socket/src/env.ts`.

| Variable | Package(s) Using It | Purpose | Default Value | Required/Optional | Zod Validator |
|---|---|---|---|---|---|
| `DATABASE_URL` | web (Prisma) | DB connection string | Example only in `.env.example` | Required by Prisma runtime | Not found in codebase (`env.ts`) |
| `AUTH_SECRET` | web auth | Auth.js secret (preferred) | Example in `.env.example` | Optional fallback with `NEXTAUTH_SECRET` | Not found in codebase (`env.ts`) |
| `NEXTAUTH_SECRET` | web auth | Legacy Auth.js alias | Example in `.env.example` | Optional fallback with `AUTH_SECRET` | Not found in codebase (`env.ts`) |
| `AUTH_URL` | web auth config context | Auth URL/callback base | Example in `.env.example` | Not found in codebase | Not found in codebase (`env.ts`) |
| `GOOGLE_CLIENT_ID` | web auth | Google OAuth provider | Example in `.env.example` | Optional (provider added only when both Google vars exist) | Not found in codebase (`env.ts`) |
| `GOOGLE_CLIENT_SECRET` | web auth | Google OAuth provider | Example in `.env.example` | Optional | Not found in codebase (`env.ts`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | web API generate route | Gemini API access | Example in `.env.example` | Optional globally; required for `/api/quizzes/generate` to succeed | Not found in codebase (`env.ts`) |
| `NEXT_PUBLIC_APP_URL` | web robots/sitemap | Canonical base URL | Example in `.env.example` | Optional (sitemap fallback exists) | Not found in codebase (`env.ts`) |
| `WEB_ORIGIN` | web + socket env modules | Web origin value returned by `/env` and validated in env schemas | `http://localhost:3000` in env schemas | Optional (default provided) | web: `z.string().default("http://localhost:3000")`; socket: `z.string().optional().default("http://localhost:3000")` |
| `SOCKET_PORT` | socket server | Socket listen port | `"3001"` (socket env default) | Optional (default provided) | socket: `z.string().default("3001")` |
| `SOCKET_URL` | web env module | Server-side socket URL for diagnostics/env route | No default in web env schema | Required in web env schema | web: `z.string()` |
| `NEXT_PUBLIC_SOCKET_URL` | web client | Browser socket endpoint | No default in web env schema | Required in web env schema | web: `z.string()` |
| `ADMIN_SOCKET_SECRET` | socket server + host route | Manager/admin socket secret gate | No default; must be provided | Required | socket: `z.string().min(32, ...)` |
| `NEXT_PUBLIC_ADMIN_SOCKET_SECRET` | web client/admin page | Browser-provided secret used to connect to `/admin` namespace | `""` in web env schema | Optional in schema (default `""`) | web: `z.string().default("")` |
| `CONTACT_EMAIL` | web contact route/env | Destination email for contact form | none in schema; route has fallback constant email | Optional | web: `z.string().email().optional()` |
| `UPSTASH_REDIS_REST_URL` | web ratelimit init | Upstash Redis URL for rate limiting | none | Optional (feature disabled if absent) | Not found in codebase (`env.ts`) |
| `UPSTASH_REDIS_REST_TOKEN` | web ratelimit init | Upstash Redis token for rate limiting | none | Optional (feature disabled if absent) | Not found in codebase (`env.ts`) |
| `DB_PASSWORD` | docker compose db service | Postgres container password | none | Required for compose db auth | Not found in codebase (`env.ts`) |

---
### 11. DEPLOYMENT

#### Vercel config

- `vercel.json`: **Not found in codebase**
- Next.js output mode: `standalone` in production (`next.config.mjs`)

#### Railway config (`railway.json`)

- Build:
  - builder: `DOCKERFILE`
  - dockerfile path: `Dockerfile`
  - build command: `pnpm --filter @quoosh/socket build`
- Deploy:
  - start command: `node dist/index.cjs`
  - restart policy: `ON_FAILURE`

#### Dockerfile stages

1. `base`
   - `node:20-alpine`
   - installs `openssl`
   - enables `pnpm@9`
2. `deps`
   - copies package manifests + prisma schema
   - runs `pnpm install --frozen-lockfile`
3. `builder`
   - copies source
   - sets build-time placeholder env
   - runs Prisma generate
   - runs workspace build
4. `web`
   - production Node image
   - copies Next standalone output/static/public
   - exposes `3000`
   - starts `node packages/web/server.js`
5. `socket`
   - production Node image
   - copies bundled socket `dist/index.cjs` + `config`
   - exposes `3001`
   - starts `node dist/index.cjs`

#### docker-compose services

- `web`
  - build target: `web`
  - port mapping: `3000:3000`
  - depends on healthy `db`
- `socket`
  - build target: `socket`
  - port mapping: `3001:3001`
- `db`
  - image: `postgres:16-alpine`
  - port mapping: `5432:5432`
  - volume: `postgres_data`

#### Build commands (package scripts)

- Root: `pnpm -r run build`
- Web: `next build`
- Socket: `node esbuild.config.js`
- Common: `Not found in codebase` (no `build` script)

#### Start commands (package scripts)

- Root: `pnpm -r --parallel run start`
- Web: `next start`
- Socket: `node dist/index.cjs`
- Common: `Not found in codebase` (no `start` script)

#### Node.js version required

- `README.md`: `Node.js 20+`
- Docker base images: `node:20-alpine`

---

### 12. SECURITY MEASURES

#### Password hashing

- Algorithm: `bcryptjs`
- Registration hashing: cost factor `12`
- Credentials verify: `bcrypt.compare`
- Seeded admin hashing: cost factor `10`

#### Rate limiting

- Library: `@upstash/ratelimit` with Redis backend `@upstash/redis`
- Strategy: sliding window
  - Register: `5 requests / 10 minutes` by IP
  - Credentials login: `10 attempts / 5 minutes` by email
- If Upstash env missing: rate limiting disabled (explicitly documented in code comments)

#### Session cookie security

- `httpOnly: true`
- `sameSite: "lax"`
- `secure` only in production
- path `/`

#### Route protection

- Middleware (`proxy.ts`) protects:
  - `/dashboard*`: redirect unauthenticated users to `/auth/login`
  - `/admin*`: rewrite unauthorized/non-admin users to `/not-found` with `404`
- API guards:
  - `requireAdmin()`: returns `401`/`403` `NextResponse` when role check fails
  - `requireHost()`: returns `401`/`403` when role check fails

#### CORS configuration

- Socket server CORS allowlist:
  - `https://quoosh.vercel.app`
  - `http://localhost:3000`
- Methods: `GET`, `POST`
- `credentials: true`
- `WEB_ORIGIN` exists in env schema but is not used in socket CORS setup.

#### Input validation

- Zod used in:
  - registration route
  - contact route
  - quiz patch schemas
  - invite code and username validators in `@quoosh/common`
  - env validation in web/socket env modules

#### IDOR protection

- Owner checks in host-facing quiz routes:
  - `/api/quizzes/[id]` and `/api/quizzes/[id]/host` query by both `id` and `creatorId = session.user.id`
- Admin-only routes guarded by role checks.

#### Admin namespace authentication

- Namespace `/admin` validates handshake auth secret against `ADMIN_SOCKET_SECRET`.
- Unauthorized admin socket connection fails with error `"Unauthorized"`.

#### Security headers (`next.config.mjs`)

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-DNS-Prefetch-Control: on`

#### HTML sanitization (`escapeHtml`)

- Function `escapeHtml()` in `api/contact/route.ts`
- Escapes `& < > " '`
- Applied to user-provided `name`, `email`, `type`, `message` before HTML email interpolation.

---

### 13. PERFORMANCE FEATURES

- Prisma query shaping:
  - heavy admin endpoints use `select` and constrained `include` trees
  - pagination with `skip/take`
  - parallel reads via `Promise.all`
- Atomic quiz update with Prisma transaction (`/api/quizzes/[id]` patch).
- Next.js production output mode: `standalone`.
- Turbopack dev mode present:
  - `packages/web` script `next dev --turbo`
- Socket game cleanup:
  - interval `60s`
  - empty-session eviction after `5 minutes`
- JWT stateless auth strategy:
  - no DB session store lookup per request for session retrieval.
- Image proxy cache headers:
  - `Cache-Control: public, max-age=3600, s-maxage=3600`

Caching beyond above:

- `Not found in codebase` (no broader application cache layer found).

---
### 14. FEATURES LIST

#### Host features (implemented)

- Email/password registration and login.
- Google OAuth login.
- Host dashboard listing quizzes.
- Create new quiz metadata.
- Full quiz editor:
  - manual question editing
  - drag/drop reorder
  - add/delete questions
  - media URL/file image support
  - timing/cooldown config
- JSON import with validation/preview.
- AI question generation via Gemini and selective add.
- Host live session creation (`manager:hostDirect` flow).
- In-game host controls:
  - start game
  - skip/abort answer phase
  - show leaderboard
  - next question
  - kick players
- Host reconnect support.

#### Player features (implemented)

- Join by PIN from `/play`.
- Auto-join via `?pin=...` URL.
- Username + avatar selection.
- Live synchronized game states:
  - wait/start/prepared/question/answer/result/podium
- Real-time answer counts/cooldowns.
- Reconnect support by persistent `client_id`.
- Final podium display.

#### Admin features (implemented)

- Admin-only dashboard route protection and hidden unauthorized behavior (404 rewrite).
- Overview analytics (hosts/quizzes/sessions/players + weekly/monthly charts).
- Host management:
  - list/search
  - detail
  - suspend/restore
  - permanent delete cascade flow
- Quiz management:
  - list/search/filter
  - detail
  - approve/reject
  - delete
- Session monitoring:
  - live in-memory sessions via `/admin` socket namespace
  - terminate live in-memory session
  - DB session history list + terminate flagging
- Player records list/search.
- Moderation queue with resolve/dismiss and admin notes.
- Platform settings CRUD (`PlatformSetting`).
- Announcement compose and history list.

#### Platform features (implemented)

- Public landing page with feature sections.
- Contact/support form posting to `/api/contact` and email dispatch.
- Privacy and terms pages.
- Global FAQ chatbot widget (route-gated).
- Health endpoint (`/api/health`).
- Sitemap + robots metadata routes.
- Image proxy endpoint for safe remote image rendering.

---

### 15. LIMITATIONS FOUND IN CODE

1. File-based quiz bridge is no longer active:
   - `game:create` is disabled.
   - `/api/quizzes/[id]/host` returns JSON instead of writing hosted quiz files.
2. In-memory game state only:
   - live games exist only in socket process memory (`Registry`).
   - empty-game cleanup every `60s`, expiry after `5 minutes`.
3. DB session models exist but runtime persistence writes were not found:
   - no create/insert path for `QuizSession`, `PlayerSession`, `PlayerAnswer` in active game flow.
4. Socket CORS origins are hardcoded and do not use `WEB_ORIGIN`.
5. `managerPassword` (`ADMIN_SOCKET_SECRET`) is returned from host API to browser.
6. Admin namespace uses a browser-visible `NEXT_PUBLIC_ADMIN_SOCKET_SECRET`.
7. Admin settings are stored but not applied in gameplay logic:
   - keys like `maxPlayersPerSession`, `scoringMultiplier`, `maintenanceMode` are not consumed outside settings API/page.
8. Declared socket contract events not emitted in current server:
   - `manager:statusUpdate`, `player:updateLeaderboard`.
9. Announcement delete API exists (`/api/admin/announcements/[id]`) but no delete control found in admin announcements page UI.
10. `packages/socket/src/services/config.ts` requested in audit checklist is missing.
11. Hardcoded operational values:
   - image proxy max size `8MB`
   - admin session broadcast `5s`
   - hosting timeout `10s` in host UI components.
12. `SOCKER_PORT` typo fallback exists in socket env runtime (`SOCKET_PORT ?? SOCKER_PORT ?? "3001"`).

---

### 16. STATISTICS

| Metric | Count / Value |
|---|---|
| Total API route files | `22` |
| Total page files (`page.tsx`/`page.ts`) | `25` |
| Total component files (`components/**/*.tsx`) | `46` |
| Socket events (client ? server) | `13` |
| Socket events (server ? client, custom) | `20` |
| Socket events (server ? client, including built-in `connect`) | `21` |
| Prisma models | `9` |
| Database migrations (`migration.sql`) | `4` |
| Total lines of code (approx, text files only; excludes node_modules/.next/dist/.git) | `29208` |
| Total dependency declarations across 4 package.json files | `77` |
| Unique dependency package names | `60` |
| FAQ entries in `QuooshChat` | `30` |

---

## Additional Audit Notes

- Requested file `packages/socket/src/services/config.ts`: **Not found in codebase**.
- `vercel.json`: **Not found in codebase**.
