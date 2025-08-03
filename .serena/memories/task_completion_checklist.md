# Task Completion Checklist

Before considering a task complete, ensure you've gone through this checklist:

## Code Quality

- [ ] **TypeScript Type Safety**: Run `pnpm typecheck` to ensure no type errors
- [ ] **Linting**: Run `pnpm lint` to check for linting issues
- [ ] **Formatting**: Run `pnpm lint:fix` to fix formatting issues

## Code Review

- [ ] **Functionality**: Ensure the code works as expected
- [ ] **Error Handling**: Proper error handling is implemented
- [ ] **Edge Cases**: All edge cases are considered
- [ ] **Performance**: Code is optimized and doesn't cause performance issues

## Local Testing

- [ ] **Local Development**: Tested with `pnpm dev`
- [ ] **Local-First Experience**: Tested the local-first experience
- [ ] **Offline Functionality**: Tested offline functionality (if applicable)
- [ ] **Synchronization**: Tested data synchronization between local and cloud

## Documentation

- [ ] **Code Comments**: Added necessary comments for complex logic
- [ ] **README Updates**: Updated README.md if necessary
- [ ] **API Documentation**: Documented any new APIs or changes to existing ones

## Git Workflow

- [ ] **Branch Naming**: Used appropriate branch naming (e.g., `feat/`, `fix/`, `refactor/`)
- [ ] **Commit Messages**: Used clear and descriptive commit messages
- [ ] **Pull Request**: Created a pull request with a descriptive title and description
