// Generador de Sudoku mejorado con soporte para regiones irregulares

// Generar un tablero de Sudoku resuelto
function generateSolvedBoard() {
  const maxAttempts = 5;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    // Comenzar con un tablero vacío
    const board = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0))

    // Resolver el tablero (esto generará un tablero resuelto aleatorio)
    if (solveSudoku(board)) {
      return board
    }
    attempts++
  }
  
  throw new Error('No se pudo generar un tablero válido después de varios intentos')
}

// Resolver el tablero de Sudoku usando backtracking
function solveSudoku(board, attempts = 0) {
  // Limitar el número de intentos para evitar bucles infinitos
  if (attempts > 1000) return false

  // Encontrar una celda vacía
  const emptyCell = findEmptyCell(board)

  // Si no se encuentra ninguna celda vacía, el tablero está resuelto
  if (!emptyCell) return true

  const [row, col] = emptyCell

  // Probar números del 1 al 9 en orden aleatorio
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  shuffleArray(numbers)

  for (const num of numbers) {
    // Verificar si el número es válido en esta posición
    if (isValidPlacement(board, row, col, num)) {
      // Colocar el número
      board[row][col] = num

      // Intentar resolver recursivamente el resto del tablero
      if (solveSudoku(board, attempts + 1)) {
        return true
      }

      // Si no pudimos resolver el tablero con este número, retroceder
      board[row][col] = 0
    }
  }

  // No se encontró solución con la configuración actual
  return false
}

// Encontrar una celda vacía en el tablero
function findEmptyCell(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return [row, col]
      }
    }
  }
  return null
}

// Verificar si un número puede ser colocado en una posición específica
function isValidPlacement(board, row, col, num, regions) {
  // Verificar fila
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false
  }

  // Verificar columna
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false
  }

  if (regions) {
    // Verificar región (usando el mapa de regiones proporcionado)
    const regionId = regions[row][col]
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (regions[r][c] === regionId && board[r][c] === num) {
          return false
        }
      }
    }
  } else {
    // Verificar subcuadro 3x3 (modo clásico)
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[boxRow + r][boxCol + c] === num) return false
      }
    }
  }

  return true
}

// Mezclar un array in-place
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

// Generar un puzzle de Sudoku eliminando números de un tablero resuelto
export function generateSudoku(difficulty) {
  try {
    // Generar un tablero resuelto
    const solution = generateSolvedBoard()

    // Crear una copia para el puzzle
    const puzzle = solution.map((row) => [...row])

    // Crear regiones clásicas (subcuadros 3x3)
    const regions = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0))

    // Asignar IDs de región para el modo clásico (subcuadros 3x3)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        regions[row][col] = Math.floor(row / 3) * 3 + Math.floor(col / 3)
      }
    }

    // Calcular cuántas celdas eliminar según la dificultad (0-1)
    const cellsToRemove = Math.floor(difficulty * 50) + 20 // Entre 20 y 70 celdas

    // Eliminar celdas aleatoriamente
    let removed = 0
    let maxAttempts = cellsToRemove * 2 // Dar suficientes intentos para eliminar celdas
    while (removed < cellsToRemove && maxAttempts > 0) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)

      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0
        removed++
      }
      maxAttempts--
    }

    return { puzzle, solution, regions }
  } catch (error) {
    console.error('Error generando el Sudoku:', error)
    // Reintentar una vez más si falla
    return generateSudoku(difficulty)
  }
}

// Generar un Sudoku con regiones irregulares para el modo experto
export function generateIrregularSudoku(difficulty) {
  // Generar regiones irregulares
  const regions = generateIrregularRegions()

  // Generar un tablero resuelto con las regiones irregulares
  const solution = generateSolvedBoardWithRegions(regions)

  // Crear una copia para el puzzle
  const puzzle = solution.map((row) => [...row])

  // Calcular cuántas celdas eliminar según la dificultad
  // Para el modo experto, hacemos que sea un poco más difícil
  const cellsToRemove = Math.floor(difficulty * 45) + 25 // Entre 25 y 70 celdas

  // Eliminar celdas aleatoriamente
  let removed = 0
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0
      removed++
    }
  }

  return { puzzle, solution, regions }
}

