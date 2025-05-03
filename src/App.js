import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SpotifyLogin from "./components/SpotifyLogin";
// ... import other components as needed ...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spotify-callback" element={<SpotifyLogin />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;