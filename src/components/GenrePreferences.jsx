import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Checkbox, 
  Button, 
  useToast, 
  Spinner,
  Badge,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { getUserGenres, saveUserGenres } from '../services/profileService';
import { auth } from '../firebase/firebase';

// Common Spotify genres
const AVAILABLE_GENRES = [
  'pop', 'rock', 'hip-hop', 'r-n-b', 'electronic', 'jazz', 
  'classical', 'country', 'folk', 'reggae', 'blues', 
  'metal', 'indie', 'ambient', 'dance', 'latin'
];

const GenrePreferences = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    const fetchUserGenres = async () => {
      setIsLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const genres = await getUserGenres(user.uid);
          if (genres && genres.length > 0) {
            setSelectedGenres(genres);
          }
        }
      } catch (error) {
        console.error('Error fetching user genres:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your genre preferences',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserGenres();
  }, [toast]);
  
  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else {
        // Limit to 5 genres
        if (prev.length >= 5) {
          toast({
            title: 'Maximum genres reached',
            description: 'You can select up to 5 genres',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
          return prev;
        }
        return [...prev, genre];
      }
    });
  };
  
  const handleSave = async () => {
    if (selectedGenres.length === 0) {
      toast({
        title: 'No genres selected',
        description: 'Please select at least one genre',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await saveUserGenres(user.uid, selectedGenres);
        toast({
          title: 'Preferences saved',
          description: 'Your genre preferences have been updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error saving genres:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your preferences',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your preferences...</Text>
      </Box>
    );
  }
  
  return (
    <Box 
      p={6} 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
    >
      <Heading size="lg" mb={4}>Music Genre Preferences</Heading>
      <Text mb={6}>
        Select up to 5 genres you enjoy. These will be used to personalize your music recommendations.
      </Text>
      
      {selectedGenres.length > 0 && (
        <Box mb={6}>
          <Text fontWeight="bold" mb={2}>Your selected genres:</Text>
          <Flex flexWrap="wrap" gap={2}>
            {selectedGenres.map(genre => (
              <Badge 
                key={genre} 
                colorScheme="purple" 
                p={2} 
                borderRadius="full"
                fontSize="sm"
              >
                {genre}
              </Badge>
            ))}
          </Flex>
        </Box>
      )}
      
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        {AVAILABLE_GENRES.map(genre => (
          <Checkbox 
            key={genre}
            isChecked={selectedGenres.includes(genre)}
            onChange={() => handleGenreToggle(genre)}
            colorScheme="purple"
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </Checkbox>
        ))}
      </SimpleGrid>
      
      <Button
        colorScheme="purple"
        isLoading={isSaving}
        loadingText="Saving..."
        isDisabled={selectedGenres.length === 0}
        onClick={handleSave}
        width={{ base: 'full', md: 'auto' }}
      >
        Save Preferences
      </Button>
    </Box>
  );
};

export default GenrePreferences;