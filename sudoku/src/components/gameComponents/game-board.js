"use client"

import { useState, useEffect, useRef } from "react"
import { generateSudoku, checkSolution, generateIrregularSudoku } from "./sudoku-generator"
import SudokuCell from "./sudoku-cell"
import NumberPad from "./number-pad"
import { motion, AnimatePresence } from "framer-motion"

export default function GameBoard({ gameMode, gameDifficulty, onLoseLife, onGameWon }) {
  const [board, setBoard] = useState([])
  const [initialBoard, setInitialBoard] = useState([])
  const [selectedCell, setSelectedCell] = useState(null)
  const [notes, setNotes] = useState({})
  const [isNotesMode, setIsNotesMode] = useState(false)
  const [regions, setRegions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)
  const audioRef = useRef(null)
  const errorAudioRef = useRef(null)
  const successAudioRef = useRef(null)

  // Custom toast function
  const showToast = (title, description, variant = "default") => {
    setToastMessage({ title, description, variant })
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  useEffect(() => {
    // Generate a new Sudoku board based on mode and difficulty
    const difficulty = gameDifficulty === "facil" ? 0.3 : gameDifficulty === "medio" ? 0.5 : 0.7

    setIsLoading(true)

    setTimeout(() => {
      if (gameMode === "classic") {
        const { puzzle, solution, regions: classicRegions } = generateSudoku(difficulty)
        setBoard(puzzle)
        setInitialBoard(puzzle.map((row) => [...row]))
        setRegions(classicRegions)
      } else {
        // Modo experto con regiones irregulares
        const { puzzle, solution, regions: irregularRegions } = generateIrregularSudoku(difficulty)
        setBoard(puzzle)
        setInitialBoard(puzzle.map((row) => [...row]))
        setRegions(irregularRegions)
      }

      setIsLoading(false)
    }, 500)

    // Initialize audio elements
    audioRef.current = new Audio("/sounds/click.mp3")
    errorAudioRef.current = new Audio("/sounds/error.mp3")
    successAudioRef.current = new Audio("/sounds/success.mp3")

    return () => {
      // Clean up audio elements
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (errorAudioRef.current) {
        errorAudioRef.current.pause()
        errorAudioRef.current = null
      }
      if (successAudioRef.current) {
        successAudioRef.current.pause()
        successAudioRef.current = null
      }
    }
  }, [gameMode, gameDifficulty])

  const handleCellClick = (row, col) => {
    // Only allow selecting empty cells or cells that were not in the initial board
    if (initialBoard[row][col] === 0) {
      setSelectedCell({ row, col })

      // Play click sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }
    }
  }

  const handleCellLongPress = (row, col) => {
    // Only allow notes on empty cells
    if (board[row][col] === 0) {
      setSelectedCell({ row, col })
      setIsNotesMode(true)
    }
  }

  const handleNumberInput = (num) => {
    if (!selectedCell) return

    const { row, col } = selectedCell

    if (isNotesMode) {
      // Handle notes mode
      const cellKey = `${row}-${col}`
      const currentNotes = notes[cellKey] || []

      setNotes((prev) => {
        const newNotes = { ...prev }

        if (currentNotes.includes(num)) {
          // Remove the number if it already exists
          newNotes[cellKey] = currentNotes.filter((n) => n !== num)
        } else {
          // Add the number to notes
          newNotes[cellKey] = [...currentNotes, num]
        }

        return newNotes
      })

      // Play click sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }
    } else {
      // Regular number input
      const newBoard = board.map((r) => [...r])

      // Check if the move is valid
      const isValid = checkSolution(newBoard, row, col, num, regions)

      if (isValid) {
        newBoard[row][col] = num
        setBoard(newBoard)

        // Play success sound
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
        }

        // Check if the board is complete
        const isComplete = newBoard.every((row) => row.every((cell) => cell !== 0))
        if (isComplete) {
          // Play success sound
          if (successAudioRef.current) {
            successAudioRef.current.currentTime = 0
            successAudioRef.current.play().catch((e) => console.log("Audio play failed:", e))
          }

          // Show sparkles and notify game won
          createSparkles()
          setTimeout(() => {
            onGameWon()
          }, 1000)
        }

        // Check if a row, column, or region is complete
        checkForCompletedSections(newBoard, row, col)
      } else {
        // Invalid move
        onLoseLife()

        // Play error sound
        if (errorAudioRef.current) {
          errorAudioRef.current.currentTime = 0
          errorAudioRef.current.play().catch((e) => console.log("Audio play failed:", e))
        }

        // Shake the cell
        const cellElement = document.getElementById(`cell-${row}-${col}`)
        if (cellElement) {
          cellElement.classList.add("cell-shake")
          setTimeout(() => {
            cellElement.classList.remove("cell-shake")
          }, 500)
        }

        showToast("¡Movimiento inválido!", "Has perdido una vida", "destructive")
      }
    }
  }

  const checkForCompletedSections = (board, row, col) => {
    // Check if row is complete
    const isRowComplete = board[row].every((cell) => cell !== 0)

    // Check if column is complete
    const isColComplete = board.every((r) => r[col] !== 0)

    // Check if region is complete
    const regionId = regions[row][col]
    let isRegionComplete = true

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (regions[r][c] === regionId && board[r][c] === 0) {
          isRegionComplete = false
          break
        }
      }
      if (!isRegionComplete) break
    }

    if (isRowComplete || isColComplete || isRegionComplete) {
      // Play success sound
      if (successAudioRef.current) {
        successAudioRef.current.currentTime = 0
        successAudioRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }

      // Create sparkle effect
      createSparkles()

      // Show toast
      showToast(
        "¡Bien hecho!",
        isRowComplete
          ? "¡Completaste una fila!"
          : isColComplete
            ? "¡Completaste una columna!"
            : "¡Completaste una región!"
      )
    }
  }

  const createSparkles = () => {
    const container = document.getElementById("game-board-container")
    if (!container) return

    const containerRect = container.getBoundingClientRect()

    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement("div")
      sparkle.className = "sparkle"

      // Random position within the container
      const left = Math.random() * containerRect.width
      const top = Math.random() * containerRect.height

      // Random size
      const size = Math.random() * 8 + 2

      sparkle.style.left = `${left}px`
      sparkle.style.top = `${top}px`
      sparkle.style.width = `${size}px`
      sparkle.style.height = `${size}px`

      // Random color
      const colors = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899"]
      sparkle.style.background = colors[Math.floor(Math.random() * colors.length)]

      container.appendChild(sparkle)

      // Remove the sparkle after animation completes
      setTimeout(() => {
        sparkle.remove()
      }, 800)
    }
  }

  const toggleNotesMode = () => {
    setIsNotesMode(!isNotesMode)
  }

  const clearCell = () => {
    if (!selectedCell) return

    const { row, col } = selectedCell

    // Only allow clearing cells that were not in the initial board
    if (initialBoard[row][col] === 0) {
      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = 0
      setBoard(newBoard)

      // Clear notes for this cell
      const cellKey = `${row}-${col}`
      setNotes((prev) => {
        const newNotes = { ...prev }
        delete newNotes[cellKey]
        return newNotes
      })

      // Play click sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }
    }
  }

  // Función para obtener el color de fondo de una celda basado en su región
  const getCellBackgroundColor = (row, col) => {
    if (!regions.length) return ""

    const regionId = regions[row][col]

    if (gameMode === "classic") {
      // Para el modo clásico, alternamos colores por subcuadros 3x3
      return (Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 0 ? "bg-background" : "bg-primary/5"
    } else {
      // Para el modo experto, asignamos colores por ID de región
      const colors = [
        "bg-background",
        "bg-blue-50 dark:bg-blue-950/30",
        "bg-purple-50 dark:bg-purple-950/30",
        "bg-green-50 dark:bg-green-950/30",
        "bg-yellow-50 dark:bg-yellow-950/30",
        "bg-pink-50 dark:bg-pink-950/30",
        "bg-cyan-50 dark:bg-cyan-950/30",
        "bg-orange-50 dark:bg-orange-950/30",
        "bg-indigo-50 dark:bg-indigo-950/30",
        "bg-red-50 dark:bg-red-950/30",
      ]

      return colors[regionId % colors.length]
    }
  }

  // Función para determinar si una celda tiene un borde especial basado en regiones
  const getCellBorderStyle = (row, col) => {
    if (!regions.length) return ""

    let borderStyle = "border border-gray-300 dark:border-gray-700"

    // Añadir bordes más gruesos para las regiones
    if (gameMode === "classic") {
      // Bordes para el modo clásico (subcuadros 3x3)
      if (row % 3 === 0) borderStyle += " border-t-2 border-t-primary/70"
      if (col % 3 === 0) borderStyle += " border-l-2 border-l-primary/70"
      if (row === 8) borderStyle += " border-b-2 border-b-primary/70"
      if (col === 8) borderStyle += " border-r-2 border-r-primary/70"
    } else {
      // Bordes para el modo experto (regiones irregulares)
      const currentRegion = regions[row][col]

      // Verificar bordes con celdas adyacentes
      if (row > 0 && regions[row - 1][col] !== currentRegion) borderStyle += " border-t-2 border-t-primary/70"
      if (col > 0 && regions[row][col - 1] !== currentRegion) borderStyle += " border-l-2 border-l-primary/70"
      if (row < 8 && regions[row + 1][col] !== currentRegion) borderStyle += " border-b-2 border-b-primary/70"
      if (col < 8 && regions[row][col + 1] !== currentRegion) borderStyle += " border-r-2 border-r-primary/70"
    }

    return borderStyle
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"
        />
        <p className="text-muted-foreground">Generando tablero...</p>
      </div>
    )
  }

  if (board.length === 0) {
    return <div>Error al cargar el tablero</div>
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Custom Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg border max-w-sm ${
              toastMessage.variant === "destructive"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-green-50 border-green-200 text-green-800"
            }`}
          >
            <div className="font-semibold text-sm">{toastMessage.title}</div>
            <div className="text-xs mt-1">{toastMessage.description}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 mb-6 relative shadow-lg border-2 border-primary/30 rounded-lg bg-white dark:bg-gray-800" id="game-board-container">
        <div className="grid grid-cols-9 gap-0.5 border-2 border-primary/50 rounded-md overflow-hidden">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                id={`cell-${rowIndex}-${colIndex}`}
                value={cell}
                notes={notes[`${rowIndex}-${colIndex}`] || []}
                isInitial={initialBoard[rowIndex][colIndex] !== 0}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                isNotesMode={isNotesMode && selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onLongPress={() => handleCellLongPress(rowIndex, colIndex)}
                rowIndex={rowIndex}
                colIndex={colIndex}
                backgroundColor={getCellBackgroundColor(rowIndex, colIndex)}
                borderStyle={getCellBorderStyle(rowIndex, colIndex)}
                regionId={regions[rowIndex][colIndex]}
              />
            )),
          )}
        </div>

        {/* Indicador de modo de notas */}
        <AnimatePresence>
          {isNotesMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full"
            >
              Modo Notas
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full">
        <NumberPad
          onNumberClick={handleNumberInput}
          onClearClick={clearCell}
          onNotesToggle={toggleNotesMode}
          isNotesMode={isNotesMode}
        />
      </div>

      <style jsx>{`
        .sparkle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: sparkle 0.8s ease-out forwards;
        }

        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }

        .cell-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}