import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Stack, 
  Link, 
  useColorModeValue,
  useDisclosure,
  IconButton,
  Collapse
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { currentUser, logout } = useAuth();
  
  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      width="100%"
      zIndex="1000"
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      px={4}
    >
      <Flex
        h={16}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onToggle}
          icon={
            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
          }
          variant={'ghost'}
          aria-label={'Toggle Navigation'}
        />
        
        <Flex alignItems={'center'}>
          <Text
            as={RouterLink}
            to="/"
            fontFamily={'heading'}
            fontWeight={'bold'}
            color={useColorModeValue('gray.800', 'white')}
            fontSize="xl"
          >
            VibeLoop
          </Text>
        </Flex>

        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
          <DesktopNav currentUser={currentUser} />
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {currentUser ? (
            <Button
              as={RouterLink}
              to="/profile"
              fontSize={'sm'}
              fontWeight={400}
              variant={'link'}
            >
              Profile
            </Button>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'blue.400'}
                _hover={{
                  bg: 'blue.300',
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav currentUser={currentUser} />
      </Collapse>
    </Box>
  );
};

const DesktopNav = ({ currentUser }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  
  // Define navigation items based on authentication status
  const navItems = currentUser 
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Journal', href: '/journal' },
        { label: 'Music', href: '/music' },
      ]
    : [
        { label: 'Features', href: '/#features' },
        { label: 'About', href: '/#about' },
      ];
  
  return (
    <Stack direction={'row'} spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Link
            as={RouterLink}
            p={2}
            to={navItem.href}
            fontSize={'sm'}
            fontWeight={500}
            color={linkColor}
            _hover={{
              textDecoration: 'none',
              color: linkHoverColor,
            }}
          >
            {navItem.label}
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = ({ currentUser }) => {
  // Define navigation items based on authentication status
  const navItems = currentUser 
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Journal', href: '/journal' },
        { label: 'Music', href: '/music' },
        { label: 'Profile', href: '/profile' },
      ]
    : [
        { label: 'Features', href: '/#features' },
        { label: 'About', href: '/#about' },
        { label: 'Sign In', href: '/login' },
        { label: 'Sign Up', href: '/signup' },
      ];
  
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }) => {
  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={RouterLink}
        to={href}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
      </Flex>
    </Stack>
  );
};

export default Navbar;
