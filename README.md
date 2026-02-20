# Smart Bookmark App

A premium, real-time bookmark manager built with **Next.js 14**, **Supabase**, and **Tailwind CSS**.

## Features

- **Authentication**: Secure Google OAuth sign-in via Supabase Auth.
- **Real-time Updates**: Bookmarks sync instantly across all devices and tabs using Supabase Realtime.
- **Premium UI/UX**: Glassmorphism design, smooth Framer Motion animations, and responsive layout.
- **Theme Support**: Fully persistent Light and Dark mode (defaulting to Dark Premium).
- **Security**: Row Level Security (RLS) ensures users only access their own data.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Animation**: Framer Motion
- **Deployment**: Vercel

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Aman5012/smart-bookmarks-app.git
    cd smart-bookmarks-app
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Schema**:
    Run this SQL in your Supabase SQL Editor:
    ```sql
    create table bookmarks (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users not null,
      title text not null,
      url text not null,
      created_at timestamptz default now()
    );

    alter table bookmarks enable row level security;

    create policy "Users can see their own bookmarks"
      on bookmarks for select using (auth.uid() = user_id);

    create policy "Users can insert their own bookmarks"
      on bookmarks for insert with check (auth.uid() = user_id);

    create policy "Users can delete their own bookmarks"
      on bookmarks for delete using (auth.uid() = user_id);

    alter publication supabase_realtime add table bookmarks;
    ```

5.  **Run Locally**:
    ```bash
    npm run dev
    ```

## Development History

- **Auth Debugging**: Resolved redirects for production vs localhost.
- **Styling Fixes**: Migrated to Tailwind v4 and restored custom fonts/gradients for Vercel deployment.
- **Deployment**: Hosted on Vercel at [https://smart-bookmarks-app.vercel.app](https://smart-bookmarks-app.vercel.app).
