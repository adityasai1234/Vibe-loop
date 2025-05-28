```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if the user is the owner of the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Users Collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isOwner(userId);
      // Allow creating user document on signup
      allow create: if isAuthenticated(); 

      // Subcollections for user-specific data (mood history, gamification, etc.)
      match /moodHistory/{moodEntryId} {
        allow read, write: if isAuthenticated() && isOwner(userId);
      }
      
      // Gamification data for a user
      // This path should match the new UserGamificationData structure
      match /user_gamification/{userIdGamificationData} { // Assuming userIdGamificationData is the doc ID, often same as userId
        allow read: if isAuthenticated() && isOwner(userId);
        // Writes should ideally be handled by Cloud Functions for security and consistency
        allow write: if false; // Or restrict to specific fields if direct client write is needed for some parts
        allow create: if false; // Creation handled by Cloud Functions
      }
    }

    // Moods and Songs (existing structure, adjust as needed)
    match /moods/{moodId}/{document=**} {
      allow read: if isAuthenticated();
      // Writes to songs/moods likely admin-only or through trusted backend
      allow write: if false; // Example: Read-only for clients
    }

    // Badge Definitions (Read-only for clients)
    // Assumes badges are defined by admins/developers
    match /badge_definitions/{badgeId} {
      allow read: if isAuthenticated();
      allow write: if false; // Admin/developer managed
    }

    // Seasonal Configurations (Read-only for clients)
    // Managed by admins/developers
    match /seasonal_configurations/{seasonId} {
      allow read: if isAuthenticated();
      allow write: if false; // Admin/developer managed
    }

    // User Mood Logs (for Mood Explorer & Streaks)
    // Path: /user_mood_logs/{logId}
    // Each document contains userId, mood, timestamp
    match /user_mood_logs/{logId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      // Writes should be handled by Cloud Functions to ensure data integrity and trigger badge logic
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false; // Logs should be immutable or managed by backend
    }

    // User Song Play Logs (for Genre Collector)
    // Path: /user_song_plays/{logId}
    // Each document contains userId, songId, genre, timestamp
    match /user_song_plays/{logId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      // Writes should be handled by Cloud Functions
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false; // Logs should be immutable or managed by backend
    }

    // XP History (subcollection under users/{userId}/xpHistory)
    match /users/{userId}/xpHistory/{xpEntryId} {
        allow read: if isAuthenticated() && isOwner(userId);
        // XP history should be append-only, created by Cloud Functions
        allow create: if false; // Cloud Function controlled
        allow update, delete: if false;
    }

    // Unlocked Badges (subcollection under users/{userId}/badges/unlocked)
    // This matches the existing structure found in badgeStore.ts
    match /users/{userId}/badges/unlocked {
        allow read: if isAuthenticated() && isOwner(userId);
        // Badge unlocking is controlled by Cloud Functions
        allow write: if false; // Cloud Function controlled 
    }

  }
}
```