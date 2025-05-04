import { Spinner as ChakraSpinner } from '@chakra-ui/react';

const CustomSpinner = React.forwardRef((props, ref) => {
  return <ChakraSpinner ref={ref} {...props} />;
});

CustomSpinner.displayName = 'CustomSpinner';

export default CustomSpinner;
