import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useDebounce } from '../hooks/useDebounce'; // Assuming you have a debounce hook

const USERNAME_REGEX = /^[a-z0-9_]{3,15}$/;

const ChooseUsernamePage: React.FC = () => {
  const { user: currentUser, setUser } = useAuthContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isUnique, setIsUnique] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedUsername = useDebounce(username, 500);

  const checkUsernameUniqueness = useCallback(async (uname: string) => {
    if (!uname || !USERNAME_REGEX.test(uname)) {
      setIsUnique(true); // Don't check if invalid or empty
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', uname));
      const querySnapshot = await getDocs(q);
      setIsUnique(querySnapshot.empty);
      if (!querySnapshot.empty) {
        setError('Username already taken.');
      }
    } catch (err) {
      console.error('Error checking username:', err);
      setError('Error checking username. Please try again.');
      setIsUnique(false); // Assume not unique on error to be safe
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (debouncedUsername) {
      checkUsernameUniqueness(debouncedUsername);
    }
  }, [debouncedUsername, checkUsernameUniqueness]);

  useEffect(() => {
    if (!currentUser?.username) {
      navigate('/'); // Already has a username, redirect
    }
  }, [currentUser, navigate]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value.toLowerCase();
    setUsername(newUsername);
    setIsValid(USERNAME_REGEX.test(newUsername));
    if (!USERNAME_REGEX.test(newUsername)) {
        setError('Username must be 3-15 lowercase letters, numbers, or underscores.');
    } else {
        setError(null); // Clear regex error if it becomes valid
    }
    // Reset uniqueness status until debounce check completes
    setIsUnique(true); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !isUnique || isLoading || !currentUser) {
      setError('Cannot submit. Please fix errors or wait for checks.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const newUserProfile = {
        id: currentUser.id, // Include id
        name: currentUser.name, // Include name
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName, // Use existing or from auth
        photoURL: currentUser.photoURL, // Use existing or from auth
        username: username,
        createdAt: serverTimestamp(), // Preserve if exists, else new
      };

      await setDoc(userDocRef, newUserProfile); // This updates context and Firestore
      setUser(newUserProfile); // Update context
      navigate('/'); // Navigate to home or dashboard
    } catch (err) {
      console.error('Error saving username:', err);
      setError('Failed to save username. Please try again.');
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-purple-400">Choose Your Username</h1>
        <p className="text-center text-gray-400">
          Welcome, {currentUser.displayName || 'User'}! Pick a unique username to get started.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">@</span>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                required
                className={`block w-full pl-7 pr-12 sm:text-sm rounded-md bg-gray-700 border-gray-600 focus:ring-purple-500 focus:border-purple-500
                            ${!isValid && username.length > 0 ? 'border-red-500' : ''}
                            ${!isUnique && isValid ? 'border-red-500' : ''}
                            ${isUnique && isValid && username.length > 0 ? 'border-green-500' : ''}`}
                placeholder="your_cool_name"
                aria-describedby="username-validation"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>}
                {!isLoading && username.length > 0 && isValid && isUnique && <span className="text-green-500">✅</span>}
                {!isLoading && username.length > 0 && (!isValid || !isUnique) && <span className="text-red-500">❌</span>}
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-400" id="username-validation">{error}</p>}
            {!error && !isValid && username.length > 0 && <p className="mt-2 text-sm text-yellow-400">Must be 3-15 lowercase letters, numbers, or underscores.</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid || !isUnique || isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Username'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChooseUsernamePage;