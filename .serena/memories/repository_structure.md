# Repository Structure

The repository is organized with the following structure:

## Top-Level Directories

- `src/`: Main application code
- `convex/`: Backend logic powered by Convex
- `.github/`: GitHub-related files and workflows
- `.vscode/`: VS Code configuration
- `public/`: Static assets

## Source Code (`src/`)

- `app/`: Next.js application code using App Router
  - `api/`: API routes for server-side logic
  - `(legal)/`: Routes for legal pages (privacy policy, terms, etc.)
  - `layout.tsx`: Root layout component
  - `page.tsx`: Root page component

- `frontend/`: React Router SPA for local-first experience
  - `routes/`: Defines the routes and pages for the SPA
    - `auth/`: Authentication-related routes
    - `main/`: Main application routes
      - `chat/`: Chat functionality
    - `not-found/`: 404 page

- `components/`: Shared components used across the app
  - `ui/`: UI components (shadcn/ui)
  - `ai-elements/`: Vercel AI Elements components for chat interface
    - `conversation.tsx`: Chat conversation container with auto-scroll
    - `message.tsx`: Individual message components
    - `prompt-input.tsx`: AI-optimized input components
    - `reasoning.tsx`: Collapsible reasoning display
    - `response.tsx`: Streaming response renderer
    - `loader.tsx`: Loading indicators
    - And other AI-specific components...
  - `InputBox.tsx`: General purpose input component
  - `ModelSelector.tsx`: AI model selection component

- `hooks/`: Custom React hooks for state and side effects
  - `use-chat.ts`: Chat functionality hook
  - `use-data-sync.ts`: Data synchronization hook
  - `use-local-messages.ts`: Local messages management
  - `use-local-threads.ts`: Local threads management
  - `use-messages-sync.ts`: Messages synchronization
  - `use-threads-sync.ts`: Threads synchronization

- `providers/`: Context providers for global state
  - `ClerkProvider.tsx`: Authentication provider
  - `ConvexClientProvider.tsx`: Convex client provider
  - `DataSyncProvider.tsx`: Data synchronization provider
  - `ThemeProvider.tsx`: Theme provider

- `lib/`: Utility functions, constants, and schemas
  - `api.ts`: API utility functions
  - `constants.ts`: Application constants
  - `env.ts`: Environment variable validation
  - `schemas.ts`: Zod schemas for validation
  - `utils.ts`: General utility functions

- `types/`: TypeScript type definitions
  - `messages.ts`: Message-related types
  - `shared.ts`: Shared types
  - `index.ts`: Main type exports

- `db/`: Database-related code (Dexie/IndexedDB)
  - `index.ts`: Database setup and configuration

- `client/`: Client-side utility code
  - `api.ts`: Client-side API functions
  - `convex.ts`: Convex client setup
  - `dexie.ts`: Dexie client setup

- `server/`: Server-side utility code
  - `ai.ts`: AI-related functionality
  - `auth.ts`: Authentication utility functions
  - `threads.ts`: Thread management functions
  - `users.ts`: User management functions

## Convex Backend (`convex/`)

- `_generated/`: Auto-generated files by Convex
- `auth.config.ts`: Authentication configuration
- `schema.ts`: Database schema definitions
- `messages.ts`: Message-related queries and mutations
- `threads.ts`: Thread-related queries and mutations
- `users.ts`: User-related queries and mutations
- `utils.ts`: Utility functions for Convex
- `http.ts`: HTTP endpoints for Convex
