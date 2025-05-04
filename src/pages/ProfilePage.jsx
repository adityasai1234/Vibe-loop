import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Divider, 
  VStack,
  Spinner,
  useToast,
  Button,
  Avatar,
  Flex
} from '@chakra-ui/react';
import { useAuth } from '../firebase/AuthContext';
import { firestore } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        } else {
          setProfile({});
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your profile',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [currentUser, toast]);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your profile...</Text>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
          <Avatar 
            size="2xl" 
            name={currentUser?.displayName || 'User'} 
            src={currentUser?.photoURL} 
          />
          
          <Box>
            <Heading size="xl" mb={2}>{currentUser?.displayName || 'Your Profile'}</Heading>
            <Text color="gray.500" fontSize="lg">
              {currentUser?.email}
            </Text>
          </Box>
        </Flex>
        
        <Divider />
        
        <Box>
          <Heading size="md" mb={4}>Account Information</Heading>
          <Text><strong>Email:</strong> {currentUser?.email}</Text>
          <Text><strong>Member since:</strong> {profile?.createdAt ? new Date(profile.createdAt.toDate()).toLocaleDateString() : 'N/A'}</Text>
          <Text><strong>Current Streak:</strong> {profile?.currentStreak || 0} days</Text>
          <Text><strong>Emotion Points:</strong> {profile?.ep || 0} EP</Text>
        </Box>
        
        <Divider />
        
        <Box>
          <Heading size="md" mb={4}>Account Actions</Heading>
          <Button colorScheme="red" onClick={handleLogout}>
            Log Out
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default ProfilePage;
