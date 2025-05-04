import { firestore } from './firebaseConfig';

export async function saveMoodEntry(userId, moodData) {
  if (!userId) throw new Error('User ID is required');
  const dateKey = new Date().toISOString().split('T')[0];

  // Add timestamp and allow for optional fields
  const entry = {
    ...moodData,
    createdAt: new Date(),
    dateKey,
    // stickers, weather, location, privacy, etc. can be included in moodData
  };

  const docRef = await firestore
    .collection('users')
    .doc(userId)
    .collection('moods')
    .doc(dateKey)
    .set(entry);

  return docRef;
}
