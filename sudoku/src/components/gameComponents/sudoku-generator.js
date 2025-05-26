// Generador de Sudoku mejorado y optimizado

// Generar un tablero de Sudoku resuelto
function generateSolvedBoard() {
  // Comenzar con un tablero base predefinido para evitar bucles infinitos
  const baseBoard = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

  // Mezclar el tablero base para crear variedad
  const shuffledBoard = shuffleBoard(baseBoard);
  return shuffledBoard;
}

// Mezclar un tablero de Sudoku manteniendo la validez
function shuffleBoard(board) {
  let newBoard = board.map(row => [...row]);
  
  // Intercambiar filas dentro de los mismos grupos de 3
  for (let group = 0; group < 3; group++) {
    const rows = [group * 3, group * 3 + 1, group * 3 + 2];
    shuffleArray(rows);
    
    const tempRows = [
      [...newBoard[group * 3]],
      [...newBoard[group * 3 + 1]],
      [...newBoard[group * 3 + 2]]
    ];
    
    newBoard[group * 3] = tempRows[rows[0] - group * 3];
    newBoard[group * 3 + 1] = tempRows[rows[1] - group * 3];
    newBoard[group * 3 + 2] = tempRows[rows[2] - group * 3];
  }
  
  // Intercambiar columnas dentro de los mismos grupos de 3
  for (let group = 0; group < 3; group++) {
    const cols = [group * 3, group * 3 + 1, group * 3 + 2];
    shuffleArray(cols);
    
    for (let row = 0; row < 9; row++) {
      const tempCols = [
        newBoard[row][group * 3],
        newBoard[row][group * 3 + 1],
        newBoard[row][group * 3 + 2]
      ];
      
      newBoard[row][group * 3] = tempCols[cols[0] - group * 3];
      newBoard[row][group * 3 + 1] = tempCols[cols[1] - group * 3];
      newBoard[row][group * 3 + 2] = tempCols[cols[2] - group * 3];
    }
  }
  
  // Intercambiar números para mayor variedad
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffledNumbers = [...numbers];
  shuffleArray(shuffledNumbers);
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const originalNumber = newBoard[row][col];
      const newNumber = shuffledNumbers[originalNumber - 1];
      newBoard[row][col] = newNumber;
    }
  }
  
  return newBoard;
}

// Verificar si un número puede ser colocado en una posición específica
function isValidPlacement(board, row, col, num, regions) {
  // Verificar fila
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false;
  }

  // Verificar columna
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false;
  }

  if (regions) {
    // Verificar región (usando el mapa de regiones proporcionado)
    const regionId = regions[row][col];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (regions[r][c] === regionId && (r !== row || c !== col) && board[r][c] === num) {
          return false;
        }
      }
    }
  } else {
    // Verificar subcuadro 3x3 (modo clásico)
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const currentRow = boxRow + r;
        const currentCol = boxCol + c;
        if (currentRow !== row || currentCol !== col) {
          if (board[currentRow][currentCol] === num) return false;
        }
      }
    }
  }

  return true;
}

// Mezclar un array in-place
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Generar un puzzle de Sudoku eliminando números de un tablero resuelto
export function generateSudoku(difficulty) {
  try {
    // Generar un tablero resuelto
    const solution = generateSolvedBoard();

    // Crear una copia para el puzzle
    const puzzle = solution.map((row) => [...row]);

    // Crear regiones clásicas (subcuadros 3x3)
    const regions = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    // Asignar IDs de región para el modo clásico (subcuadros 3x3)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        regions[row][col] = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      }
    }

    // Calcular cuántas celdas eliminar según la dificultad
    const difficultyMap = {
      0.3: 35, // fácil - 35 celdas eliminadas
      0.5: 45, // medio - 45 celdas eliminadas  
      0.7: 55  // difícil - 55 celdas eliminadas
    };
    
    const cellsToRemove = difficultyMap[difficulty] || 40;

    // Crear una lista de todas las posiciones
    const positions = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push([row, col]);
      }
    }
    
    // Mezclar las posiciones
    shuffleArray(positions);

    // Eliminar celdas según la dificultad
    let removed = 0;
    for (const [row, col] of positions) {
      if (removed >= cellsToRemove) break;
      
      puzzle[row][col] = 0;
      removed++;
    }

    return { puzzle, solution, regions };
  } catch (error) {
    console.error('Error generando el Sudoku:', error);
    
    // Fallback: devolver un puzzle simple si hay error
    const simplePuzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    const simpleSolution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    const regions = Array(9).fill(0).map(() => Array(9).fill(0));
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        regions[row][col] = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      }
    }

    return { puzzle: simplePuzzle, solution: simpleSolution, regions };
  }
}

// Generar regiones irregulares más simples y eficientes
function generateSimpleIrregularRegions() {
  const regions = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Patrón predefinido de regiones irregulares
  const pattern = [
    [0, 0, 1, 1, 1, 2, 2, 2, 2],
    [0, 0, 0, 1, 1, 1, 2, 2, 3],
    [4, 0, 0, 5, 5, 1, 3, 3, 3],
    [4, 4, 5, 5, 5, 6, 6, 3, 3],
    [4, 4, 4, 5, 6, 6, 6, 7, 7],
    [8, 8, 4, 6, 6, 6, 7, 7, 7],
    [8, 8, 8, 8, 7, 7, 7, 7, 1],
    [8, 2, 2, 3, 3, 5, 5, 1, 1],
    [2, 2, 3, 3, 3, 5, 1, 1, 1]
  ];
  
  return pattern;
}

// Generar un Sudoku con regiones irregulares para el modo experto
export function generateIrregularSudoku(difficulty) {
  try {
    // Usar el mismo tablero base pero con regiones irregulares
    const solution = generateSolvedBoard();
    const puzzle = solution.map((row) => [...row]);
    const regions = generateSimpleIrregularRegions();

    // Calcular cuántas celdas eliminar según la dificultad
    const difficultyMap = {
      0.3: 40, // fácil - 40 celdas eliminadas
      0.5: 50, // medio - 50 celdas eliminadas  
      0.7: 60  // difícil - 60 celdas eliminadas
    };
    
    const cellsToRemove = difficultyMap[difficulty] || 45;

    // Crear una lista de todas las posiciones
    const positions = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push([row, col]);
      }
    }
    
    // Mezclar las posiciones
    shuffleArray(positions);

    // Eliminar celdas según la dificultad
    let removed = 0;
    for (const [row, col] of positions) {
      if (removed >= cellsToRemove) break;
      
      puzzle[row][col] = 0;
      removed++;
    }

    return { puzzle, solution, regions };
  } catch (error) {
    console.error('Error generando el Sudoku irregular:', error);
    
    // Usar el generador clásico como fallback
    return generateSudoku(difficulty);
  }
}

// Verificar si una solución es válida
export function checkSolution(board, row, col, num, regions) {
  return isValidPlacement(board, row, col, num, regions);
}