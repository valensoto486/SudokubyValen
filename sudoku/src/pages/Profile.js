import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

export default function Profile() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem("sudokuUsername");
    if (stored) setUsername(stored);
  }, []);

  const handleChange = (e) => {
    setUsername(e.target.value);
    localStorage.setItem("sudokuUsername", e.target.value);
  };

  return (
    <div className="page">
      <h2>👤 Perfil</h2>
      <label>
        Nombre de usuario:
        <input type="text" value={username} onChange={handleChange} />
      </label>
      <NavBar active="profile" />
    </div>
  );
}
