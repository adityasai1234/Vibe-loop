# VibeLoop - Mood-Based Music Recommendation System

## Overview

VibeLoop is a music streaming application that features a mood-based recommendation system. Users can select their current mood using emoji selectors, and the app will recommend songs and playlists that match that mood.

## Features

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

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Technologies Used

- React with TypeScript
- Firebase (Authentication, Firestore)
- Tailwind CSS for styling
- Zustand for state management

## Future Enhancements

- Advanced filters for tempo, energy, or vibe
- Custom mood-based playlist creation
- Integration with music streaming APIs
- Social sharing of mood-based playlists