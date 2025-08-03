# Development Environment and Setup

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the required environment variables
3. Install dependencies with `pnpm install`
4. Start the development server with `pnpm dev`

## Environment Variables

The application requires several environment variables to be set:

- Clerk authentication keys
- Convex deployment URL and keys
- OpenAI API keys (if using OpenAI)

## Development Workflow

1. Start the development server with `pnpm dev`
2. Make changes to the codebase
3. Run type checking with `pnpm typecheck`
4. Run linting with `pnpm lint`
5. Fix linting issues with `pnpm lint:fix`
6. Build for production with `pnpm build`
7. Test the production build with `pnpm start`

## Convex Backend

For the Convex backend:

1. Run `npx convex dev` to start the Convex development server
2. After making changes to the schema, regenerate the Convex files with `npx convex dev`
3. Deploy changes to Convex with `npx convex deploy`

## Git Hooks

The project uses lefthook for Git hooks:

- Pre-commit hook runs `pnpm typecheck` and `pnpm lint:fix` to ensure code quality
