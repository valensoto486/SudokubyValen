//** Componente mostrado en el Home */
// El componente ModeSelection permite al usuario seleccionar el modo de juego.
// El modo de juego determina la dificultad del juego y la cantidad de celdas vacías iniciales.
// El modo de juego también afecta la puntuación final del jugador.
// El modo de juego se guarda en el LocalStorage para que el usuario pueda continuar jugando desde donde lo dejó.

"use client"

import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import { Trophy, Brain, Sparkles } from "lucide-react"

export default function ModeSelection() {
  const router = useNavigate()

  const handleModeSelection = (mode) => {
    // Guarda la seleccion del juego en el LocalStorage
    localStorage.setItem("gameMode", mode)
    // Nivel de dificultad del juego
    router.push(`/difficulty?mode=${mode}`)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="relative">
          Elige tu modo de juego
          <motion.span
            className="absolute -bottom-1 left-0 h-1 bg-primary/50 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          />
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative group"
        >
          {/* Efectos de fondo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />

          <div
            className="relative overflow-hidden rounded-xl cursor-pointer border-2 border-blue-500/50 group-hover:border-blue-500 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20"
            onClick={() => handleModeSelection("classic")}
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <Trophy className="h-10 w-10" />
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                </motion.div>
              </div>

              <h3 className="text-2xl font-bold mb-2">Modo Clásico</h3>
              <p className="text-sm opacity-90 mb-4">
                Sudoku tradicional con reglas clásicas. Completa los subcuadros de 3x3 con números del 1 al 9.
              </p>

              <div className="grid grid-cols-3 grid-rows-3 gap-1 w-24 h-24 mx-auto mt-4 bg-white/10 p-1 rounded-lg">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/20 rounded-sm flex items-center justify-center"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.4)" }}
                  >
                    {i % 3 === 0 && <span className="text-white font-bold text-sm">{i + 1}</span>}
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Seleccionar
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative group"
        >
          {/* Efectos de fondo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          />

          <div
            className="relative overflow-hidden rounded-xl cursor-pointer border-2 border-purple-500/50 group-hover:border-purple-500 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/20"
            onClick={() => handleModeSelection("expert")}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <Brain className="h-10 w-10" />
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                >
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                </motion.div>
              </div>

              <h3 className="text-2xl font-bold mb-2">Modo Experto</h3>
              <p className="text-sm opacity-90 mb-4">
                Versiones más difíciles con regiones irregulares en lugar de subcuadros normales.
              </p>

              <div className="w-24 h-24 mx-auto mt-4 bg-white/10 p-1 rounded-lg relative">
                {/* Regiones irregulares para ilustrar */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  <div className="col-span-2 row-span-1 border border-white/40 rounded-sm m-0.5"></div>
                  <div className="col-span-1 row-span-2 border border-white/40 rounded-sm m-0.5"></div>
                  <div className="col-span-1 row-span-1 border border-white/40 rounded-sm m-0.5"></div>
                  <div className="col-span-1 row-span-1 border border-white/40 rounded-sm m-0.5"></div>
                  <div className="col-span-2 row-span-1 border border-white/40 rounded-sm m-0.5"></div>
                </div>

                {/* Algunos números para ilustrar */}
                <div className="absolute top-1 left-3 text-white font-bold text-sm">3</div>
                <div className="absolute top-9 left-9 text-white font-bold text-sm">7</div>
                <div className="absolute top-16 left-5 text-white font-bold text-sm">2</div>
              </div>

              <motion.button
                className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Seleccionar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
