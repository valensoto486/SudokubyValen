import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Zap } from "lucide-react"
import Header from "../components/Header"
import BottomNavigation from "../components/bottom-navigation"

export default function DifficultyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [gameMode, setGameMode] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const mode = searchParams.get("mode") || localStorage.getItem("gameMode") || "classic"
    setGameMode(mode)
  }, [location.search])

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty)
  }

  const handleStartGame = () => {
    if (selectedDifficulty) {
      // Save the selected difficulty to localStorage
      localStorage.setItem("gameDifficulty", selectedDifficulty)

      // Navigate to the game page
      navigate(`/game?mode=${gameMode}&difficulty=${selectedDifficulty}`)
    }
  }

  const handleGoBack = () => {
    navigate("/home")
  }

  const getModeName = () => {
    return gameMode === "classic" ? "Clásico" : "Experto"
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title={`Modo ${getModeName()}`} />

      <main className="flex-1 container mx-auto px-4 pb-16 pt-4">
        <div className="mb-4">
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="rounded-lg border-2 border-primary/50 bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-bold text-center leading-none tracking-tight">Selecciona la Dificultad</h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <p className="text-center text-muted-foreground mb-4">
                {gameMode === "classic"
                  ? "Sudoku tradicional con reglas clásicas"
                  : "Versiones más difíciles con figuras abstractas"}
              </p>

              <div className="grid grid-cols-1 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDifficultySelect("facil")}
                  className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                    selectedDifficulty === "facil"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-blue-500/20 shadow-lg"
                      : "border-border hover:border-blue-500/50"
                  }`}
                >
                  <div className="font-bold text-lg">Fácil</div>
                  <div className="text-sm text-muted-foreground">
                    Ideal para principiantes. Muchas pistas iniciales.
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDifficultySelect("medio")}
                  className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                    selectedDifficulty === "medio"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-blue-500/20 shadow-lg"
                      : "border-border hover:border-blue-500/50"
                  }`}
                >
                  <div className="font-bold text-lg">Medio</div>
                  <div className="text-sm text-muted-foreground">
                    Para jugadores con experiencia. Equilibrio entre desafío y diversión.
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDifficultySelect("dificil")}
                  className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                    selectedDifficulty === "dificil"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-blue-500/20 shadow-lg"
                      : "border-border hover:border-blue-500/50"
                  }`}
                >
                  <div className="font-bold text-lg flex items-center gap-1">
                    Difícil
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Para expertos. Pocas pistas y mucha deducción lógica.
                  </div>
                </motion.button>
              </div>
            </div>
            <div className="flex items-center p-6 pt-0">
              <motion.button 
                onClick={handleStartGame} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 h-12 px-8 w-full shadow-lg
                  ${!selectedDifficulty 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-500/25'
                  }`}
                disabled={!selectedDifficulty}
              >
                Comenzar Juego
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNavigation currentPath="/difficulty" />
    </div>
  )
}