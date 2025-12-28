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
- **PWA Support**: Install as a Progressive Web App for offline play and app-like experience

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
├── assets/
│   └── decks/               # Game deck markdown files
│       └── en-US/           # Locale-specific decks
│           ├── animals.md
│           ├── actions.md
│           └── ...          # Other deck files
├── data/
│   └── decks.ts             # Deck loader (reads markdown files)
├── pages/                   # Nuxt pages (file-based routing)
│   ├── index.vue           # Home page with deck selection
│   └── game/
│       └── [id].vue        # Game play page
├── components/              # Vue components (shadcn-vue UI components)
├── public/                  # Public static files
├── test/                    # Test files
├── nuxt.config.ts          # Nuxt configuration
└── package.json            # Dependencies
```

## 🃏 Deck Format

Decks are stored as markdown files with YAML frontmatter in `assets/decks/{locale}/`. Each deck file contains:

**Frontmatter** (metadata):
- `name`: Display name of the deck
- `description`: Brief description shown on deck selection
- `locale`: Language/locale code (e.g., `en-US`)
- `extends` (optional): Inherit cards from other deck(s)
- `hidden` (optional): Set to `true` to hide deck from UI (still available for extension)

**Content** (cards):
- One card per line
- Cards are uppercase by convention
- Empty lines are ignored

**Example** (`assets/decks/en-US/animals.md`):
```markdown
---
name: Animals
description: Act out your favorite animals - from tiny insects to giant elephants!
locale: en-US
---

ELEPHANT
KANGAROO
PENGUIN
GIRAFFE
...
```

**Example with Extension** (`assets/decks/es-ES/pokemon.md`):
```markdown
---
name: Pokémon
description: ¡Actúa como los Pokémon icónicos!
locale: es-ES
extends: en-US/pokemon
---
# Inherits all cards from en-US/pokemon deck
```

To add a new deck:
1. Create a new `.md` file in `assets/decks/{locale}/`
2. Add frontmatter with name, description, and locale
3. Optionally add `extends` to inherit cards from existing deck(s)
4. Optionally add `hidden: true` to hide from UI
5. List cards one per line (or omit if only using extends)
6. The deck will automatically appear in the game (unless hidden)

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

## 📱 Progressive Web App (PWA)

Echo Game is a fully-featured Progressive Web App that can be installed on your device for an app-like experience:

### Installation

**On Mobile (iOS/Android):**
1. Visit the game in your mobile browser
2. Tap the browser menu (⋮ or share icon)
3. Select "Add to Home Screen" or "Install App"
4. The game icon will appear on your home screen

**On Desktop (Chrome/Edge):**
1. Visit the game in your browser
2. Look for the install icon (⊕) in the address bar
3. Click "Install" to add Echo Game to your applications

### Benefits

- **Offline Play**: Play anytime, even without an internet connection (after first visit)
- **Fast Loading**: Instant app launch with cached resources
- **App-Like Experience**: Runs in standalone mode without browser UI
- **Auto-Updates**: Automatically updates to the latest version when online
- **Home Screen Access**: Quick access directly from your device's home screen

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