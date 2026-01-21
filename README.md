# SRAS - Student Registration and Accounts System

A Next.js application for managing student registration and accounts.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM
- **Validation**: Zod
- **Authentication**: NextAuth.js (Auth.js)
- **Utilities**: clsx, tailwind-merge
- **Linting**: ESLint
- **Formatting**: Prettier

## Local Setup

### Prerequisites

- Node.js 18+ installed
- npm installed
- PostgreSQL installed and running

### Local Postgres Setup (Windows)

**1. Create database and user:**

```bash
psql -U postgres
```

```sql
CREATE DATABASE sras;
CREATE USER sras_user WITH PASSWORD 'sras_password';
GRANT ALL PRIVILEGES ON DATABASE sras TO sras_user;
\q
```

**2. Set DATABASE_URL in `.env`:**

```bash
copy .env.example .env
```

Update `.env`:
```
DATABASE_URL="postgresql://sras_user:sras_password@localhost:5432/sras?schema=public"
```

**3. Create the database (if it doesn't exist):**

Option A - Using the helper script:
```bash
npm run db:create
```

Option B - Manually using psql:
```bash
psql -U postgres
```
```sql
CREATE DATABASE sras_db;
\q
```

**4. Run Prisma migrations:**

```bash
npm run db:migrate
```

> **Note:** If you get a "permission denied to create database" error, the database needs to be created manually first (see Option B above), or you need to grant CREATEDB permission to your PostgreSQL user.

### Installation Steps

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Update `NEXTAUTH_SECRET` in `.env` (generate a random secret):

**PowerShell:**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

**Or use OpenSSL (if installed):**
```bash
openssl rand -base64 32
```

4. **Start the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
  app/          # Next.js App Router pages and layouts
prisma/
  schema.prisma # Prisma schema definition
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:create` - Create the database (if it doesn't exist)
