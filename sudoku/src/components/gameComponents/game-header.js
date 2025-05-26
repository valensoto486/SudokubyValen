"use client"

import { Heart, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function GameHeader({ gameMode, gameDifficulty, lives, time }) {
  // Format time as mm:ss
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`

  // Format mode and difficulty for display
  const formattedMode = gameMode === "classic" ? "Clásico" : "Experto"
  const formattedDifficulty = gameDifficulty === "facil" ? "Fácil" : gameDifficulty === "medio" ? "Medio" : "Difícil"

  return (
    <div className=" w-full max-w-md mx-auto mb-4 bg-white">
      <div className="p-4 border-2 border-primary/30 shadow-md rounded-lg bg-white ">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-primary">Sudoku {formattedMode}</h2>
            <div className="flex gap-2 mt-1">
              <span className="inline-flex items-center rounded-md border border-gray-200 dark:border-gray-700 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-gray-900 dark:text-gray-700">
                {formattedMode}
              </span>
              <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-semibold text-gray-900 dark:text-gray-100">
                {formattedDifficulty}
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-1">
              <Heart className="h-5 w-5 text-red-500" />
              <div className="flex">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      scale: i < lives ? 1 : 0.5,
                      opacity: i < lives ? 1 : 0.3,
                    }}
                    className={`w-2 h-2 rounded-full mx-0.5 ${i < lives ? "bg-red-500" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5 text-blue-500" />
              <motion.span
                className="font-mono"
                animate={{ color: time > 300 ? "#f97316" : time > 600 ? "#ef4444" : "#3b82f6" }}
              >
                {formattedTime}
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}