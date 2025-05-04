import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Avatar,
  VStack,
  HStack,
  Divider,
  useToast,
  Flex,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useColorModeValue
} from '@chakra-ui/react';

/**
 * ProfilePage component for users to view their account details and stats
 */
const ProfilePage = () => {
  const { currentUser, logout, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userRef = doc(firestore, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load your profile data',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser, toast]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading || isLoading) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Box mb={6}>
        <Heading size="lg" mb={2}>Profile</Heading>
        <Text color="gray.600" dark:color="gray.300">
          View and manage your account details
        </Text>
      </Box>
      
      <Box 
        p={6} 
        bg={bgColor} 
        shadow="md" 
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          {/* User Info Section */}
          <HStack spacing={4}>
            <Avatar 
              size="xl" 
              src={currentUser?.photoURL} 
              name={currentUser?.displayName} 
            />
            <VStack align="start" spacing={1}>
              <Heading size="md">{currentUser?.displayName}</Heading>
              <Text color="gray.600">{currentUser?.email}</Text>
              <Text fontSize="sm" color="gray.500">
                Joined: {userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'N/A'}
              </Text>
            </VStack>
          </HStack>
          
          <Divider />
          
          {/* Stats Section */}
          <Box>
            <Heading size="sm" mb={4}>Your Stats</Heading>
            <StatGroup>
              <Stat>
                <StatLabel>Current Streak</StatLabel>
                <StatNumber>{userData?.currentStreak || 0} days</StatNumber>
              </Stat>
              
              <Stat>
                <StatLabel>Emotion Points</StatLabel>
                <StatNumber>{userData?.ep || 0} EP</StatNumber>
              </Stat>
              
              <Stat>
                <StatLabel>Journal Entries</StatLabel>
                <StatNumber>{userData?.moodLogs?.length || 0}</StatNumber>
              </Stat>
            </StatGroup>
          </Box>
          
          <Divider />
          
          {/* Actions Section */}
          <Box>
            <Button colorScheme="red" variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
};

export default ProfilePage;