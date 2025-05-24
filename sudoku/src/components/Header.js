//** Componente mostrado en todas las paginas */
// Componente de encabezado
// Muestra el título de la página actual

"use client"

import { motion } from "framer-motion"

export default function Header({ title }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-10 bg-background border-b border-border py-4 px-4"
    >
      <div className="container mx-auto flex justify-center items-center">
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
      </div>
    </motion.header>
  )
}
