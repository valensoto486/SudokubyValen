//** Pagina Perfil del usuario */
// Permite al usuario cambiar su nombre de usuario.
// El nombre de usuario se guarda en el LocalStorage 

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Star, Award } from "lucide-react"
import Header from "../components/Header"
import BottomNavigation from "../components/bottom-navigation"

export default function ProfilePage() {
  const [classicLevel, setClassicLevel] = useState(0)
  const [expertLevel, setExpertLevel] = useState(0)
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0)
  const [totalGamesWon, setTotalGamesWon] = useState(0)
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const classicLevel = Number.parseInt(localStorage.getItem("level_classic") || "0")
    const expertLevel = Number.parseInt(localStorage.getItem("level_expert") || "0")

    setClassicLevel(classicLevel)
    setExpertLevel(expertLevel)

    let played = 0
    let won = 0

    for (const mode of ["classic", "expert"]) {
      for (const difficulty of ["facil", "medio", "dificil"]) {
        const gamesPlayedKey = `gamesPlayed_${mode}_${difficulty}`
        const gamesWonKey = `gamesWon_${mode}_${difficulty}`

        played += Number.parseInt(localStorage.getItem(gamesPlayedKey) || "0")
        won += Number.parseInt(localStorage.getItem(gamesWonKey) || "0")
      }
    }

    setTotalGamesPlayed(played)
    setTotalGamesWon(won)

    const newAchievements = []

    if (played >= 1) newAchievements.push("Primer Juego")
    if (won >= 1) newAchievements.push("Primera Victoria")
    if (played >= 10) newAchievements.push("Jugador Dedicado")
    if (won >= 5) newAchievements.push("Ganador Frecuente")
    if (classicLevel >= 3) newAchievements.push("Maestro Clásico")
    if (expertLevel >= 3) newAchievements.push("Maestro Experto")

    setAchievements(newAchievements)
  }, [])

  const getLevelBadge = (level) => {
    if (level === 0) return "Sin progreso"
    if (level === 1) return "Nivel Fácil"
    if (level === 2) return "Nivel Medio"
    if (level === 3) return "Nivel Difícil"
    return "Maestro"
  }

  const getWinRate = () => {
    if (totalGamesPlayed === 0) return 0
    return Math.round((totalGamesWon / totalGamesPlayed) * 100)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Mi Perfil" />

      <main className="flex-1 container mx-auto px-4 pb-16 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Profile Summary */}
          <div className="border-2 border-primary/30 rounded-lg p-4 bg-white dark:bg-background">
            <div className="pb-2 border-b">
              <h2 className="text-xl font-semibold">Perfil del Jugador</h2>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold">Jugador de Sudoku</h2>
                <p className="text-muted-foreground">
                  {totalGamesPlayed === 0 ? "Sin partidas jugadas aún" : `${totalGamesPlayed} partidas jugadas`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Modo Clásico</p>
                  <span className="inline-block px-2 py-1 mt-1 text-sm border rounded-full">
                    {getLevelBadge(classicLevel)}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Modo Experto</p>
                  <span className="inline-block px-2 py-1 mt-1 text-sm border rounded-full">
                    {getLevelBadge(expertLevel)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="rounded-lg p-4 border bg-white dark:bg-background">
            <div className="pb-2 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Estadísticas Generales
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{totalGamesPlayed}</p>
                <p className="text-xs text-muted-foreground">Partidas Jugadas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{totalGamesWon}</p>
                <p className="text-xs text-muted-foreground">Victorias</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{getWinRate()}%</p>
                <p className="text-xs text-muted-foreground">Tasa de Victoria</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-lg p-4 border bg-white dark:bg-background">
            <div className="pb-2 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                Logros
              </h3>
            </div>
            <div className="mt-4">
              {achievements.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Aún no has desbloqueado ningún logro. ¡Sigue jugando!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg border border-border"
                    >
                      <Award className="h-5 w-5 text-primary" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNavigation currentPath="/profile" />
    </div>
  )
}