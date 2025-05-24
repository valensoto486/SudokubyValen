//** Pagina Estadísticas */
// Muestra las estadísticas del usuario 
// como partidas jugadas, ganadas, perdidas y mejor tiempo.

import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

export default function Stats() {
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    bestTime: null
  });

  useEffect(() => {
    const stored = localStorage.getItem("sudokuStats");
    if (stored) setStats(JSON.parse(stored));
  }, []);

  return (
    <div className="page">
      <h2>📊 Mis Estadísticas</h2>
      <ul className="stats-list">
        <li>🧩 Partidas jugadas: {stats.gamesPlayed}</li>
        <li>🏆 Ganadas: {stats.wins}</li>
        <li>💥 Perdidas: {stats.losses}</li>
        <li>⏱️ Mejor tiempo: {stats.bestTime ?? 'N/A'}</li>
      </ul>
      <NavBar active="stats" />
    </div>
  );
}
