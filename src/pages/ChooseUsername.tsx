import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { firestoreService } from '../services/firestoreService';
import { useGamification } from '../context/GamificationContext';
import { UserGamificationData } from '../types/gamification';

const ChooseUsernamePage = () => {
  const { currentUser } = useAuthContext();
  const { gamificationData } = useGamification();
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (gamificationData) {
      // If user data already exists, redirect or show a message
    }
  }, [gamificationData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      if (!currentUser?.uid) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        // Update user document with the chosen username
        await firestoreService.updateDocument('users', currentUser.uid, { username });

        // Optionally, initialize gamification data for the user
        const initialGamificationData: UserGamificationData = {
          userId: currentUser.uid,
          username,
          xp: 0,
          level: 1,
          moodExplorerBadges: [],
          genreCollectorBadges: [],
          seasonalAchievements: [],
        };
        await firestoreService.setDocument('user_gamification', currentUser.uid, initialGamificationData);

        // Redirect or show success message
      } catch (err) {
        console.error('Error setting username:', err);
        setError('Failed to set username. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [currentUser, username]
  );

  return (
    <div>
      <h1>Choose a Username</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Setting...' : 'Set Username'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ChooseUsernamePage;