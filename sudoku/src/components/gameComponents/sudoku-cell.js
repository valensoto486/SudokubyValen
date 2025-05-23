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
    "aspect-square text-center transition-colors duration-200",
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