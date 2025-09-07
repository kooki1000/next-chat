# Code Style and Conventions

## TypeScript

- Use TypeScript for all code files
- Use proper typing for functions, variables, and components
- Type imports should use the `import type` syntax when appropriate

## JavaScript/TypeScript Conventions

- Use double quotes for strings
- Use semicolons at the end of statements
- Use 2-space indentation
- Prefer functional components and hooks over class components

## React Conventions

- Use functional components with React hooks
- Follow the rules of hooks (only call hooks at the top level)
- Use named exports for components
- Use TypeScript for prop types
- **AI Elements**: Prefer AI Elements components for chat-related UI over custom implementations

## File Structure

- Components should be placed in the appropriate directory based on their scope:
  - Common/reusable components in `src/components/`
  - AI Elements components in `src/components/ai-elements/`
  - Page-specific components in their respective route folders
- Hooks should be placed in `src/hooks/`
- Constants and utility functions in `src/lib/`
- Types in `src/types/`

## Naming Conventions

- **Files & Folders**: Use kebab-case for file and folder names (e.g., `use-chat.ts`, `InputBox.tsx`)
- **Components**: Use PascalCase for component names (e.g., `ModelSelector.tsx`)
- **Hooks**: Use camelCase with `use` prefix (e.g., `use-local-threads.ts`)
- **Functions**: Use camelCase for function names
- **Types/Interfaces**: Use PascalCase for type and interface names

## Tailwind CSS

- Follow the Tailwind CSS conventions for styling
- Use consistent utility classes
- Use better-tailwindcss plugin for linting Tailwind classes

## Import Order

- Follow the ESLint rules for import ordering
- Group imports logically (React, third-party, internal)
