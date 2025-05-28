//** Pagina ¿Cómo jugar? */
// Muestra las reglas del juego de Sudoku.
// Permite al usuario entender cómo jugar y qué reglas seguir.

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, HelpCircle, Lightbulb, Heart, Clock } from "lucide-react"
import Header from "../components/Header"
import BottomNavigation from "../components/bottom-navigation"
import imagen from "../public/objetivoJuego.png"

export default function HowToPlay() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Objetivo del Juego",
      content:
        "El objetivo del Sudoku es rellenar una cuadrícula de 9×9 con dígitos del 1 al 9, de modo que cada columna, cada fila y cada subcuadrícula de 3×3 contenga todos los dígitos del 1 al 9 sin repetir ninguno.",
      icon: <HelpCircle className="h-6 w-6" />,
      image: imagen,
    },
    {
      title: "Reglas Básicas",
      content:
        "Cada fila debe contener los números del 1 al 9 sin repetir. Cada columna debe contener los números del 1 al 9 sin repetir. Cada subcuadro de 3×3 debe contener los números del 1 al 9 sin repetir.",
      icon: <Lightbulb className="h-6 w-6" />,
      image: imagen,
    },
    {
      title: "Sistema de Vidas",
      content:
        "Tienes 4 vidas por partida. Cada vez que colocas un número incorrecto, pierdes una vida. Si pierdes todas tus vidas, la partida termina y deberás reiniciar.",
      icon: <Heart className="h-6 w-6" />,
      image: imagen,
    },
    {
      title: "Cronómetro",
      content:
        "El tiempo corre mientras juegas. Intenta resolver el Sudoku lo más rápido posible para mejorar tu récord personal. Los mejores tiempos se guardan por modo y dificultad.",
      icon: <Clock className="h-6 w-6" />,
      image: imagen,
    },
    {
      title: "Notas",
      content:
        "Puedes hacer anotaciones en las celdas para recordar posibles números. Mantén presionada una celda para activar el modo de notas y luego selecciona los números que quieras anotar.",
      icon: <Lightbulb className="h-6 w-6" />,
      image: imagen,
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Cómo Jugar" />

      <main className="flex-1 container mx-auto px-4 pb-16 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="border-2 border-primary/30 rounded-lg">
            <div className="text-center pb-2 pt-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                {steps[currentStep].icon}
                <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-${index === currentStep ? "6" : "1.5"} rounded-full transition-all ${
                      index === currentStep ? "bg-primary" : "bg-primary/30"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-center py-4">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=150&width=150"
                    alt={steps[currentStep].title}
                    className="max-w-full max-h-full"
                  />
                </div>
              </div>

              <p className="text-center">{steps[currentStep].content}</p>

              <div className="flex justify-between pt-4">
                <button 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                  className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </button>

                <button 
                  onClick={nextStep} 
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Siguiente
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNavigation currentPath="/how-to-play" />
    </div>
  )
}

