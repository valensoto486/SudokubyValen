"use client"

import { useState, useEffect, useRef } from "react"
import { generateSudoku, checkSolution, generateIrregularSudoku } from "./sudoku-generator"
import SudokuCell from "./sudoku-cell"
import NumberPad from "./number-pad"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { X, Check } from "lucide-react"

// Importaciones condicionales de Capacitor
let Haptics;
let Storage;
let App;

try {
  const capacitorHaptics = require('@capacitor/haptics');
  const capacitorStorage = require('@capacitor/storage');
  const capacitorApp = require('@capacitor/app');
  
  Haptics = capacitorHaptics.Haptics;
  Storage = capacitorStorage.Storage;
  App = capacitorApp.App;
} catch (error) {
  console.log('Capacitor no está disponible en el navegador');
  // Mock objects for web development
  Haptics = {
    impact: async () => {},
  };
  Storage = {
    set: async () => {},
    get: async () => ({ value: null }),
  };
  App = {
    addListener: () => {},
    removeAllListeners: () => {},
  };
}

export default function GameBoard({ gameMode, gameDifficulty, onLoseLife, onGameWon }) {
  const [board, setBoard] = useState([])
  const [initialBoard, setInitialBoard] = useState([])
  const [selectedCell, setSelectedCell] = useState(null)
  const [notes, setNotes] = useState({})
  const [isNotesMode, setIsNotesMode] = useState(false)
  const [regions, setRegions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)
  const [centerCellClicks, setCenterCellClicks] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [solution, setSolution] = useState([])
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

  // Función para guardar el progreso del juego
  const saveGameProgress = async () => {
    try {
      await Storage.set({
        key: 'gameProgress',
        value: JSON.stringify({
          board,
          notes,
          gameMode,
          gameDifficulty
        })
      });
    } catch (error) {
      console.error('Error al guardar el progreso:', error);
    }
  };

  // Cargar progreso guardado
  const loadGameProgress = async () => {
    try {
      const { value } = await Storage.get({ key: 'gameProgress' });
      if (value) {
        const progress = JSON.parse(value);
        setBoard(progress.board);
        setNotes(progress.notes);
      }
    } catch (error) {
      console.error('Error al cargar el progreso:', error);
    }
  };

  useEffect(() => {
    // Cargar progreso al iniciar
    loadGameProgress();

    // Configurar el manejo del botón de retroceso (Android)
    App.addListener('backButton', () => {
      // Guardar progreso antes de salir
      saveGameProgress();
    });

    return () => {
      App.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    // Generate a new Sudoku board based on mode and difficulty
    const difficulty = gameDifficulty === "facil" ? 0.3 : gameDifficulty === "medio" ? 0.5 : 0.7

    setIsLoading(true)

    setTimeout(() => {
      if (gameMode === "classic") {
        const { puzzle, solution: newSolution, regions: classicRegions } = generateSudoku(difficulty)
        setBoard(puzzle)
        setInitialBoard(puzzle.map((row) => [...row]))
        setRegions(classicRegions)
        setSolution(newSolution)
      } else {
        // Modo experto con regiones irregulares
        const { puzzle, solution: newSolution, regions: irregularRegions } = generateIrregularSudoku(difficulty)
        setBoard(puzzle)
        setInitialBoard(puzzle.map((row) => [...row]))
        setRegions(irregularRegions)
        setSolution(newSolution)
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

  const handleCellClick = async (row, col) => {
    // Vibración táctil ligera al tocar una celda
    try {
      await Haptics.impact({ style: 'light' });
    } catch (error) {
      console.error('Error con la vibración:', error);
    }

    // Easter egg: detectar clicks en la celda central (4,4)
    if (row === 4 && col === 4) {
      setCenterCellClicks(prev => {
        const newCount = prev + 1;
        if (newCount === 10) {
          setShowEasterEgg(true);
          // Después de 5 segundos, mover el alien arriba
          setTimeout(() => {
            const alienContainer = document.querySelector('#alien-container');
            if (alienContainer) {
              alienContainer.classList.add('move-to-top');
              // Mostrar la solución después de que el alien se mueva arriba
              setTimeout(() => {
                setShowSolution(true);
                // Ocultar todo después de 10 segundos
                setTimeout(() => {
                  setShowSolution(false);
                  setShowEasterEgg(false);
                  setCenterCellClicks(0);
                }, 10000);
              }, 500);
            }
          }, 5000);
        }
        return newCount;
      });
    }

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

  const handleNumberInput = async (num) => {
    if (!selectedCell) return

    const { row, col } = selectedCell

    try {
      // Vibración media al ingresar un número
      await Haptics.impact({ style: 'medium' });
    } catch (error) {
      console.error('Error con la vibración:', error);
    }

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

    // Guardar progreso después de cada movimiento
    saveGameProgress();
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
      return (Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 0 ? "bg-[#dceaff]" : "bg-white"
    } else {
      // Para el modo experto, asignamos colores por ID de región
      const colors = [
        "bg-[#f5e6ff] dark:bg-[#d580ff]/90",      // Lila neón
        "bg-[#e0f0ff] dark:bg-[#33bfff]/90",      // Azul eléctrico
        "bg-[#f0e8ff] dark:bg-[#b366ff]/90",      // Púrpura vivo
        "bg-[#eaffea] dark:bg-[#39ff14]/90",      // Verde neón 
        "bg-[#fffbe6] dark:bg-[#ffe600]/90",      // Amarillo fosforescente
        "bg-[#ffe6f7] dark:bg-[#ff4ddb]/90",      // Rosa brillante
        "bg-[#e6ffff] dark:bg-[#00ffe7]/90",      // Cian neón
        "bg-[#fff0e6] dark:bg-[#ff9933]/90",      // Naranja intenso
        "bg-[#ede6ff] dark:bg-[#9966ff]/90",      // Índigo eléctrico
        "bg-[#ffe6e6] dark:bg-[#ff3333]/90"       // Rojo neón
      ];


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
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4">
      {/* Toast message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={cn(
              "fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50",
              toastMessage.variant === "destructive"
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {toastMessage.variant === "destructive" ? (
                <X className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <div>
                <p className="font-semibold">{toastMessage.title}</p>
                <p className="text-sm opacity-90">{toastMessage.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter egg alien */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            id="alien-container"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-500"
          >
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-xl shadow-xl text-white text-center"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                👽
              </motion.div>
              <p className="text-xl font-bold">¡Tienes 10 segundos para copiarme la respuesta!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 mb-6 relative shadow-lg border-2 border-primary/30 rounded-lg bg-white dark:bg-gray-800" id="game-board-container">
        <div className="grid grid-cols-9 gap-0.5 border-2 border-primary/50 rounded-md overflow-hidden">
          {(showSolution ? solution : board).map((row, rowIndex) =>
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
            ))
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

        #alien-container {
          transition: all 0.5s ease-in-out;
        }

        #alien-container.move-to-top {
          height: auto !important;
          padding: 1rem;
          top: 0 !important;
          align-items: flex-start !important;
        }
      `}</style>
    </div>
  )
}