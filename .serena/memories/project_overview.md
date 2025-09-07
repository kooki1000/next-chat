# Next-Chat Project Overview

Next-Chat is an AI chat application similar to ChatGPT or Claude. The application is built with Next.js v15 and features a local-first experience with seamless integration between server and client.

## Key Features

- Built with Next.js v15 for the main application
- Uses React Router SPA (`src/frontend`) for local-first experience
- Convex backend for data management (`convex` folder)
- Utilizes IndexedDB (via Dexie.js) for offline data storage and synchronization
- Clerk for authentication
- Tailwind CSS for styling
- TypeScript for type safety
- **Vercel AI Elements**: Uses optimized AI chat components for better performance
- Full set of React components with shadcn/ui components

## Architecture

The application follows a hybrid architecture with:

1. **Server-Side Components**: Using Next.js App Router for server-rendered pages
2. **Client-Side SPA**: Using React Router for local-first experience
3. **Database**:
   - Convex cloud database for persistence
   - IndexedDB for local storage and offline functionality
4. **Sync Mechanism**: Custom hooks for data synchronization between local and cloud
5. **AI Chat Interface**: Powered by Vercel AI Elements for optimized streaming and UX

## Tech Stack

- **Frontend**: Next.js, React, React Router, Tailwind CSS, shadcn/ui, Vercel AI Elements
- **Backend**: Convex, Next.js API Routes
- **Database**: Convex (cloud), IndexedDB (local)
- **Authentication**: Clerk
- **Package Manager**: pnpm
