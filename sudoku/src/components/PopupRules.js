// Pop up mostrado al ingresar a la aplicación, 
// despues del logo y antes de la pantalla principal
// Muestra las reglas del juego sudoku

"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"

export default function GameRulesPopup({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-primary/50 overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-2 border-b">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-center">Reglas del Juego</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Objetivo:</h3>
            <p>
              Completar la cuadrícula de 9×9 de manera que cada fila, columna y cada sección de 3×3 contenga los
              dígitos del 1 al 9 sin repetir ninguno.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Cómo jugar:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cada fila debe contener los números del 1 al 9 sin repetir.</li>
              <li>Cada columna debe contener los números del 1 al 9 sin repetir.</li>
              <li>Cada subcuadro de 3×3 debe contener los números del 1 al 9 sin repetir.</li>
              <li>Tienes 4 vidas por partida. Cada error te resta una vida.</li>
              <li>El tiempo corre mientras juegas. ¡Intenta batir tu récord!</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Consejos:</h3>
            <p>
              Usa las notitas para anotar posibles números en cada celda. Mantén presionado una celda para activar
              esta función.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}


