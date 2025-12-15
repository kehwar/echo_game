# 🎭 Echo Game

A web-based charades game application built with Nuxt 4, designed for group play and deployed on GitHub Pages.

**🔗 [Play the game here!](https://kehwar.github.io/echo_game/)**

## 🎮 Features

- **Create Game Rooms**: Start a new game and share a room code with friends
- **Join Existing Games**: Enter a room code to join others
- **Real-time Gameplay**: Take turns acting out words while others guess
- **Score Tracking**: Keep track of points throughout the game
- **Responsive Design**: Play on mobile or desktop devices

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server at http://localhost:3000
npm run dev
```

### Build

```bash
# Build for production (SSR/SPA mode)
npm run build

# Generate static site for GitHub Pages
npm run generate
```

### Testing

```bash
# Run tests
npm run test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🏗️ Technology Stack

- **Framework**: Nuxt 4
- **UI**: Vue 3 with Composition API
- **Language**: TypeScript
- **Testing**: Vitest
- **Linting**: ESLint with Nuxt config
- **Deployment**: GitHub Pages (Static Site Generation)

## 📁 Project Structure

```
echo_game/
├── .github/
│   ├── workflows/           # CI/CD workflows
│   └── copilot-instructions.md  # Coding agent instructions
├── pages/                   # Nuxt pages (file-based routing)
│   ├── index.vue           # Home page
│   ├── create.vue          # Create game page
│   ├── join.vue            # Join game page
│   └── game/
│       └── [id].vue        # Game room page
├── components/              # Vue components
├── composables/             # Composable functions
├── assets/                  # Static assets
├── public/                  # Public static files
├── test/                    # Test files
├── nuxt.config.ts          # Nuxt configuration
└── package.json            # Dependencies
```

## 🎯 Game Instructions

1. **Create a Game**: Click "Create Game" and set up your game preferences
2. **Share Room Code**: Share the generated room code with your friends
3. **Join the Room**: Others can join using the room code
4. **Play**: Take turns acting out words while others guess
5. **Score Points**: Earn points for correct guesses
6. **Win**: The player with the most points at the end wins!

## 🔧 Configuration

The project is configured for GitHub Pages deployment. The base URL is set to `/echo_game/` in production. To deploy to a different path, update the `baseURL` in `nuxt.config.ts`.

## 🚢 Deployment

The application automatically deploys to GitHub Pages when code is pushed to the `main` branch. The deployment workflow is configured in `.github/workflows/deploy.yml`.

To enable GitHub Pages:
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main branch to trigger deployment

## 📝 Development Guidelines

See `.github/copilot-instructions.md` for detailed coding guidelines and best practices.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT

## 🙏 Acknowledgments

Built with [Nuxt 4](https://nuxt.com/) and deployed on [GitHub Pages](https://pages.github.com/)