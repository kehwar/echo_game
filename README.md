# 🎭 Echo Game

A phone-on-forehead charades game built with Nuxt 4, designed for local group play and deployed on GitHub Pages.

**🎮 [Play Now](https://kehwar.github.io/echo_game/)** | Live on GitHub Pages

**🔗 [Play the game here!](https://kehwar.github.io/echo_game/)**

## 🎮 Features

- **Deck Selection**: Choose from 7 different decks (Animals, Food, Sports, etc.)
- **Phone-on-Forehead Gameplay**: Place your phone on your forehead while friends give you clues
- **Simple Tap Controls**: Tap left for correct, right to skip - no need to look at the screen!
- **2-Minute Timer**: Fast-paced rounds with automatic timing
- **Score Tracking**: See your correct guesses and skipped cards at the end
- **Responsive Design**: Optimized for mobile devices
- **No Network Required**: Fully local gameplay, no server or multiplayer needed

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
├── data/
│   └── decks.ts             # Game decks and card lists
├── pages/                   # Nuxt pages (file-based routing)
│   ├── index.vue           # Home page with deck selection
│   └── game/
│       └── [id].vue        # Game play page
├── components/              # Vue components (shadcn-vue UI components)
├── assets/                  # Static assets
├── public/                  # Public static files
├── test/                    # Test files
├── nuxt.config.ts          # Nuxt configuration
└── package.json            # Dependencies
```

## 🎯 How to Play

1. **Choose a Deck**: Select from Animals, Food, Sports, Professions, and more
2. **Start the Game**: Press the START GAME button
3. **Place Phone on Forehead**: Hold the phone against your forehead facing outward so others can see the screen
4. **Get Clues**: Your friends give you hints about the card displayed
5. **Tap to Score**: 
   - Tap the **LEFT** side of the screen when you guess correctly ✓
   - Tap the **RIGHT** side to skip a difficult card ✗
6. **Beat the Clock**: You have 2 minutes to guess as many cards as possible!
7. **See Your Score**: After time runs out, view your correct and skipped cards

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