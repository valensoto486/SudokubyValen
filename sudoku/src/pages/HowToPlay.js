import React from 'react';
import NavBar from '../components/NavBar';

export default function HowToPlay() {
  return (
    <div className="page">
      <h2>📖 ¿Cómo jugar?</h2>
      <ol>
        <li>Completa la cuadrícula con los números del 1 al 9.</li>
        <li>No puedes repetir números en filas, columnas ni subcuadros.</li>
        <li>Hazlo lo más rápido posible para ganar más puntos.</li>
        <li>Usa notas si lo necesitas, ¡pero sin hacer trampa! 😜</li>
      </ol>
      <NavBar active="how" />
    </div>
  );
}
