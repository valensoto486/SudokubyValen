"use client"

import { Eraser, Pencil } from "lucide-react"
import { motion } from "framer-motion"

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function NumberPad({ onNumberClick, onClearClick, onNotesToggle, isNotesMode }) {
  return (
    <motion.div
      className="grid grid-cols-5 gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <motion.div
          key={num}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <button
            className="aspect-square text-xl font-bold w-full h-full border-2 rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors duration-200 flex items-center justify-center"
            onClick={() => onNumberClick(num)}
          >
            {num}
          </button>
        </motion.div>
      ))}

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <button
          className={cn(
            "aspect-square w-full h-full border-2 rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 transition-colors duration-200 flex items-center justify-center",
            isNotesMode
              ? "bg-primary/20 border-primary text-primary"
              : "hover:bg-primary/10 hover:text-primary hover:border-primary/50",
          )}
          onClick={onNotesToggle}
        >
          <Pencil className="h-5 w-5" />
        </button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <button
          className="aspect-square w-full h-full border-2 rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors duration-200 flex items-center justify-center"
          onClick={onClearClick}
        >
          <Eraser className="h-5 w-5" />
        </button>
      </motion.div>
    </motion.div>
  )
}