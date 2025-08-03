# Next-Chat

Next-Chat is an AI chat application similar to ChatGPT or Claude, built with Next.js v15. This project features a local-first experience that works even when offline, with seamless synchronization when you're back online.

## Features

- 💬 AI chat interface similar to ChatGPT/Claude
- 🔄 Local-first experience with offline capabilities
- 🔌 Seamless sync between local and cloud data
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🔒 Authentication with Clerk
- 📱 Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org) v15, React v19, [React Router](https://reactrouter.com) v7
- **Backend**: [Convex](https://convex.dev) for cloud database and backend logic
- **Local Storage**: [Dexie.js](https://dexie.org) (IndexedDB) for offline functionality
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4 with shadcn/ui components
- **Authentication**: [Clerk](https://clerk.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Package Manager**: [pnpm](https://pnpm.io)

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0

### Installation

1. Clone the repository

```bash
git clone https://github.com/kooki1000/next-chat.git
cd next-chat
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env.local` file based on `.env.example` and fill in your API keys

4. Start the development server

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

### Development Workflow

- **Start development server**: `pnpm dev`
- **Type checking**: `pnpm typecheck`
- **Linting**: `pnpm lint`
- **Fix linting issues**: `pnpm lint:fix`
- **Build for production**: `pnpm build`
- **Run production build**: `pnpm start`

## Architecture

This application follows a hybrid architecture:

1. **Server-Side Components**: Using Next.js App Router for server-rendered pages
2. **Client-Side SPA**: Using React Router for local-first experience
3. **Database**:
   - Convex cloud database for persistence
   - IndexedDB for local storage and offline functionality
4. **Sync Mechanism**: Custom hooks for data synchronization between local and cloud

## Project Structure

- `src/`: Main application code
  - `app/`: Next.js application using App Router
  - `frontend/`: React Router SPA for local-first experience
  - `components/`: Shared UI components
  - `hooks/`: Custom React hooks
  - `lib/`: Utility functions and constants
  - `db/`: Database setup (Dexie/IndexedDB)
  - `providers/`: Context providers
  - `types/`: TypeScript type definitions
- `convex/`: Backend logic with Convex
  - `schema.ts`: Database schema definitions
  - `messages.ts`, `threads.ts`, `users.ts`: Backend functions

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
