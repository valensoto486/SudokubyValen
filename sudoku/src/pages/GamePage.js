//** Pagina Juego clasico o experto */
// Muestra el tablero de juego con las reglas y controles
// Permite al usuario jugar y ver sus estadísticas
// Permite al usuario reiniciar el juego y volver a la página de inicio

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom" 
import GameBoard from "../components/gameComponents/game-board"
import GameHeader from "../components/gameComponents/game-header"
import { Home, User, RotateCcw, Share } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/Header"
import BottomNavigation from "../components/bottom-navigation"

export default function GamePage() {
  const navigate = useNavigate() 
  const location = useLocation() 
  const [gameMode, setGameMode] = useState("")
  const [gameDifficulty, setGameDifficulty] = useState("")
  const [lives, setLives] = useState(4)
  const [time, setTime] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isGameWon, setIsGameWon] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Función para obtener parámetros de URL en React Router
    const getSearchParams = () => {
      const searchParams = new URLSearchParams(location.search)
      return {
        get: (key) => searchParams.get(key)
      }
    }

    const searchParams = getSearchParams()
    
    // Get game settings from URL or localStorage
    const mode = searchParams.get("mode") || localStorage.getItem("gameMode") || "classic"
    const difficulty = searchParams.get("difficulty") || localStorage.getItem("gameDifficulty") || "facil"

    setGameMode(mode)
    setGameDifficulty(difficulty)

    // Start the timer
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)

    // Update games played count
    const gamesPlayedKey = `gamesPlayed_${mode}_${difficulty}`
    const currentGamesPlayed = Number.parseInt(localStorage.getItem(gamesPlayedKey) || "0")
    localStorage.setItem(gamesPlayedKey, (currentGamesPlayed + 1).toString())

    // Update total games played
    const totalGamesPlayed = Number.parseInt(localStorage.getItem("totalGamesPlayed") || "0")
    localStorage.setItem("totalGamesPlayed", (totalGamesPlayed + 1).toString())

    return () => clearInterval(timer)
  }, [location.search]) // Dependencia cambiada

  const handleLoseLife = () => {
    setLives((prevLives) => {
      const newLives = prevLives - 1
      if (newLives <= 0) {
        setIsGameOver(true)

        // Update games lost count
        const gamesLostKey = `gamesLost_${gameMode}_${gameDifficulty}`
        const currentGamesLost = Number.parseInt(localStorage.getItem(gamesLostKey) || "0")
        localStorage.setItem(gamesLostKey, (currentGamesLost + 1).toString())
      }
      return newLives
    })
  }

  const handleGameWon = () => {
    setIsGameWon(true)
    setShowConfetti(true)

    // Save the best time if it's better than the previous record
    const bestTimeKey = `bestTime_${gameMode}_${gameDifficulty}`
    const currentBestTime = localStorage.getItem(bestTimeKey)

    if (!currentBestTime || Number.parseInt(currentBestTime) > time) {
      localStorage.setItem(bestTimeKey, time.toString())

      // Also update overall best time if needed
      const overallBestTime = localStorage.getItem("bestTimeOverall")
      if (!overallBestTime || Number.parseInt(overallBestTime) > time) {
        localStorage.setItem("bestTimeOverall", time.toString())
      }

      // Show alert instead of toast
      alert(`¡Nuevo récord! Has establecido un nuevo mejor tiempo: ${formatTime(time)}`)
    }

    // Update games won count
    const gamesWonKey = `gamesWon_${gameMode}_${gameDifficulty}`
    const currentGamesWon = Number.parseInt(localStorage.getItem(gamesWonKey) || "0")
    localStorage.setItem(gamesWonKey, (currentGamesWon + 1).toString())

    // Update total games won
    const totalGamesWon = Number.parseInt(localStorage.getItem("totalGamesWon") || "0")
    localStorage.setItem("totalGamesWon", (totalGamesWon + 1).toString())

    // Update level progress
    const currentLevelKey = `level_${gameMode}`
    const currentLevel = Number.parseInt(localStorage.getItem(currentLevelKey) || "0")

    // Map difficulty to level number
    const difficultyLevel = gameDifficulty === "facil" ? 1 : gameDifficulty === "medio" ? 2 : 3

    if (difficultyLevel > currentLevel) {
      localStorage.setItem(currentLevelKey, difficultyLevel.toString())
    }
  }

  const handleRestartGame = () => {
    setLives(4)
    setTime(0)
    setIsGameOver(false)
    setIsGameWon(false)
    setShowConfetti(false)
  }

  const handleGoHome = () => {
    navigate("/home") // navigate en lugar de router.push
  }

  const handleGoToProfile = () => {
    navigate("/profile") // navigate en lugar de router.push
  }

  const handleShareResult = () => {
    const text = `¡He completado un Sudoku ${gameMode === "classic" ? "Clásico" : "Experto"} en dificultad ${
      gameDifficulty === "facil" ? "Fácil" : gameDifficulty === "medio" ? "Media" : "Difícil"
    } con un tiempo de ${formatTime(time)}! #SudokuByValen`

    if (navigator.share) {
      navigator
        .share({
          title: "Mi resultado en Sudoku by Valen",
          text: text,
        })
        .catch((err) => {
          console.error("Error al compartir:", err)
        })
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(text).then(() => {
        alert("¡Copiado al portapapeles! Puedes pegar el texto para compartir tu resultado.")
      })
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title={`Sudoku ${gameMode === "classic" ? "Clásico" : "Experto"}`} />

      <main className="flex-1 container mx-auto px-4 pb-16 pt-4">
        <GameHeader gameMode={gameMode} gameDifficulty={gameDifficulty} lives={lives} time={time} />

        <div className="flex justify-between w-full max-w-md mx-auto mb-4">
          <button 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10"
            onClick={handleGoHome}
          >
            <Home className="h-4 w-4" />
          </button>
          <button 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10"
            onClick={handleGoToProfile}
          >
            <User className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isGameOver ? (
            <motion.div
              key="game-over"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="text-center space-y-6 mt-8 max-w-md mx-auto"
            >
              <motion.h2
                className="text-3xl font-bold text-destructive"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                ¡Juego Terminado!
              </motion.h2>
              <p className="text-lg">Has perdido todas tus vidas.</p>
              <p className="text-muted-foreground">Tiempo: {formatTime(time)}</p>

              <div className="flex gap-4 justify-center mt-6">
                <button 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2"
                  onClick={handleRestartGame}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reintentar
                </button>
                <button 
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2"
                  onClick={handleGoHome}
                >
                  <Home className="h-4 w-4" />
                  Inicio
                </button>
              </div>
            </motion.div>
          ) : isGameWon ? (
            <motion.div
              key="game-won"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="text-center space-y-6 mt-8 max-w-md mx-auto"
            >
              {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      initial={{
                        top: "50%",
                        left: "50%",
                        scale: 0,
                      }}
                      animate={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        scale: Math.random() * 2 + 0.5,
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: Math.random() * 2 + 1,
                        ease: "easeOut",
                      }}
                      style={{
                        backgroundColor: ["#ff0080", "#7928ca", "#0070f3", "#00c9a7", "#ff4d4d", "#f9cb28"][
                          Math.floor(Math.random() * 6)
                        ],
                      }}
                    />
                  ))}
                </div>
              )}

              <motion.h2
                className="text-3xl font-bold text-green-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                ¡Felicidades!
              </motion.h2>
              <p className="text-lg">Has completado el sudoku correctamente.</p>
              <div className="bg-primary/10 rounded-lg p-4 inline-block">
                <p className="text-xl font-mono">Tiempo: {formatTime(time)}</p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-6">
                <button 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2"
                  onClick={handleRestartGame}
                >
                  <RotateCcw className="h-4 w-4" />
                  Jugar de nuevo
                </button>
                <button 
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2"
                  onClick={handleGoHome}
                >
                  <Home className="h-4 w-4" />
                  Inicio
                </button>
                <button 
                  className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2"
                  onClick={handleShareResult}
                >
                  <Share className="h-4 w-4" />
                  Compartir
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game-board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GameBoard
                gameMode={gameMode}
                gameDifficulty={gameDifficulty}
                onLoseLife={handleLoseLife}
                onGameWon={handleGameWon}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNavigation currentPath="/game" />
    </div>
  )
}