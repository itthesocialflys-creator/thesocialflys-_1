# Social Flys — Marketing Website + CRM Portal

Production-ready Next.js 14 application integrating The Social Flys marketing website with an internal Supabase-powered CRM.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + Shadcn UI components
- **Supabase** (Auth, PostgreSQL, Realtime, RLS)
- **TanStack Table**, **Recharts**, **@hello-pangea/dnd**, **papaparse**

## Setup

1. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

2. Create a [Supabase](https://supabase.com) project and add your credentials to `.env.local`.

3. Run the database migration in Supabase SQL Editor:
   ```
   supabase/migrations/001_init.sql
   ```

4. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

5. Create admin user in Supabase Auth, then update their profile role:
   ```sql
   UPDATE profiles SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Public marketing landing page |
| `/login` | Employee portal authentication |
| `/admin/leads` | Admin lead data grid |
| `/admin/importer` | CSV lead importer |
| `/admin/team` | Team management |
| `/admin/analytics` | Executive analytics |
| `/pipeline` | Agent Kanban pipeline |
| `/messages` | Real-time team chat |

## Features

- SEO-optimized landing page with structured metadata
- Lead capture form with auto round-robin allocation
- CSV import with column mapping and validation
- Drag-and-drop Kanban with optimistic updates
- Real-time chat with @lead tagging
- Role-based access (ADMIN / AGENT) with RLS
