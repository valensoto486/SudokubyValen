import React from 'react';

export default function PopupRules({ onClose }) {
  return (
    <div className="popup-rules">
      <div className="popup-content">
        <button onClick={onClose} className="close-btn">✖</button>
        <h3>Reglas del Sudoku</h3>
        <p>
          Completa la cuadrícula para que cada fila, columna y subcuadro contenga los números del 1 al 9 sin repetir.
        </p>
        <p>
          Tienes 4 vidas. ¡Cuidado con los errores! Avanza por niveles y mejora tu récord.
        </p>
      </div>
    </div>
  );
}
