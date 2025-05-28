# SudokubyValen

Una aplicación moderna de Sudoku desarrollada con React y Capacitor, que ofrece una experiencia de juego híbrida tanto para web como para dispositivos móviles Android.

## Características

- **Dos Modos de Juego**
  - Modo Clásico: Sudoku tradicional 9x9
  - Modo Experto: Regiones irregulares para mayor desafío

- **Niveles de Dificultad**
  - 😊 Fácil: Ideal para principiantes
  - 🤔 Medio: Para jugadores con experiencia
  - 😈 Difícil: Desafío máximo para expertos

- **Funcionalidades Especiales**
  - ❤️ Sistema de Vidas
  - ⏱️ Cronómetro y registro de mejores tiempos
  - 📝 Modo de notas para estrategias avanzadas
  - 🌓 Tema claro/oscuro
  - 📊 Estadísticas de juego
  - 🎯 Tutorial interactivo

## Tecnologías Utilizadas

- **Frontend**
  - React
  - Framer Motion para animaciones
  - TailwindCSS para estilos
  - Lucide Icons

- **Mobile**
  - Capacitor para la versión Android
  - APIs nativas (Haptics, Storage)

## Instalación

1. Clona el repositorio:
\`\`\`bash
git clone https://github.com/yourusername/SudokubyValen.git
cd SudokubyValen
\`\`\`

2. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

3. Inicia el servidor de desarrollo:
\`\`\`bash
npm start
\`\`\`

## Compilación para Android

1. Construye la aplicación:
\`\`\`bash
npm run build
\`\`\`

2. Sincroniza con Android:
\`\`\`bash
npx cap sync android
\`\`\`

3. Abre en Android Studio:
\`\`\`bash
npx cap open android
\`\`\`

## Cómo Jugar

1. **Objetivo**: Completa la cuadrícula 9x9 con números del 1 al 9
2. **Reglas**:
   - Cada fila debe contener los números 1-9 sin repetir
   - Cada columna debe contener los números 1-9 sin repetir
   - Cada región debe contener los números 1-9 sin repetir
3. **Vidas**: Tienes 4 vidas por partida
4. **Notas**: Mantén presionada una celda para activar el modo de notas


## Autor

- **Valentina** - *Desarrollo Inicial* - [GitHub](https://github.com/yourusername)

