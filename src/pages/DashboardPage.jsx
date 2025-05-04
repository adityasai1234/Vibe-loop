import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  SimpleGrid, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText,
  Button,
  Flex,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { firestore } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          // User document doesn't exist yet
          setUserData({
            currentStreak: 0,
            ep: 0,
            moodLogs: []
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your dashboard data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, toast]);

  if (loading) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={8}>
        <Heading size="xl" mb={2}>Welcome back{currentUser?.displayName ? `, ${currentUser.displayName}` : ''}!</Heading>
        <Text color="gray.600">
          Track your mood, journal your thoughts, and discover music that matches how you feel.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
        <Stat
          px={4}
          py={5}
          shadow="md"
          border="1px"
          borderColor="gray.200"
          rounded="lg"
          bg="white"
        >
          <StatLabel fontSize="lg">Current Streak</StatLabel>
          <StatNumber fontSize="3xl">{userData?.currentStreak || 0}</StatNumber>
          <StatHelpText>Days in a row</StatHelpText>
        </Stat>

        <Stat
          px={4}
          py={5}
          shadow="md"
          border="1px"
          borderColor="gray.200"
          rounded="lg"
          bg="white"
        >
          <StatLabel fontSize="lg">Emotion Points</StatLabel>
          <StatNumber fontSize="3xl">{userData?.ep || 0}</StatNumber>
          <StatHelpText>Total EP earned</StatHelpText>
        </Stat>

        <Stat
          px={4}
          py={5}
          shadow="md"
          border="1px"
          borderColor="gray.200"
          rounded="lg"
          bg="white"
        >
          <StatLabel fontSize="lg">Journal Entries</StatLabel>
          <StatNumber fontSize="3xl">{userData?.moodLogs?.length || 0}</StatNumber>
          <StatHelpText>Total entries</StatHelpText>
        </Stat>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Box
          p={6}
          shadow="md"
          border="1px"
          borderColor="gray.200"
          rounded="lg"
          bg="white"
        >
          <Heading size="md" mb={4}>Today's Journal</Heading>
          <Text mb={4}>
            {userData?.moodLogs?.length > 0 
              ? "Continue tracking your mood and thoughts."
              : "Start tracking your mood and thoughts today!"}
          </Text>
          <Button
            as={RouterLink}
            to="/journal"
            colorScheme="blue"
            size="md"
          >
            Write Journal Entry
          </Button>
        </Box>

        <Box
          p={6}
          shadow="md"
          border="1px"
          borderColor="gray.200"
          rounded="lg"
          bg="white"
        >
          <Heading size="md" mb={4}>Music Recommendations</Heading>
          <Text mb={4}>
            Discover music that matches your current mood.
          </Text>
          <Button
            as={RouterLink}
            to="/music"
            colorScheme="purple"
            size="md"
          >
            Get Music Recommendations
          </Button>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default DashboardPage;
