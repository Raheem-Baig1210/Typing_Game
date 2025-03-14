# TypeMaster - Modern Typing Game

TypeMaster is a feature-rich typing game built with Next.js, React, and TypeScript. It helps users improve their typing speed and accuracy through various game modes, real-time feedback, and personalized coaching.

## Features

### Multiple Game Modes
- **Classic Mode**: Type a given text as fast as possible
- **Survival Mode**: Words disappear if not typed quickly
- **Custom Mode**: Add your own texts to practice with
- **Multiplayer Mode**: Compete with friends in real-time

### Leaderboard & Ranking System
- Global leaderboard to compare your skills with others
- Ranking based on WPM, accuracy, and streaks

### AI-Based Typing Coach
- Personalized suggestions based on your typing patterns
- Identifies your weak spots and provides targeted exercises

### Themed UI & Customization
- Multiple themes: Light, Dark, Neon, and Retro
- Customizable sound settings

### WPM & Accuracy Tracking
- Real-time WPM calculation
- Accuracy percentage
- Statistics tracking over time

### Real-Time Multiplayer
- Race against friends with live progress tracking
- Create and join game rooms

### Gamification Elements
- Achievements and badges
- Daily challenges

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Real-time Communication**: Socket.io
- **Icons**: React Icons

## Getting Started

### Prerequisites
- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/typing-game.git
cd typing-game
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Generate favicon (optional)
```bash
# Run the script to see instructions for generating favicon
node scripts/generate-favicon.js

# Or use an online converter like favicon.io to convert the SVG files in the public folder
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
npm run start:all # to start both Next.js app and Socket.io server
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
typing-game/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── game/             # Game mode pages
│   │   │   ├── classic/
│   │   │   ├── survival/
│   │   │   ├── custom/
│   │   │   └── multiplayer/
│   │   ├── leaderboard/      # Leaderboard page
│   │   ├── settings/         # Settings page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── TypingGame.tsx    # Main game component
│   │   └── TypingCoach.tsx   # AI coach component
│   ├── lib/                  # Library code
│   │   └── store.ts          # Zustand store
│   ├── styles/               # Global styles
│   │   └── globals.css       # Tailwind CSS imports
│   └── utils/                # Utility functions
│       └── sampleTexts.ts    # Sample texts for typing
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # Project documentation
```

## Future Enhancements

- User authentication and profiles
- More advanced AI coaching with machine learning
- Additional game modes (e.g., code typing, language-specific)
- Mobile app version
- Integration with typing test APIs

## Deployment

### Vercel Deployment

To prepare for deployment to Vercel, run:

```bash
npm run prepare:vercel
```

This script will provide a checklist of things to verify before deploying to Vercel, including:

1. Environment variables setup
2. Database configuration
3. Socket.io server deployment options
4. File updates needed for production
5. Pre-deployment checks
6. Deployment steps

The project includes a `vercel.json` configuration file with recommended settings for:
- Build and install commands
- Environment variables (update these with your actual URLs)
- Security headers
- Caching policies for static assets

### Socket.io Server

For the multiplayer functionality to work in production, you'll need to deploy the Socket.io server separately or use Vercel Pro with WebSockets support.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Socket.io](https://socket.io/)
- [Framer Motion](https://www.framer.com/motion/) 