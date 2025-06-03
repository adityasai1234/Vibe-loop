# VibeLoop - Mood-Based Music Recommendation System

## Overview

VibeLoop is a music streaming application that features a mood-based recommendation system. Users can select their current mood using emoji selectors, and the app will recommend songs and playlists that match that mood. The app now includes a powerful search and filtering system that allows users to find songs based on various criteria including mood, activity, and time of day.

## Setup and Installation

### Prerequisites

- Node.js 20 LTS
- npm or yarn
- macOS (or other compatible OS)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Install Firebase CLI (if not already installed):

```bash
npm install -g firebase-tools
```

4. Log in to Firebase:

```bash
firebase login
```

## Features

### Search and Filtering

- **Smart Search**: Search by song title, artist, or genre
- **Context-Aware Filtering**: Filter songs by mood, activity, or time of day
- **Real-time Suggestions**: Get search suggestions as you type
- **Highlighted Results**: Search terms are highlighted in the results
- **Time-Based Recommendations**: Suggested moods based on time of day

### Mood Selection

- **Emoji Mood Selectors**: Large, tappable emojis representing different moods
- **Mood Categories**:
  - 😊 Happy - Pop, Dance, Funk
  - 😢 Sad - Acoustic, Soft Rock
  - 😴 Sleepy - Lo-fi, Ambient, Chill
  - 😍 Romantic - R&B, Soul, Love Songs
  - 😠 Angry - Rock, Rap, Heavy Metal
  - 🤩 Excited - EDM, Electro Pop, Future Bass
  - 😌 Calm - Jazz, Classical, Chill

### Mood-Based Recommendations

- Curated playlists for each mood
- Song recommendations based on mood selection
- Ability to rate mood matches (thumbs up/down)
- Shuffle mood option for variety

### User Preferences

- Stores user's selected mood
- Tracks mood history
- Saves favorite songs

## Development and Deployment

### Development Server

To start the Vite development server with hot module reloading:

```bash
npm run dev
```

This will start the development server at http://localhost:5000 by default.

For LAN testing (to access from other devices on your network):

```bash
npm run dev -- --host
```

### Production Preview

To preview the production build locally using Firebase Emulator:

1. Build the project:

```bash
npm run build
```

2. Start the Firebase Emulator:

```bash
npm run serve:firebase
```

This will serve the production build at http://localhost:5000 by default.

For LAN testing with Firebase Emulator:

```bash
firebase emulators:start --only hosting --host 0.0.0.0
```

### Firebase Emulator Options

- `--only hosting`: Only starts the hosting emulator (faster startup)
- `--host 0.0.0.0`: Makes the emulator accessible on your local network
- `--project [project-id]`: Specifies which Firebase project to use

### Scripts

- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run serve:firebase`: Preview production build using Firebase Emulator
- `npm run preview`: Preview production build using Vite's built-in server
- `npm run deploy`: Deploy to Firebase Hosting
- `npm run lint`: Run ESLint
- `npm run seed-songs`: Run song seeding script

## Troubleshooting

### Module Export Errors

If you encounter errors like:

```
Uncaught SyntaxError: The requested module '/src/sessions/ListenerPanel.tsx' does not provide an export named 'ListenerPanel'
```

This is typically caused by a mismatch between default and named exports/imports. Check:

1. How the component is exported in the source file:
   - Default export: `export default ListenerPanel;`
   - Named export: `export { ListenerPanel };`

2. How the component is imported:
   - For default exports: `import ListenerPanel from '../sessions/ListenerPanel';`
   - For named exports: `import { ListenerPanel } from '../sessions/ListenerPanel';`

Make sure the import style matches the export style.

## Data Structure

The application uses Firebase Firestore with the following structure:

```
moods/
  😊_happy/
    songs/
      songId/
        title: "Happy"
        artist: "Pharrell Williams"
        url: "https://..."
        genre: "Pop"
        mood: "happy"
        emoji: "😊"
  😢_sad/
    songs/
      ...
```

User data is stored as:

```
users/{uid}/lastMood: "😊"
users/{uid}/favorites: [songIds]
users/{uid}/moodHistory: [{mood, timestamp}]
```

## Responsive Design

- Mobile: Swipeable cards and vertical stacks
- Desktop: Grid layout with side-by-side panels
- Adaptive UI that changes based on screen size

## Tech Stack

- React with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Firebase for authentication and data storage
- Cobalt CMS for content management
