# Next.js 14 SaaS Starter

This is a modern boilerplate for building SaaS applications using:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- PostgreSQL (Neon Serverless Postgres)
- NextAuth.js v4 (Google & Email Authentication)

## Getting Started

Follow these steps to get your project up and running.

### 1. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Update the environment variables with your credentials:
    - **DATABASE_URL**: Your Neon PostgreSQL connection string.
    - **NEXTAUTH_SECRET**: Generate a secret (e.g., using `openssl rand -base64 32`).
    - **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**: From your Google Cloud Console.

### 2. Initialize Database

Push the Prisma schema to your Neon database and generate the Prisma client:

```bash
npx prisma db push
npx prisma generate
```

### 3. Run the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
- `prisma/schema.prisma`: Database models
- `src/app/api/auth/[...nextauth]/route.ts`: Authentication endpoints
- `src/app/page.tsx`: Landing page
- `src/app/login/page.tsx`: Authentication page
- `src/app/dashboard/page.tsx`: Protected dashboard page
- `src/lib/auth.ts`: NextAuth configuration
- `src/lib/prisma.ts`: Prisma global client template
- `src/middleware.ts`: Secures the dashboard route
