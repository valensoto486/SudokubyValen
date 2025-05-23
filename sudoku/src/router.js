import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import HowToPlay from './pages/HowToPlay';
import Settings from './pages/Settings';
import InicialScreen from './components/inicialScreen'; 

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InicialScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
