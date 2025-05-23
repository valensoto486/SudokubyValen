"use client"

import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import { Home, BarChart2, User, HelpCircle, Settings } from "lucide-react"

export default function BottomNavigation({ currentPath }) {
  const router = useNavigate()

  const navItems = [
    { path: "/home", icon: Home, label: "Inicio" },
    { path: "/statistics", icon: BarChart2, label: "Estadísticas" },
    { path: "/profile", icon: User, label: "Mi Perfil" },
    { path: "/how-to-play", icon: HelpCircle, label: "Cómo Jugar" },
    { path: "/settings", icon: Settings, label: "Configuración" },
  ]

  const handleNavigation = (path) => {
    router(path)  // ojo que use router(path), no router.push(path), react-router usa así
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4 z-10"
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center relative">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors " +
                  (isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navigation-indicator"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
