import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import JournalEntry from '../components/JournalEntry';
import { doc, updateDoc, arrayUnion, getDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { Box, Container, Heading, Text, useToast, Flex, Spinner } from '@chakra-ui/react';

/**
 * JournalPage component for users to write and save journal entries
 * Entries are saved to the user's document in Firestore
 */
const JournalPage = () => {
  const { currentUser, loading } = useAuth();
  const [savingEntry, setSavingEntry] = useState(false);
  const [userStreak, setUserStreak] = useState(0);
  const [userEP, setUserEP] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userRef = doc(firestore, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserStreak(userData.currentStreak || 0);
            setUserEP(userData.ep || 0);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load your data',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    fetchUserData();
  }, [currentUser, toast]);

  // Handle saving journal entry
  const handleSaveEntry = async (entryText) => {
    if (!currentUser) return;
    
    setSavingEntry(true);
    try {
      const userRef = doc(firestore, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const lastEntryDate = userData.lastEntryDate ? new Date(userData.lastEntryDate.toDate()) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if this is a consecutive day entry
        const isConsecutiveDay = lastEntryDate ? 
          new Date(lastEntryDate.getTime() + 24 * 60 * 60 * 1000).toDateString() === today.toDateString() : false;
        
        // Calculate new streak and EP
        const newStreak = isConsecutiveDay ? (userData.currentStreak || 0) + 1 : 1;
        const epBonus = isConsecutiveDay ? 5 : 3; // More EP for streak continuation
        const newEP = (userData.ep || 0) + epBonus;
        
        // Update user document
        await updateDoc(userRef, {
          moodLogs: arrayUnion({
            date: serverTimestamp(),
            note: entryText,
            mood: 'neutral' // Default mood, can be updated with sentiment analysis
          }),
          currentStreak: newStreak,
          ep: newEP,
          lastEntryDate: serverTimestamp()
        });
        
        setUserStreak(newStreak);
        setUserEP(newEP);
        
        toast({
          title: 'Entry Saved!',
          description: `+${epBonus} EP ${isConsecutiveDay ? '(Streak bonus!)' : ''}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Navigate back to dashboard after successful save
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your journal entry',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSavingEntry(false);
    }
  };

  if (loading) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Box mb={6}>
        <Heading size="lg" mb={2}>Journal</Heading>
        <Text color="gray.600" dark:color="gray.300">
          Write about your day and track your mood over time.
        </Text>
      </Box>
      
      <Box mb={4} p={4} bg="blue.50" borderRadius="md">
        <Text fontWeight="bold">Current Streak: {userStreak} day{userStreak !== 1 ? 's' : ''}</Text>
        <Text fontWeight="bold">Emotion Points: {userEP} EP</Text>
      </Box>
      
      <JournalEntry onSave={handleSaveEntry} />
    </Container>
  );
};

export default JournalPage;