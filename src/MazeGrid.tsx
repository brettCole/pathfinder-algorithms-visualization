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
  const [width, setWidth] = useState(initialMaze[0].length);
  const [height, setHeight] = useState(initialMaze.length);

  // [1, 0] => '1,0'
  function bfs(startNode) {
    let queue = [startNode];
    let visited = new Set(`${startNode[0]},${startNode[1]}`);

    function visitCell([x, y]) {
      console.log(x, y);

      if (maze[y][x] === 'end') {
        console.log('path found!');
        return true;
      }
      return false;
    }

    function step() {
      if (queue.length === 0) {
        return;
      }

      const [x, y] = queue.shift();
      console.log('new step');
      const dirs = [
        [0, 1], 
        [1, 0], 
        [0, -1], 
        [-1, 0]
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`)
          if (maze[ny][nx] === 'path' || maze[ny][nx] === 'end') {
            if (visitCell([nx, ny])) {
              return true;
            }
            queue.push([nx, ny]);
          }
        } // '2,3'
      }
      step();
    }
    step()
    return false;
  }

  function dfs(startNode) {
    let stack = [startNode];
    let visited = new Set(`${startNode[0]},${startNode[1]}`);

    function visitCell([x, y]) {
      console.log(x, y);

      if (maze[y][x] === 'end') {
        console.log('path found!');
        return true;
      }
      return false;
    }

    function step() {
      if (stack.length === 0) {
        return;
      }

      const [x, y] = stack.pop();
      console.log('new step');
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
      ];
      
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          if (maze[ny][nx] === 'path' || maze[ny][nx] === 'end') {
            if (visitCell([nx, ny])) {
              return true;
            }
            stack.push([nx, ny]);
          }
        } // '2, 3'
      }
      step();
    }

    step();
    return false;
  }

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
      [-1,0]
    ];

    function isCellValid(x: number, y: number) {
      return (
        y >= 0 && 
        x >= 0 && 
        x < width && 
        y < height && 
        matrix[y][x] === 'wall'
      )
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

    setHeight(matrix.length);
    setWidth(matrix[0].length);
    setMaze(matrix);
  }

  return (
    <div className='maze-grid'>
      <div className='controls'>
        <button 
          className='maze-button' 
          onClick={() => generateMaze(10, 10)}
        >
          Refresh Maze
        </button>
        <button 
          className='maze-button' 
          onClick={() => bfs([1, 0])}
        >
          Breadth-First Search
        </button>
        <button 
          className='maze-button' 
          onClick={() => dfs([1, 0])}
        >
          Depth-First Search
        </button>
      </div>
      <div className="maze">
        {maze.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className='row'>
            {row.map((cell, cellIndex) => (
              <div key={`cell-${cellIndex}`} className={`cell ${cell}`}>

              </div>
            ))}
          </div>
        ))}
        
      </div>
    </div>
  )
}

export default MazeGrid