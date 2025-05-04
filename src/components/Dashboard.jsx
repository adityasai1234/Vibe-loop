import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { Box, Button, Container, Flex, Heading, Text, Avatar, VStack, HStack, Spinner } from '@chakra-ui/react';

const Dashboard = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
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
    <Container maxW="container.xl" py={8}>
      <Flex direction="column" gap={6}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg">Dashboard</Heading>
          <HStack spacing={4}>
            {currentUser && (
              <HStack>
                <Avatar size="sm" src={currentUser.photoURL} name={currentUser.displayName} />
                <Text>{currentUser.displayName}</Text>
              </HStack>
            )}
            <Button colorScheme="blue" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>
        </Flex>

        <Box p={6} bg="white" shadow="md" borderRadius="lg">
          <VStack align="stretch" spacing={4}>
            <Heading size="md">Welcome to Vibeloop!</Heading>
            <Text>This is your personal dashboard where you can track your mood, create journal entries, and discover music that matches your vibe.</Text>
            
            {/* Dashboard content will go here */}
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold">Coming Soon:</Text>
              <Text>- Mood tracking visualization</Text>
              <Text>- Journal entries</Text>
              <Text>- Music recommendations</Text>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default Dashboard;