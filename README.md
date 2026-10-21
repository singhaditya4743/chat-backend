# Chat Backend

A chat backend with 1:1 chats, group chats, messages, read receipts and last seen.

## Tech stack

| What | Details |
|---|---|
| Node.js | 24 (tested on v24.22.1) |
| TypeScript | 6 (strict mode) |
| Express | 5 |
| PostgreSQL | hosted on [Neon](https://console.neon.tech) |
| Firebase Firestore | for messages |

**Where the data lives**
- **PostgreSQL (Neon):** users, chats and chat members. To see the tables, open the Neon console, pick the project, then **Tables**.
- **Firestore:** messages, read receipts and last seen. To see them, open the Firebase console, then **Firestore Database**.

## Run it locally

1. Install packages
   ```
   npm i
   ```
2. Create a `.env` file in the project root
   ```
   PORT=5000
   DATABASE_URL=<your Neon connection string>
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   ```
3. Put your Firebase key file in the project root as `serviceAccountKey.json`
4. Create the tables (first time only)
   ```
   npm run db:migrate
   ```
5. Start the server
   ```
   npm run dev
   ```
   The server runs on `http://localhost:5000`. Check it with `GET /health`.

`.env` and `serviceAccountKey.json` are in `.gitignore`. Don't commit them.

## Database tables (PostgreSQL)

| Table | Used for |
|---|---|
| `users` | every user (`id`, `name`) |
| `chats` | every chat, 1:1 (`direct`) or `group`. A 1:1 chat stores a `direct_key` so the same two users always get the same chat |
| `chat_members` | who is in which chat, and their role (`admin` / `member`) |
| `schema_migrations` | which migration files have already run |

## Firestore collections

| Path | Used for |
|---|---|
| `chats/{chatId}/messages/{messageId}` | messages: `senderId`, `text`, `createdAt`, `readBy`, `editedAt`, `deletedAt` |
| `chats/{chatId}/members/{userId}` | last seen message of a user in that chat |

## Folder structure

```
database/migrations/   SQL files that create the tables
src/
  config/        env, PostgreSQL and Firebase setup
  routes/        URLs
  controllers/   read the request, send the response
  services/      business logic and permission checks
  repositories/  database queries (PostgreSQL and Firestore)
  models/        table and collection definitions
  mappers/       shape API responses
  validators/    request validation (zod)
  middlewares/   logging, errors, 404
  types/         TypeScript interfaces
  utils/         small helpers
  scripts/       migrate and seed
```

## APIs

| Method | Endpoint | Body |
|---|---|---|
| POST | `/user/create` | `name` |
| GET | `/user/:userId` | none |
| GET | `/user/:userId/chats` | none |
| POST | `/chat/create` | `userAId`, `userBId` |
| POST | `/chat/:chatId/message/send` | `senderId`, `text` |
| GET | `/chat/:chatId/messages?limit=50` | none (optional `before=<messageId>` for older messages) |
| POST | `/chat/:chatId/message/:messageId/read` | `userId` |
| PATCH | `/chat/:chatId/message/:messageId` | `userId`, `text` |
| DELETE | `/chat/:chatId/message/:messageId` | `userId` |
| POST | `/chat/:chatId/lastseen` | `userId`, `messageId` |
| GET | `/chat/:chatId/stream?userId=<id>` | none (live updates, see below) |
| POST | `/group/create` | `creatorId`, `name`, `memberIds` |
| GET | `/group/:chatId` | none |
| PATCH | `/group/:chatId` | `userId`, `name` |
| POST | `/group/:chatId/members` | `userId`, `memberIds` |
| DELETE | `/group/:chatId/members/:memberId` | `userId` |

## Real-time messages

`GET /chat/:chatId/stream?userId=<id>` keeps the connection open (Server-Sent Events) and pushes an event whenever a message in the chat is sent, edited, deleted or read. Only chat members can open it.

```js
const stream = new EventSource(`http://localhost:5000/chat/${chatId}/stream?userId=${userId}`);
stream.onmessage = (e) => console.log(JSON.parse(e.data));
// { "type": "message.created" | "message.updated", "chatId": "...", "message": { ... } }
```

## Other commands

| Command | What it does |
|---|---|
| `npm run lint` | checks code rules (no `any`, max 100 lines per file, `@/` imports only) |
| `npm run build` | builds to `dist/` |
| `npm start` | runs the built server |
