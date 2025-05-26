//** Componente mostrado en el Home */
// Componente que muestra un tipo Carousel de tips para el juego de Sudoku.
// Se puede pausar el carrusel al pasar el mouse por encima y se reanuda al salir.

"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react"

const tips = [
  {
    id: 1,
    title: "Técnica de Candidatos Únicos",
    content:
      "Busca celdas donde solo un número puede ir. Si una celda solo puede contener un número específico, ese número debe ir ahí.",
    icon: "🔍",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: 2,
    title: "Técnica de Fila/Columna",
    content:
      "Si un número solo puede ir en una celda específica de una fila o columna, colócalo ahí aunque no estés seguro del resto del cuadro.",
    icon: "📏",
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: 3,
    title: "Pares Ocultos",
    content:
      "Si dos celdas en una unidad solo pueden contener los mismos dos números, esos números no pueden estar en ninguna otra celda de esa unidad.",
    icon: "👥",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: 4,
    title: "Comienza con lo Obvio",
    content: "Busca filas, columnas o bloques que ya tengan muchos números y completa primero esas áreas.",
    icon: "🎯",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: 5,
    title: "Usa Notas",
    content: "Anota los posibles números para cada celda vacía. Esto te ayudará a visualizar mejor las posibilidades.",
    icon: "📝",
    color: "bg-pink-500/10 text-pink-500",
  },
]

export default function TipsCarousel() {
  const [currentTip, setCurrentTip] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextTip()
      }, 8000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentTip, isPaused])

  const nextTip = () => {
    setDirection(1)
    setCurrentTip((prev) => (prev === tips.length - 1 ? 0 : prev + 1))
  }

  const prevTip = () => {
    setDirection(-1)
    setCurrentTip((prev) => (prev === 0 ? tips.length - 1 : prev - 1))
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="border-2 border-primary/30 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-white">
        <div className="relative h-56 md:h-48 flex items-center justify-center">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentTip}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 p-6 justify-center "
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 ${tips[currentTip].color} rounded-full p-3`}>
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    {tips[currentTip].title}
                    <motion.span
                      className="text-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                    >
                      {tips[currentTip].icon}
                    </motion.span>
                  </h3>
                  <p className="text-muted-foreground">{tips[currentTip].content}</p>

                  <div className="w-full flex items-center mt-6 gap-2 ml-16">
                    <motion.div
                      className="grid grid-cols-3 grid-rows-3 gap-0.5 bg-background p-1 rounded border border-border w-24 h-24"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {Array.from({ length: 9 }).map((_, i) => {
                        const showNumber =
                          currentTip === 0 && i === 4
                            ? "5"
                            : currentTip === 1 && i === 1
                              ? "3"
                              : currentTip === 2 && (i === 0 || i === 1)
                                ? i === 0
                                  ? "2"
                                  : "9"
                                : currentTip === 3 && (i === 0 || i === 3 || i === 6)
                                  ? String(i + 1)
                                  : currentTip === 4 && i === 4
                                    ? "1,4,7"
                                    : ""

                        const isHighlighted =
                          (currentTip === 0 && i === 4) ||
                          (currentTip === 1 && i === 1) ||
                          (currentTip === 2 && (i === 0 || i === 1)) ||
                          (currentTip === 3 && (i === 0 || i === 3 || i === 6)) ||
                          (currentTip === 4 && i === 4)

                        return (
                          <motion.div
                            key={i}
                            className={`flex items-center justify-center border border-border ${
                              isHighlighted
                                ? tips[currentTip].color.replace("text-", "bg-").replace("/10", "/20")
                                : "bg-background"
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {showNumber && (
                              <span
                                className={`${
                                  currentTip === 4 ? "text-[7px]" : "text-xs"
                                } font-medium ${isHighlighted ? tips[currentTip].color : ""}`}
                              >
                                {showNumber}
                              </span>
                            )}
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center p-2 border-t border-border mt-24">
          <button onClick={prevTip} className="hover:bg-primary/10 p-2 rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-1">
            {tips.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                  index === currentTip ? "bg-primary w-6" : "bg-primary/30 w-1.5"
                }`}
                onClick={() => {
                  setDirection(index > currentTip ? 1 : -1)
                  setCurrentTip(index)
                }}
                whileHover={{ scale: 1.5 }}
              />
            ))}
          </div>

          <button onClick={nextTip} className="hover:bg-primary/10 p-2 rounded-full">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}