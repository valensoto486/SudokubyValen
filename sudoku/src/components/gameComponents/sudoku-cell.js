// Componente que muestra una celda del Sudoku
// Recibe las siguientes props:
// - id: identificador único de la celda  
// - value: valor actual de la celda (0 si está vacía)
// - notes: notas de la celda (array de números posibles) 
// - isInitial: indica si la celda es parte del tablero inicial (no editable)
// - isSelected: indica si la celda está seleccionada
// - isNotesMode: indica si el modo de notas está activado
// - onClick: función llamada al hacer clic en la celda
// - onLongPress: función llamada al presionar la celda por más de 500ms
// - rowIndex: índice de la fila de la celda
// - colIndex: índice de la columna de la celda
// - backgroundColor: color de fondo de la celda    
// - borderStyle: estilo de borde de la celda
// - regionId: identificador de la región de la celda

"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

// Custom cn function to replace @/lib/utils
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function SudokuCell({
  id,
  value,
  notes,
  isInitial,
  isSelected,
  isNotesMode,
  onClick,
  onLongPress,
  rowIndex,
  colIndex,
  backgroundColor,
  borderStyle,
  regionId,
}) {
  const longPressTimer = useRef(null)

  // Handle long press for mobile
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      onLongPress()
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  // Handle right click for desktop
  const handleRightClick = (e) => {
    e.preventDefault()
    onLongPress()
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  // Cell background and text styles
  const cellStyles = cn(
    "aspect-square text-center transition-colors duration-200 min-w-8 min-h-8",
    backgroundColor,
    isInitial ? "font-bold text-primary" : "text-foreground",
    isSelected ? "bg-primary/20" : "",
  )

  return (
    <motion.div
      id={id}
      className={cellStyles}
      onClick={onClick}
      onContextMenu={handleRightClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17, duration: 0.1 }}
    >
      <div className={cn("w-full h-full flex items-center justify-center select-none", borderStyle)}>
        {value > 0 ? (
          <motion.span
            className="text-xl md:text-2xl font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={value}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {value}
          </motion.span>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <div key={num} className="flex items-center justify-center">
                {notes.includes(num) && (
                  <motion.span
                    className="text-[8px] md:text-[10px] text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {num}
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}