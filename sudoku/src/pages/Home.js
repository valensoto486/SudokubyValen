//** Pagina Inicial/Home*/
// Pagina principal de la aplicación
// Muestra el logo de la aplicación y permite navegar a otras páginas
// Permite al usuario seleccionar el modo de juego y ver sus estadísticas

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./../components/Header"
import "../index.css";
import BottomNavigation from "./../components/bottom-navigation"
import GameRulesPopup from "./../components/PopupRules"
import ModeSelection from "./../components/mode-selection"
import TipsCarousel from "./../components/tips-carousel"
import { Sparkles } from "lucide-react"

export default function Home() {
  const [showRulesPopup, setShowRulesPopup] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Marcar como cargado después de un breve retraso para las animaciones
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    // Check if it's the first visit
    const hasVisited = localStorage.getItem("hasVisitedBefore")

    if (!hasVisited) {
      // Show rules popup on first visit
      setShowRulesPopup(true)
      // Set flag in localStorage
      localStorage.setItem("hasVisitedBefore", "true")
    }

    return () => clearTimeout(timer)
  }, [])

  const closeRulesPopup = () => {
    setShowRulesPopup(false)
  }

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <link href="../index.css" rel="stylesheet"></link>
      <Header title="Sudoku by Valen" />

      <main className="flex-1 container mx-auto px-4 pb-16 pt-4 overflow-hidden">
        <AnimatePresence>{showRulesPopup && <GameRulesPopup onClose={closeRulesPopup} />}</AnimatePresence>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="space-y-8"
        >
          {/* Título animado */}
          <motion.div variants={itemVariants} className="text-center my-6">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-primary inline-flex items-center gap-2"
              animate={{
                textShadow: [
                  "0 0 0px rgba(59,130,246,0)",
                  "0 0 10px rgba(59,130,246,0.5)",
                  "0 0 0px rgba(59,130,246,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <Sparkles className="h-6 w-6 text-yellow-500" />
              Bienvenido al Desafío
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Pon a prueba tu lógica y concentración
            </motion.p>
          </motion.div>

          {/* Selección de modo */}
          <motion.div variants={itemVariants}>
            <ModeSelection />
          </motion.div>

          {/* Consejos */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <motion.div
                className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              />

              <motion.h2
                className="text-2xl font-bold mb-4 relative z-10 flex items-center gap-2"
                variants={itemVariants}
              >
                <span className="relative">
                  Consejos para hacer Sudokus
                  <motion.span
                    className="absolute bottom-0 left-0 h-1 bg-primary/50 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </span>
              </motion.h2>

              <TipsCarousel />
            </div>
          </motion.div>

          {/* Estadísticas rápidas */}
          <motion.div variants={itemVariants} className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Tus Estadísticas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                className="bg-primary/10 rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(59,130,246,0.2)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <p className="text-sm text-muted-foreground">Partidas Jugadas</p>
                <p className="text-2xl font-bold text-primary">{localStorage.getItem("totalGamesPlayed") || "0"}</p>
              </motion.div>

              <motion.div
                className="bg-green-500/10 rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(34,197,94,0.2)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <p className="text-sm text-muted-foreground">Victorias</p>
                <p className="text-2xl font-bold text-green-500">{localStorage.getItem("totalGamesWon") || "0"}</p>
              </motion.div>

              <motion.div
                className="bg-yellow-500/10 rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(234,179,8,0.2)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <p className="text-sm text-muted-foreground">Mejor Tiempo</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {localStorage.getItem("bestTimeOverall")
                    ? formatTime(Number.parseInt(localStorage.getItem("bestTimeOverall") || "0"))
                    : "--:--"}
                </p>
              </motion.div>

              <motion.div
                className="bg-purple-500/10 rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(168,85,247,0.2)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <p className="text-sm text-muted-foreground">Nivel Máximo</p>
                <p className="text-2xl font-bold text-purple-500">
                  {Math.max(
                    Number.parseInt(localStorage.getItem("level_classic") || "0"),
                    Number.parseInt(localStorage.getItem("level_expert") || "0"),
                  )}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <BottomNavigation currentPath="/home" />
    </div>
  )
}

// Función para formatear el tiempo
function formatTime(seconds) {
  if (seconds === 0) return "--:--"
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

