//** Pagina Estadísticas */
// Muestra las estadísticas del usuario 
// como partidas jugadas, ganadas, perdidas y mejor tiempo.

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, Award, XCircle, CheckCircle, PlayCircle } from "lucide-react";
import Header from "../components/Header";
import BottomNavigation from "../components/bottom-navigation";

export default function Stats() {
  const [stats, setStats] = useState({
    classic: {
      facil: { bestTime: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0 },
      medio: { bestTime: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0 },
      dificil: { bestTime: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0 },
    },
    expert: {
      facil: { bestTime: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0 },
      medio: { bestTime: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0 },
      dificil: { bestTime: 0, gamesPlayed: 0, gamesWon: 0, gamesLost: 0 },
    },
  });

  const [mainTab, setMainTab] = useState("classic");
  const [subTab, setSubTab] = useState("facil");

  useEffect(() => {
    const loadStats = () => {
      const newStats = { ...stats };
      for (const mode of ["classic", "expert"]) {
        for (const difficulty of ["facil", "medio", "dificil"]) {
          const bestTime = parseInt(localStorage.getItem(`bestTime_${mode}_${difficulty}`) || "0");
          const gamesPlayed = parseInt(localStorage.getItem(`gamesPlayed_${mode}_${difficulty}`) || "0");
          const gamesWon = parseInt(localStorage.getItem(`gamesWon_${mode}_${difficulty}`) || "0");
          const gamesLost = parseInt(localStorage.getItem(`gamesLost_${mode}_${difficulty}`) || "0");

          newStats[mode][difficulty] = {
            bestTime,
            gamesPlayed,
            gamesWon,
            gamesLost,
          };
        }
      }
      setStats(newStats);
    };

    loadStats();
  }, []);

  const formatTime = (seconds) => {
    if (seconds === 0) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const renderStatCard = (title, value, icon) => (
    <div className="border rounded-lg shadow-sm bg-white p-4 flex items-center gap-3">
      <div className="bg-blue-100 rounded-full p-2 text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );

  const renderDifficultyStats = (mode, difficulty) => {
    const data = stats[mode][difficulty];
    const winRate = data.gamesPlayed > 0 ? Math.round((data.gamesWon / data.gamesPlayed) * 100) : 0;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {renderStatCard("Mejor Tiempo", formatTime(data.bestTime), <Clock className="h-5 w-5" />)}
          {renderStatCard("Partidas Jugadas", data.gamesPlayed, <PlayCircle className="h-5 w-5" />)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {renderStatCard("Partidas Ganadas", data.gamesWon, <CheckCircle className="h-5 w-5" />)}
          {renderStatCard("Partidas Perdidas", data.gamesLost, <XCircle className="h-5 w-5" />)}
        </div>
        <div className="border rounded-lg shadow-sm bg-white p-4 flex items-center gap-3">
          <div className="bg-blue-100 rounded-full p-2 text-blue-600">
            <Award className="h-5 w-5" />
          </div>
          <div className="w-full">
            <p className="text-sm text-gray-500">Porcentaje de Victoria</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1.5 mb-1">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${winRate}%` }}></div>
            </div>
            <p className="text-xl font-bold">{winRate}%</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Estadisticas" />

      <main className="flex-1 container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="grid grid-cols-2 mb-4 gap-2">
            <button
              className={`py-2 px-4 rounded ${mainTab === "classic" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setMainTab("classic")}
            >
              Modo Clásico
            </button>
            <button
              className={`py-2 px-4 rounded ${mainTab === "expert" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setMainTab("expert")}
            >
              Modo Experto
            </button>
          </div>

          <div className="mb-4 bg-white p-4 rounded shadow-sm flex items-center gap-2">
            <Trophy className={`h-5 w-5 ${mainTab === "classic" ? "text-yellow-500" : "text-purple-500"}`} />
            <span className="text-lg font-semibold">
              {mainTab === "classic" ? "Modo Clásico" : "Modo Experto"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {["facil", "medio", "dificil"].map((level) => (
              <button
                key={level}
                className={`py-2 px-4 rounded ${
                  subTab === level ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSubTab(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {renderDifficultyStats(mainTab, subTab)}
        </motion.div>
      </main>

      <footer className="bg-white shadow p-4 text-center text-sm text-gray-500">
        © 2025 Estadísticas del Juego
      </footer>
    </div>
  );
}
