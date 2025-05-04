import { Box, Container, Heading, Text, Button, Flex, Image, Stack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <Container maxW="container.xl" py={10}>
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        align="center" 
        justify="space-between"
        gap={8}
      >
        <Box maxW={{ base: '100%', md: '50%' }}>
          <Heading 
            as="h1" 
            size="2xl" 
            mb={4}
            bgGradient="linear(to-r, purple.500, blue.500)"
            bgClip="text"
          >
            Welcome to VibeLoop
          </Heading>
          
          <Text fontSize="xl" mb={6} color="gray.600">
            Track your mood, journal your thoughts, and discover music that matches how you feel.
          </Text>
          
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
            {currentUser ? (
              <Button 
                as={RouterLink} 
                to="/dashboard" 
                colorScheme="purple" 
                size="lg"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  as={RouterLink} 
                  to="/login" 
                  colorScheme="purple" 
                  size="lg"
                >
                  Get Started
                </Button>
                <Button 
                  as={RouterLink} 
                  to="/login" 
                  variant="outline" 
                  colorScheme="purple" 
                  size="lg"
                >
                  Learn More
                </Button>
              </>
            )}
          </Stack>
        </Box>
        
        <Box 
          maxW={{ base: '100%', md: '45%' }}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="xl"
        >
          <Image 
            src="/images/hero-image.jpg" 
            alt="Music and mood tracking" 
            fallbackSrc="https://via.placeholder.com/600x400?text=VibeLoop"
          />
        </Box>
      </Flex>
      
      <Box mt={20} mb={10}>
        <Heading textAlign="center" mb={10}>How It Works</Heading>
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          gap={8}
        >
          {[
            {
              title: "Track Your Mood",
              description: "Log your daily emotions and see patterns over time."
            },
            {
              title: "Journal Your Thoughts",
              description: "Write about your day and reflect on your experiences."
            },
            {
              title: "Discover Music",
              description: "Get personalized music recommendations based on your mood."
            }
          ].map((feature, idx) => (
            <Box 
              key={idx} 
              p={6} 
              borderRadius="md" 
              boxShadow="md" 
              bg="white" 
              textAlign="center"
              flex="1"
            >
              <Heading size="md" mb={4}>{feature.title}</Heading>
              <Text>{feature.description}</Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </Container>
  );
};

export default HomePage;
