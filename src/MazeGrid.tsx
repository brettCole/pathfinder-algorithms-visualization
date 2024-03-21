import { useState } from 'react';
import './MazeGrid.css'

function MazeGrid() {
  const initialMaze = [
    ['wall', 'wall', 'wall', 'wall'],
    ['start', 'path', 'path', 'wall'],
    ['wall', 'wall', 'path', 'end'],
    ['wall', 'wall', 'wall', 'wall']
  ];

  const [maze, setMaze] = useState(initialMaze);

  function generateMaze(height: number, width: number) {
    const matrix: string[][] = [];

    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const cell = Math.random()
        row.push('wall');
      }
      matrix.push(row);
    }
    console.log(matrix);

    const dirs = [
      [0, 1], 
      [1, 0], 
      [0, -1], 
      [-1, 0]
    ];

    function isCellValid(x: number, y: number) {
      return y >= 0 && 
        x >= 0 && 
        x < width && 
        y < height && 
        matrix[y][x] === 'wall';
    }

    function carvePath(x: number, y: number) {
      matrix[y][x] = 'path';

      const directions = dirs.sort(() => Math.random() - 0.5);

      for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = 'path';
          carvePath(nx, ny);
        }
      }
    }
    carvePath(1, 1);

    matrix[1][0] = 'start';
    matrix[height - 2][width - 1] = 'end';

    setMaze(matrix);
  }

  return (
    <div className='maze-grid'>
      <button 
        className='maze-button' 
        onClick={() => generateMaze(10, 10)}
      >
        Refresh Maze
      </button>
      <div className="maze">
        {maze.map((row, rowIndex) => (
          <div className='row'>
            {row.map((cell, cellIndex) => (
              <div className={`cell ${cell}`}>

              </div>
            ))}
          </div>
        ))}
        
      </div>
    </div>
  )
}

export default MazeGrid