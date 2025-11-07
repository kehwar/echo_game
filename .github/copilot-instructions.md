# Echo Game - Coding Agent Instructions

## Project Overview
Echo Game is a web-based charades game application built with Nuxt 4, designed for group play and deployed as a static site on GitHub Pages.

## Technology Stack
- **Framework**: Nuxt 4 with static site generation (SSG)
- **Deployment**: GitHub Pages
- **Package Manager**: npm
- **Language**: TypeScript/JavaScript (Vue 3 composition API)

## Code Style and Standards
- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Use `<script setup>` syntax in Vue components
- Keep components small and focused
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

## Project Structure
```
echo_game/
├── .github/
│   ├── workflows/        # CI/CD workflows
│   └── copilot-instructions.md
├── pages/                # Nuxt pages (file-based routing)
├── components/           # Vue components
├── composables/          # Composable functions
├── assets/               # Static assets (CSS, images)
├── public/               # Public static files
└── nuxt.config.ts        # Nuxt configuration
```

## Development Guidelines

### Component Development
- Create reusable components in the `components/` directory
- Auto-imported components don't need explicit imports
- Use props for parent-child communication
- Emit events for child-parent communication

### State Management
- Use Vue 3's `ref()` and `reactive()` for local state
- Use composables for shared logic
- Keep state close to where it's used

### Styling
- Use scoped styles in components: `<style scoped>`
- Consider utility-first CSS or minimal CSS framework
- Ensure responsive design for mobile and desktop

### Testing
- Write unit tests for composables and utilities
- Test component behavior, not implementation
- Use Vitest for unit testing
- Run tests before committing: `npm test`

### Linting and Formatting
- Use ESLint for code quality
- Run `npm run lint` before committing
- Fix linting errors: `npm run lint -- --fix`

## GitHub Pages Deployment
- The site is built as a static site using `nuxt generate`
- Output goes to `.output/public` directory
- Deployed automatically via GitHub Actions on push to main
- Base URL is configured for GitHub Pages subdirectory

## Game-Specific Guidelines

### Charades Game Features
- Players can create and join game rooms
- Round-based gameplay with timer
- Role rotation (actor/guesser)
- Score tracking
- Responsive UI for mobile devices

### Code Organization
- Game logic in composables (e.g., `useGame.ts`, `useTimer.ts`)
- UI components separated from game logic
- State management for game state, players, and scores

## Common Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run generate     # Generate static site
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

## When Making Changes
1. Always run `npm run lint` to check for issues
2. Run `npm run build` to ensure the build works
3. Test changes manually in the dev server
4. Add/update tests for new functionality
5. Update documentation if needed

## Best Practices
- Keep the bundle size small for fast loading
- Optimize images and assets
- Use lazy loading for components where appropriate
- Ensure accessibility (semantic HTML, ARIA labels)
- Test on multiple devices and browsers
