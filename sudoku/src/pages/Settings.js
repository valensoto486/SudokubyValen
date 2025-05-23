import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

export default function Settings() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('sudokuTheme') || 'light';
    setTheme(storedTheme);
    document.body.className = storedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'neon' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('sudokuTheme', newTheme);
  };

  return (
    <div className="page">
      <h2>⚙️ Configuración</h2>
      <div>
        <label>
          Tema:
          <button onClick={toggleTheme}>
            Cambiar a {theme === 'light' ? '🌈 Neón' : '🌞 Claro'}
          </button>
        </label>
      </div>
      <NavBar active="settings" />
    </div>
  );
}