// Generar regiones irregulares para el modo experto
function generateIrregularRegions() {
  // Inicializar el tablero de regiones con -1 (sin asignar)
  const regions = Array(9)
    .fill(0)
    .map(() => Array(9).fill(-1))

  // Crear 9 regiones con 9 celdas cada una
  for (let regionId = 0; regionId < 9; regionId++) {
    // Comenzar con una celda aleatoria que no tenga región asignada
    const availableCells = []
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (regions[row][col] === -1) {
          availableCells.push([row, col])
        }
      }
    }

    if (availableCells.length === 0) break

    // Elegir una celda inicial aleatoria
    const randomIndex = Math.floor(Math.random() * availableCells.length)
    const [startRow, startCol] = availableCells[randomIndex]
    regions[startRow][startCol] = regionId

    // Crecer la región hasta que tenga 9 celdas
    let cellsInRegion = 1
    while (cellsInRegion < 9) {
      // Encontrar todas las celdas adyacentes a la región actual
      const adjacentCells = []

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (regions[row][col] === regionId) {
            // Verificar las 4 direcciones (arriba, abajo, izquierda, derecha)
            const directions = [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ]

            for (const [dr, dc] of directions) {
              const newRow = row + dr
              const newCol = col + dc

              if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9 && regions[newRow][newCol] === -1) {
                adjacentCells.push([newRow, newCol])
              }
            }
          }
        }
      }

      if (adjacentCells.length === 0) break

      // Elegir una celda adyacente aleatoria y añadirla a la región
      const randomAdjacentIndex = Math.floor(Math.random() * adjacentCells.length)
      const [newRow, newCol] = adjacentCells[randomAdjacentIndex]
      regions[newRow][newCol] = regionId
      cellsInRegion++
    }
  }

  // Si quedan celdas sin asignar, asignarlas a regiones adyacentes
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (regions[row][col] === -1) {
        // Encontrar regiones adyacentes
        const adjacentRegions = new Set()
        const directions = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]

        for (const [dr, dc] of directions) {
          const newRow = row + dr
          const newCol = col + dc

          if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9 && regions[newRow][newCol] !== -1) {
            adjacentRegions.add(regions[newRow][newCol])
          }
        }

        if (adjacentRegions.size > 0) {
          // Asignar a una región adyacente aleatoria
          const adjacentRegionsArray = Array.from(adjacentRegions)
          const randomRegion = adjacentRegionsArray[Math.floor(Math.random() * adjacentRegionsArray.length)]
          regions[row][col] = randomRegion
        } else {
          // Si no hay regiones adyacentes, asignar a una región aleatoria
          regions[row][col] = Math.floor(Math.random() * 9)
        }
      }
    }
  }

  return regions
}

// Generar un tablero resuelto con regiones irregulares
function generateSolvedBoardWithRegions(regions) {
  // Comenzar con un tablero vacío
  const board = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0))

  // Resolver el tablero usando las regiones irregulares
  solveSudokuWithRegions(board, regions)

  return board
}

// Resolver el tablero de Sudoku con regiones irregulares
function solveSudokuWithRegions(board, regions) {
  // Encontrar una celda vacía
  const emptyCell = findEmptyCell(board)

  // Si no se encuentra ninguna celda vacía, el tablero está resuelto
  if (!emptyCell) return true

  const [row, col] = emptyCell

  // Probar números del 1 al 9 en orden aleatorio
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  shuffleArray(numbers)

  for (const num of numbers) {
    // Verificar si el número es válido en esta posición
    if (isValidPlacement(board, row, col, num, regions)) {
      // Colocar el número
      board[row][col] = num

      // Intentar resolver recursivamente el resto del tablero
      if (solveSudokuWithRegions(board, regions)) {
        return true
      }

      // Si no pudimos resolver el tablero con este número, retroceder
      board[row][col] = 0
    }
  }

  // No se encontró solución con la configuración actual
  return false
}

// Verificar si una solución es válida
export function checkSolution(board, row, col, num, regions) {
  return isValidPlacement(board, row, col, num, regions)
}
