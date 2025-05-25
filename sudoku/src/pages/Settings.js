//** Pagina Configuración */
// Permite al usuario cambiar el tema de la aplicación entre claro y neón. 
// El tema se guarda en el LocalStorage para que el usuario pueda continuar jugando desde donde lo dejó. 


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, Sun, Sparkles, RotateCcw, Info } from "lucide-react";
import Header from "../components/Header";
import BottomNavigation from "../components/bottom-navigation";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showEffects, setShowEffects] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    const sound = localStorage.getItem("soundEnabled");
    const vibration = localStorage.getItem("vibrationEnabled");
    const effects = localStorage.getItem("effectsEnabled");

    setTheme(savedTheme);
    setSoundEnabled(sound === null ? true : sound === "true");
    setVibrationEnabled(vibration === null ? true : vibration === "true");
    setShowEffects(effects === null ? true : effects === "true");
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem("soundEnabled", newValue.toString());
  };

  const handleVibrationToggle = () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    localStorage.setItem("vibrationEnabled", newValue.toString());
  };

  const handleEffectsToggle = () => {
    const newValue = !showEffects;
    setShowEffects(newValue);
    localStorage.setItem("effectsEnabled", newValue.toString());
  };

  const handleResetStats = () => {
    // Show confirmation
    alert("Estadísticas reiniciadas\nTodas tus estadísticas han sido reiniciadas correctamente.");

    // Clear all stats from localStorage
    for (const mode of ["classic", "expert"]) {
      for (const difficulty of ["facil", "medio", "dificil"]) {
        localStorage.removeItem(`bestTime_${mode}_${difficulty}`);
        localStorage.removeItem(`gamesPlayed_${mode}_${difficulty}`);
        localStorage.removeItem(`gamesWon_${mode}_${difficulty}`);
        localStorage.removeItem(`gamesLost_${mode}_${difficulty}`);
      }
      localStorage.removeItem(`level_${mode}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Configuración" />

      <main className="flex-1 container mx-auto px-4 pb-16 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Theme Settings */}
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                Tema
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${
                    theme === "light" ? "bg-primary text-white" : "border"
                  }`}
                  onClick={() => handleThemeChange("light")}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Claro
                </button>
                <button
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${
                    theme === "neon" ? "bg-primary text-white" : "border"
                  }`}
                  onClick={() => handleThemeChange("neon")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Neón
                </button>
              </div>
            </div>
          </div>

          {/* Sound and Effects */}
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-blue-500" />
                Sonido y Efectos
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label htmlFor="sound-toggle">Sonidos ASMR</label>
                </div>
                <input
                  type="checkbox"
                  id="sound-toggle"
                  checked={soundEnabled}
                  onChange={handleSoundToggle}
                  className="w-11 h-6 rounded-full appearance-none bg-gray-200 checked:bg-primary transition-colors duration-200 relative"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label htmlFor="vibration-toggle">Vibración</label>
                </div>
                <input
                  type="checkbox"
                  id="vibration-toggle"
                  checked={vibrationEnabled}
                  onChange={handleVibrationToggle}
                  className="w-11 h-6 rounded-full appearance-none bg-gray-200 checked:bg-primary transition-colors duration-200 relative"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label htmlFor="effects-toggle">Efectos Visuales</label>
                </div>
                <input
                  type="checkbox"
                  id="effects-toggle"
                  checked={showEffects}
                  onChange={handleEffectsToggle}
                  className="w-11 h-6 rounded-full appearance-none bg-gray-200 checked:bg-primary transition-colors duration-200 relative"
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-red-500" />
                Datos y Estadísticas
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  Reiniciar todas tus estadísticas y progreso. Esta acción no se puede deshacer.
                </p>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={handleResetStats}
                >
                  Reiniciar Estadísticas
                </button>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Acerca de
              </h2>
            </div>
            <div className="p-4">
              <div className="text-center space-y-2">
                <h3 className="font-bold">Sudoku by Valen</h3>
                <p className="text-sm text-gray-500">Versión 1.0.0</p>
                <p className="text-sm">Desarrollado con ❤️ por Valen</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNavigation currentPath="/settings" />
    </div>
  );
}
