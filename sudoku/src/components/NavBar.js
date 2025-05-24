//** Componente mostrado en todas las paginas */
// Menu inferior de navegación
// Permite navegar entre las diferentes páginas de la aplicación

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavBar({ active }) {
  const navigate = useNavigate();

  return (
    <nav className="nav-bar">
      <button className={active === "home" ? "active" : ""} onClick={() => navigate("/")}>🏠</button>
      <button className={active === "stats" ? "active" : ""} onClick={() => navigate("/stats")}>📊</button>
      <button className={active === "profile" ? "active" : ""} onClick={() => navigate("/profile")}>👤</button>
      <button className={active === "how" ? "active" : ""} onClick={() => navigate("/how-to-play")}>❓</button>
      <button className={active === "settings" ? "active" : ""} onClick={() => navigate("/settings")}>⚙️</button>
    </nav>
  );
}
