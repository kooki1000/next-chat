**IMPORTANT: First consult the Serena documentation files in the `.serena` folder, especially `project_overview.md` and `code_style_and_conventions.md`, to understand the project structure, conventions, and development workflows. These files provide the most up-to-date information about the project.**

This is a Next.js v15-based repository for an AI chat application similar to ChatGPT or Claude. It features a local-first experience with a built-in React Router SPA (`src/frontend`) and uses `convex` as the backend (`convex` folder). The project uses `pnpm` as the package manager.

## Code Standards

### Required Before Each Commit

- Run `pnpm lint` to ensure proper code formatting and adherence to linting rules.
- Run `pnpm lint:fix` to automatically fix linting issues where possible.
- Run `pnpm typecheck` to ensure TypeScript type safety.

### Development Flow

- **Start Development Server**: `pnpm dev`
- **Build for Production**: `pnpm build`
- **Run Production Build**: `pnpm start`
- **Full CI Check**: Combine linting, type checking, and build checks (if applicable).

## Repository Structure

- `src/`: Contains the main application code.
  - `app/`: Next.js application code.
    - `api/`: API routes for server-side logic.
  - `frontend/`: React Router SPA for the local-first experience.
    - `routes/`: Defines the routes and pages for the SPA.
  - `components/`: Shared components used across the app.
  - `hooks/`: Custom React hooks for managing state and side effects.
  - `lib/`: Utility functions, constants, and schemas.
  - `providers/`: Context providers for global state management.
  - `stores/`: Zustand stores for managing application state.
  - `types/`: TypeScript type definitions.
- `convex/`: Backend logic powered by Convex.
  - `_generated/`: Auto-generated files for Convex.
  - `auth.config.ts`: Authentication configuration for Convex.
  - `schema.ts`: Database schema definitions.
  - `utils.ts`: Utility functions for Convex.
- `public/`: Static assets like images and icons.
- `README.md`: Project overview and setup instructions.
- `package.json`: Project dependencies and scripts.
- `pnpm-lock.yaml`: Lockfile for `pnpm`.

## Key Guidelines

1. **Use `pnpm` for Dependency Management**:
   - Install dependencies with `pnpm install`.
   - Add new dependencies with `pnpm add <package-name>`.

2. **Follow Next.js and React Best Practices**:
   - Use functional components and hooks.
   - Leverage Next.js features like API routes and dynamic routing.

3. **Backend Development with Convex**:
   - Define database schemas in `convex/schema.ts`.
   - Use `npx convex dev` to regenerate Convex files after schema changes.
   - Write queries and mutations in the `convex/` folder.

4. **Local-First Experience**:
   - Ensure the React Router SPA (`src/frontend`) integrates seamlessly with the Next.js app.
   - Use IndexedDB for offline data storage and synchronization.

5. **Linting and Formatting**:
   - Use ESLint for linting (`pnpm lint`).
   - Follow the rules defined in `eslint.config.js`.

By following these guidelines, you can contribute effectively to the `next-chat` project and maintain a high standard of code quality.
