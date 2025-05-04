import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Divider, 
  Flex, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  Stack, 
  Text, 
  useToast 
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Stack spacing={4} mb={8} align="center">
          <Heading fontSize="2xl">Sign in to VibeLoop</Heading>
          <Text fontSize="md" color="gray.600">
            Track your mood and discover music that matches how you feel
          </Text>
        </Stack>

        <Button
          w="full"
          colorScheme="red"
          leftIcon={<FaGoogle />}
          onClick={handleGoogleLogin}
          isLoading={isLoading}
          mb={4}
        >
          Sign in with Google
        </Button>

        <Flex align="center" my={4}>
          <Divider />
          <Text px={3} color="gray.500">
            OR
          </Text>
          <Divider />
        </Flex>

        <form onSubmit={handleEmailLogin}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              w="full"
              mt={4}
            >
              Sign in
            </Button>
          </Stack>
        </form>

        <Text mt={6} textAlign="center">
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'blue' }}>
            Sign up
          </Link>
        </Text>
      </Box>
    </Container>
  );
};

export default LoginPage;