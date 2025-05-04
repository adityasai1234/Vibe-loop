import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./firebase/AuthContext";

const theme = extendTheme({
  styles: {
    global: {
      '@keyframes gradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
      body: {
        bg: 'linear-gradient(45deg, #1a1a2e 0%, #4a235a 30%, #6a1b9a 60%, #9c27b0 100%)',
        color: "white",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        backgroundAttachment: 'fixed',
        backgroundSize: '400% 400%',
        animation: 'gradient 12s ease infinite',
      },
    },
  },
});

// Add this to your index.html head section
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);

