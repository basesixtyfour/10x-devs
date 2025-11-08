# 10x Devs

A modern AI-powered development assistant built with Next.js, featuring real-time streaming responses, authentication, and a clean dark UI.

## Features

- **Real-time AI chat** using OpenAI-compatible APIs (OpenRouter by default)
- **Streaming responses** (SSE) for a responsive UX
- **Authentication** with email/password and Google
- **Markdown + syntax highlighting** with GFM
- **Rate limiting** via Upstash Redis
- **Type-safe** codebase with TypeScript, Prisma ORM
- **Modern UI** with Tailwind CSS v4 and ShadCN UI

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database/ORM**: PostgreSQL + Prisma
- **Auth**: better-auth + Prisma adapter
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI
- **AI Integration**: OpenRouter via `openai` SDK
- **Ratelimit**: @upstash/ratelimit + @upstash/redis
- **Markdown**: React Markdown with GFM support
- **Package Manager**: pnpm

## Quickstart

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd 10x-devs
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the project root. The build will fail if required variables are missing.

   Required (validated in `next.config.ts`):

   ```env
   PRISMA_DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
   BETTER_AUTH_SECRET=your_random_secret
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   KV_URL=your_kv_url
   KV_REST_API_URL=your_kv_rest_api_url
   KV_REST_API_TOKEN=your_kv_rest_api_token
   KV_REST_API_READ_ONLY_TOKEN=your_kv_rest_api_read_only_token
   REDIS_URL=your_redis_url
   ```

   Used by features:

   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENAI_BASE_URL=https://openrouter.ai/api/v1
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

   Notes:
   - `PRISMA_DATABASE_URL` must point to a PostgreSQL database.
   - `NEXT_PUBLIC_BASE_URL` should match the site origin (http://localhost:3000 in development).
   - Upstash Redis is used via `Redis.fromEnv()`. Ensure your provider envs are mapped to the variables above.

4. **Database setup**

   ```bash
   pnpm dlx prisma migrate dev
   pnpm dlx prisma generate   # also runs on postinstall
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Scripts

- `dev`: start Next.js in development (Turbopack)
- `build`: build the app (Turbopack)
- `start`: run the production server
- `lint`: run ESLint

## Authentication

- Email/password auth is enabled.
- Google OAuth requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- `NEXT_PUBLIC_BASE_URL` must reflect the external URL for callbacks to work.

## AI Provider

- Defaults to OpenRouter with `OPENROUTER_API_KEY`.
- Override base URL via `OPENAI_BASE_URL` if pointing to a compatible endpoint.

## API Endpoints (App Router)

- `POST /api/auth/[...all]` — better-auth routes
- `POST /api/chat` — create a chat
- `GET /api/chat/[chatId]` — fetch a chat
- `DELETE /api/chat/[chatId]` — delete a chat
- `POST /api/chat/[chatId]/messages` — stream model responses

## Project Structure

- `app/` — Next.js routes and pages
- `components/` — UI and chat components
- `lib/` — Prisma, auth, server utilities (SSE, model client, validation)
- `prisma/` — schema and migrations

## Rate Limiting

Configured via Upstash Redis in `lib/ratelimit.ts` (`Redis.fromEnv()` with a sliding window of 5 requests per minute). Adjust limits and window as needed.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

- Set all environment variables in your hosting platform.
- Run Prisma migrations against your PostgreSQL instance.
- Use `pnpm build` and `pnpm start`, or deploy via a platform that supports Next.js.

## Troubleshooting

- Build fails on startup: verify required environment variables (see the list above).
- 500s from chat routes: confirm `OPENROUTER_API_KEY` and outbound network access.
- Auth callback issues: ensure `NEXT_PUBLIC_BASE_URL` and Google OAuth credentials are correct.
- Database errors: confirm `PRISMA_DATABASE_URL` and that migrations have been applied.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Built by 10x Devs**
