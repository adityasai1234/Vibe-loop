import { Routes, Route } from 'react-router-dom';
import { 
  Box, 
  ChakraProvider, 
  Flex, 
  IconButton, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  Progress, 
  Text, 
  VStack,
  useColorModeValue,
  Grid,
  GridItem,
  Image,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react';
import { FaMusic, FaPlus, FaSearch, FaHome, FaCompactDisc, FaHeart, FaClock, FaList } from 'react-icons/fa';
import { BsFillVolumeUpFill } from 'react-icons/bs';
import { RiSkipBackFill, RiSkipForwardFill, RiPlayFill, RiPauseFill } from 'react-icons/ri';
import Navbar from './components/Navbar';

function App() {
  const bgGradient = useColorModeValue(
    'linear(135deg, #1a1a2e 0%, #16213e 100%)',
    'linear(135deg, #1a1a2e 0%, #16213e 100%)'
  );
  
  return (
    <ChakraProvider>
      <Box minH="100vh">
        {/* Header Section */}
        <Flex justify="space-between" align="center" p={6} borderBottom="1px solid rgba(255, 255, 255, 0.1)">
          <Flex align="center">
            <Box as={FaMusic} color="purple.500" fontSize="2xl" mr={3} />
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, purple.500, indigo.600)"
              bgClip="text"
            >
              Vibe Loop
            </Text>
          </Flex>
          
          <Flex align="center" gap={4}>
            <IconButton
              aria-label="Add music"
              icon={<FaPlus />}
              colorScheme="purple"
              rounded="full"
              px={6}
              leftIcon={<FaPlus />}
            >
              Add Music
            </IconButton>
            
            <InputGroup maxW="64">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search..."
                variant="filled"
                bg="rgba(255, 255, 255, 0.1)"
                _hover={{ bg: 'rgba(255, 255, 255, 0.15)' }}
                _focus={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                rounded="full"
              />
            </InputGroup>
          </Flex>
        </Flex>

        <Flex flex={1} overflow="hidden">
          {/* Sidebar */}
          <Box
            w={{ base: 0, md: 64 }}
            borderRight="1px solid rgba(255, 255, 255, 0.1)"
            p={4}
            display={{ base: 'none', md: 'block' }}
          >
            <VStack spacing={2} align="stretch">
              {[
                { icon: FaHome, label: 'Home', isActive: true },
                { icon: FaCompactDisc, label: 'Discover' },
                { icon: FaHeart, label: 'Favorites' },
                { icon: FaClock, label: 'Recent' },
                { icon: FaList, label: 'Playlists' },
              ].map((item, index) => (
                <Flex
                  key={index}
                  align="center"
                  p={3}
                  borderRadius="lg"
                  bg={item.isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                  _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
                  cursor="pointer"
                >
                  <Box as={item.icon} mr={3} />
                  <Text>{item.label}</Text>
                </Flex>
              ))}
            </VStack>
          </Box>

          {/* Main Content */}
          <Box flex={1} p={8} overflowY="auto">
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {/* Music Player Section */}
              <GridItem colSpan={3} bg="rgba(255, 255, 255, 0.05)" borderRadius="2xl" p={6}>
                <Flex direction="column" align="center">
                  <Image
                    src="https://source.unsplash.com/random/600x600/?music"
                    alt="Album Art"
                    w="300px"
                    h="300px"
                    borderRadius="2xl"
                    boxShadow="0 15px 30px rgba(0, 0, 0, 0.3)"
                    _hover={{ transform: 'scale(1.03)' }}
                    transition="transform 0.3s ease"
                  />
                  
                  // In the music progress section, replace the Progress component with:
                  <Box w="full" mt={8}>
                    <Slider 
                      aria-label="music-progress" 
                      value={30} 
                      isReadOnly
                    >
                      <SliderTrack bg="rgba(255, 255, 255, 0.1)">
                        <SliderFilledTrack bgGradient="linear(to-r, purple.500, pink.500)" />
                      </SliderTrack>
                    </Slider>
                    
                    <Flex justify="space-between" mt={4} px={2}>
                      <Text fontSize="sm">2:30</Text>
                      <Text fontSize="sm">4:15</Text>
                    </Flex>
                  </Box>

                  <HStack spacing={6} mt={6}>
                    <IconButton
                      aria-label="Previous"
                      icon={<RiSkipBackFill />}
                      variant="ghost"
                      fontSize="2xl"
                    />
                    <IconButton
                      aria-label="Play"
                      icon={<RiPlayFill />}
                      colorScheme="purple"
                      rounded="full"
                      size="lg"
                      fontSize="3xl"
                    />
                    <IconButton
                      aria-label="Next"
                      icon={<RiSkipForwardFill />}
                      variant="ghost"
                      fontSize="2xl"
                    />
                  </HStack>

                  <HStack spacing={4} mt={6} w="200px">
                    <BsFillVolumeUpFill />
                    <Slider defaultValue={70}>
                      <SliderTrack bg="rgba(255, 255, 255, 0.1)">
                        <SliderFilledTrack bg="purple.500" />
                      </SliderTrack>
                      <SliderThumb boxSize={4} />
                    </Slider>
                  </HStack>
                </Flex>
              </GridItem>
            </Grid>
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;
