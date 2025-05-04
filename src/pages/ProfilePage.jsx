import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Divider, 
  VStack,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { auth } from '../firebase/firebase';
import { getUserProfile } from '../services/profileService';
import GenrePreferences from '../components/GenrePreferences';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userData = await getUserProfile(user.uid);
          setProfile(userData || {});
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
  }, [toast]);
  
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
        <Box>
          <Heading size="xl" mb={2}>Your Profile</Heading>
          <Text color="gray.500">
            Manage your account and preferences
          </Text>
        </Box>
        
        <Divider />
        
        <Box>
          <Heading size="md" mb={4}>Account Information</Heading>
          <Text><strong>Email:</strong> {auth.currentUser?.email}</Text>
          <Text><strong>Member since:</strong> {profile?.createdAt ? new Date(profile.createdAt.toDate()).toLocaleDateString() : 'N/A'}</Text>
        </Box>
        
        <Divider />
        
        <GenrePreferences />
      </VStack>
    </Container>
  );
};

export default ProfilePage;