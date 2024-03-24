import { useCallback, useEffect, useMemo, useState } from 'react';
import './MazeGrid.css'

export default function MazeGrid({ width = 10, height = 10 }) {
  const [maze, setMaze] = useState<string[][]>([]);
  const [timeoutIds, setTimeoutIds] = useState<number[]>([]);
  const dirs = useMemo(() => {
    return ( [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]
    );
  }, [])

  const generateMaze = useCallback((height: number, width: number) => {
    const matrix: string[][] = [];

    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push('wall');
      }
      matrix.push(row);
    }
    console.log(matrix);

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
    setMaze(matrix);
  }, [dirs]);

  useEffect(() => {
    generateMaze(height, width);
  }, [generateMaze, height, width]);

  function bfs(startNode: number[]) {
    const queue = [startNode];
    console.log('queue => ', queue)
    const visited = new Set(`${startNode[0]},${startNode[1]}`);

    function visitCell([x, y]: number[]) {
      setMaze((prevMaze) => 
        prevMaze.map((row, rowIndex) => 
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === 'end' ? 'end' : 'visited';
            }
            return cell;
          })
        )
      )

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

      const result: number[] | undefined = queue.shift();
      try {
        if (result) {
          const [x, y] = result;
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
            }
          }  
        } else {
          throw new Error('queue.shift() returned undefined');
        }
      } catch (err) {
        console.error(err);
      }
      
      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds: number[]) => [...previousTimeoutIds, timeoutId]);
    }

    step()
    return false;
  }

  function dfs(startNode: number[]) {
    const stack = [startNode];
    console.log('stack => ', stack)
    const visited = new Set(`${startNode[0]},${startNode[1]}`);

    function visitCell([x, y]: number[]) {
      console.log(x, y);

      setMaze((prevMaze) => 
        prevMaze.map((row, rowIndex) => 
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === 'end' ? 'end' : 'visited';
            }
            return cell;
          })
        )
      )

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

      const result: number[] | undefined = stack.pop();
      try {
        if (result) {
          const [x, y] = result;
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
            }
          }
        } else {
          throw new Error('stack.pop() returned undefined.');
        }
      } catch (err) {
        console.error(err);
      }

      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [...previousTimeoutIds, timeoutId]);
    }

    step();
    return false;
  }

  function refreshMaze() {
    timeoutIds.forEach(clearTimeout);
    setTimeoutIds([]);
    generateMaze(10, 10);
  }

  return (
    <div className='maze-grid'>
      <div className='controls'>
        <button 
          className='maze-button' 
          onClick={() => refreshMaze()}
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
              <div key={`cell-${cellIndex}`} className={`cell ${cell}`}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}