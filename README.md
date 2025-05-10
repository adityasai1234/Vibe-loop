# VibeLoop - Mood-Based Music Recommendation System

## Overview

VibeLoop is a music streaming application that features a mood-based recommendation system. Users can select their current mood using emoji selectors, and the app will recommend songs and playlists that match that mood. The app now includes a powerful search and filtering system that allows users to find songs based on various criteria including mood, activity, and time of day.

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
3. Set up Cobalt CMS environment variables in a `.env` file:
   ```
   COBALT_PROJECT_ID=your-project-id
   COBALT_API_KEY=your-api-key
   ```
4. Seed the songs collection: `npm run seed-songs`
5. Start the development server: `npm run dev`

### Song Data Structure

Each song in the Cobalt CMS collection includes the following metadata:

```json
{
  "title": "Snowman",
  "artist": "WYS",
  "genre": "Lo-fi",
  "tags": ["chill", "study", "rainy", "lofi", "relax"],
  "duration": 198,
  "albumArt": "/images/lofi/snowman.jpg",
  "releaseDate": "2022-03-15",
  "mood": ["chill", "relaxed"],
  "activity": ["study", "reading"],
  "timeOfDay": ["night", "evening"]
}
```

## Technologies Used

- React with TypeScript
- Firebase (Authentication, Firestore)
- Cobalt CMS for song data management
- Tailwind CSS for styling
- Zustand for state management
- Fuse.js for fuzzy search capabilities

## Future Enhancements

- Advanced filters for tempo, energy, or vibe
- Custom mood-based playlist creation
- Integration with music streaming APIs
- Social sharing of mood-based playlists
- Fuzzy search using Fuse.js for partial matches
- Voice input search using Web Speech API
- Infinite scroll for large result sets
- More sophisticated mood suggestions based on weather and user history