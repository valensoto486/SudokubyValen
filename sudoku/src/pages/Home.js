import React, { useState } from 'react';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import PopupRules from '../components/PopupRules';

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="home-page">
      <Header />
      
      <NavBar active="home" />
    </div>
  );
}
