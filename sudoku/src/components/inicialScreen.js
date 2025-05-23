"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from 'react-router-dom';
import Home from "../pages/Home";

export default function InicialScreen() {
  const navigate = useNavigate() 
  const [showLogo, setShowLogo] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showSubtext, setShowSubtext] = useState(false)

  useEffect(() => {
    // Secuencia de animación
    const sequence = async () => {
      // Mostrar logo con delay
      setTimeout(() => setShowLogo(true), 300)

      // Mostrar texto principal con delay
      setTimeout(() => setShowText(true), 1000)

      // Mostrar subtexto con delay
      setTimeout(() => setShowSubtext(true), 1800)

      // Navegar a la página principal después de completar la animación
      setTimeout(() => {
        navigate('/home')  
      }, 4000)
    }

    sequence()
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background overflow-hidden">
      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
        {/* Fondo animado con partículas */}
        <AnimatePresence>
          {showLogo && (
            <>
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary/30"
                  initial={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: Math.random() * 600 - 300,
                    y: Math.random() * 600 - 300,
                    opacity: [0, 0.5, 0],
                    scale: [0, Math.random() * 2 + 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    delay: Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  style={{
                    width: `${Math.random() * 20 + 5}px`,
                    height: `${Math.random() * 20 + 5}px`,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Logo central */}
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1.5,
              }}
              className="relative z-10"
            >
              <div className="w-40 h-40 bg-primary/10 rounded-2xl flex items-center justify-center border-4 border-primary shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <div className="grid grid-cols-3 grid-rows-3 gap-1 w-32 h-32">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-primary/20 rounded-md flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                    >
                      {i % 2 === 0 && (
                        <motion.span
                          className="text-primary font-bold text-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}
                        >
                          {i + 1}
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Texto principal con efecto de escritura */}
      <AnimatePresence>
        {showText && (
          <motion.h1
            className="text-5xl font-bold mt-8 text-primary relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 bg-background"
              style={{ originX: 0 }}
            />
            Sudoku by Valen
            {/* Efecto de brillo que se mueve */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, delay: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            />
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Subtexto con efecto de aparición */}
      <AnimatePresence>
        {showSubtext && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-center"
          >
            <p className="text-lg text-muted-foreground">Preparando el desafío...</p>
            <motion.div className="mt-3 h-1 bg-primary/30 rounded-full w-48 mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
