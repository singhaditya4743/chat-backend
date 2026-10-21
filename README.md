# Chat Backend

Backend for a chat app, built with Node.js and TypeScript.

- **PostgreSQL (Neon):** users, chats and chat members
- **Firebase Firestore:** messages, read receipts and last seen

## Folder structure

```
src/
  config/        database and Firebase setup
  routes/        API routes
  controllers/   request handling
  services/      business logic
  middlewares/   validation and error handling
  types/         TypeScript types
  utils/         helpers
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Fill in `.env`:
   | Variable | Description |
   |---|---|
   | `PORT` | Server port (default `3000`) |
   | `DATABASE_URL` | Neon PostgreSQL connection string |
   | `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to the Firebase service account key |
3. Put `serviceAccountKey.json` in the project root.

`.env` and `serviceAccountKey.json` are secrets and are ignored by git. Never commit them.

## APIs

| Method | Endpoint | Body |
|---|---|---|
| POST | `/chat/create` | `userAId`, `userBId` |
| POST | `/chat/:chatId/message/send` | `senderId`, `text` |
| GET | `/chat/:chatId/messages?limit=50` | none |
| POST | `/chat/:chatId/message/:messageId/read` | `userId` |
| POST | `/chat/:chatId/lastseen` | `userId`, `messageId` |
| GET | `/user/:userId/chats` | none |
