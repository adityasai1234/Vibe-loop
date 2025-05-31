# ADR-001: Gamification MVP Architecture Choices

**Date**: {{YYYY-MM-DD}} (Replace with current date)

**Status**: Proposed / Accepted

## Context

This ADR documents the key architectural decisions made for the Minimum Viable Product (MVP) of the Vibe-Loop gamification system. The goal is to rapidly deliver core gamification features (Mood Explorer Badges, Genre Collector Badges, Seasonal Achievements, Mood Streak Multipliers) to drive user engagement.

## Decision Drivers

- **Speed of Implementation**: Prioritize solutions that leverage existing Firebase infrastructure and allow for quick development.
- **Cost-Effectiveness**: Utilize Firebase's free/low-cost tiers where possible for an MVP.
- **Scalability (Initial)**: Ensure the system can handle the current user base and moderate growth, with an understanding that some aspects may need refactoring for very large scale.
- **Maintainability**: Keep the initial implementation understandable and modular.
- **Alignment with Existing Stack**: Continue using TypeScript, React, Firebase (Firestore, Cloud Functions).

## Decisions Made

1.  **Primary Data Store for Gamification State**: Firestore (`user_gamification` collection).
    *   **Reasoning**: Leverages existing Firebase expertise and real-time capabilities for frontend updates. Firestore is suitable for document-based user profiles.
    *   **Alternatives Considered**: Realtime Database (less querying flexibility), dedicated SQL/NoSQL DB (higher setup/maintenance overhead for MVP).

2.  **Badge and Configuration Management**: Firestore (`badge_definitions`, `seasonal_configurations` collections).
    *   **Reasoning**: Easy to manage definitions as documents. Readable by clients and Cloud Functions. For MVP, manual/scripted updates are acceptable.
    *   **Alternatives Considered**: Hardcoding in Cloud Functions (less flexible), dedicated admin panel (out of scope for MVP).

3.  **Event Logging for Badge Logic**: Firestore (`user_mood_logs`, `user_song_plays` collections).
    *   **Reasoning**: Simple to implement client-side writes to trigger Cloud Functions. Firestore's scalability is sufficient for MVP transaction volumes.
    *   **Alternatives Considered**: Firebase Analytics events directly triggering functions (more complex setup for custom parameters), dedicated event queue (e.g., Pub/Sub - overkill for MVP).

4.  **Backend Logic Implementation**: Firebase Cloud Functions (Node.js 20, TypeScript).
    *   **Reasoning**: Native integration with Firestore triggers. Serverless, scales automatically. Existing CI/CD pipeline supports Functions deployment.

5.  **Streak Calculation Logic**: Performed within Cloud Functions triggered by mood logs.
    *   **Reasoning**: Centralizes logic, ensures consistency. Can handle timezone considerations if necessary (though MVP uses UTC date comparisons for simplicity).
    *   **Alternatives Considered**: Client-side calculation (less reliable, prone to manipulation).

6.  **Seasonal Achievement Processing**: Scheduled Cloud Function iterating through users.
    *   **Reasoning**: Simple to implement for MVP. Daily check is sufficient.
    *   **Alternatives Considered**: Event-driven checks (more complex), per-user triggers (could be inefficient if many seasonal badges).
    *   **Known Limitation**: Iterating all users can be resource-intensive at large scale. Future optimization may involve batching or targeting active users.

7.  **Frontend State Management for Gamification**: React Context (`GamificationContext`) with real-time Firestore listener.
    *   **Reasoning**: Simple to integrate, provides reactive updates to UI components. `useGamification` hook offers a clean API.
    *   **Alternatives Considered**: Zustand/Redux (already in use for other stores, but Context is sufficient for this self-contained module), SWR/React Query (could be used for fetching definitions, but Firestore listeners cover user data well).

8.  **UI Animations**: Framer Motion.
    *   **Reasoning**: Powerful and declarative API for animations. Already potentially in use or a good fit for a modern React app.
    *   **Alternatives Considered**: CSS animations (less dynamic), other animation libraries (Framer Motion is a strong contender).

## Consequences

-   The system relies heavily on Firestore triggers and Cloud Functions, making Firebase a critical dependency.
-   Initial scalability of seasonal achievement processing for very large user numbers (millions) will need monitoring and potential refactoring.
-   Management of badge/seasonal definitions is manual or via scripts for MVP; an admin UI is a future enhancement.
-   Analytics integration is initially proxied through a Cloud Function; direct SDK integration on the client or more robust backend pipelines are future steps.

## Next Steps / Future Considerations

-   Develop runbooks for monitoring and troubleshooting.
-   Implement comprehensive unit and E2E tests.
-   Build out a basic admin interface for managing badge and seasonal configurations.
-   Refine analytics logging with direct GA4/BigQuery SDKs.
-   Optimize seasonal achievement processing if user base grows significantly.
-   Implement more sophisticated timezone handling for streaks if required by product.