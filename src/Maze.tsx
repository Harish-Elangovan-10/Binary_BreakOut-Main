import { useEffect, useState, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Cell {
  x: number;
  y: number;
  visited: boolean;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
}

const MAZE_SIZE = 15;

const initializeMaze = () => {
  const newMaze: Cell[][] = [];
  for (let y = 0; y < MAZE_SIZE; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < MAZE_SIZE; x++) {
      row.push({
        x,
        y,
        visited: false,
        walls: { top: true, right: true, bottom: true, left: true },
      });
    }
    newMaze.push(row);
  }
  return newMaze;
};

function Maze () {
  const [time, setTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    document.title = 'Maze';
  });

  // Move the timer logic to App component
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!gameWon) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameWon]);

  const navigate = useNavigate();
  const handleNextRound = useCallback(() => {
    navigate('/Flip', { state: { round1Time: time } });
  }, [navigate, time]);

  // Reset handler
  const handleGameWon = () => {
    setGameWon(true);
  };
  const [maze, setMaze] = useState<Cell[][]>(initializeMaze());
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [showDialog, setShowDialog] = useState(false);

  const generateMaze = useCallback((maze: Cell[][]) => {
    const stack: Cell[] = [];
    const startCell = maze[0][0];
    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = getUnvisitedNeighbors(current, maze);

      if (neighbors.length === 0) {
        stack.pop();
      } else {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWalls(current, next);
        next.visited = true;
        stack.push(next);
      }
    }

    maze.forEach(row => row.forEach(cell => cell.visited = false));
    return maze;
  }, []);

  const getUnvisitedNeighbors = (cell: Cell, maze: Cell[][]) => {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    if (y > 0 && !maze[y - 1][x].visited) neighbors.push(maze[y - 1][x]);
    if (x < MAZE_SIZE - 1 && !maze[y][x + 1].visited) neighbors.push(maze[y][x + 1]);
    if (y < MAZE_SIZE - 1 && !maze[y + 1][x].visited) neighbors.push(maze[y + 1][x]);
    if (x > 0 && !maze[y][x - 1].visited) neighbors.push(maze[y][x - 1]);

    return neighbors;
  };

  const removeWalls = (current: Cell, next: Cell) => {
    const dx = next.x - current.x;
    const dy = next.y - current.y;

    if (dx === 1) {
      current.walls.right = false;
      next.walls.left = false;
    } else if (dx === -1) {
      current.walls.left = false;
      next.walls.right = false;
    } else if (dy === 1) {
      current.walls.bottom = false;
      next.walls.top = false;
    } else if (dy === -1) {
      current.walls.top = false;
      next.walls.bottom = false;
    }
  };

  const movePlayer = useCallback((direction: 'up' | 'right' | 'down' | 'left') => {
    if (gameWon || !maze.length) return;

    const currentCell = maze[playerPos.y][playerPos.x];
    let newPos = { ...playerPos };

    switch (direction) {
      case 'up':
        if (!currentCell.walls.top && playerPos.y > 0) newPos.y--;
        break;
      case 'right':
        if (!currentCell.walls.right && playerPos.x < MAZE_SIZE - 1) newPos.x++;
        break;
      case 'down':
        if (!currentCell.walls.bottom && playerPos.y < MAZE_SIZE - 1) newPos.y++;
        break;
      case 'left':
        if (!currentCell.walls.left && playerPos.x > 0) newPos.x--;
        break;
    }

    if (newPos.x !== playerPos.x || newPos.y !== playerPos.y) {
      setPlayerPos(newPos);

      if (newPos.x === MAZE_SIZE - 1 && newPos.y === MAZE_SIZE - 1) {
        setGameWon(true);
        setShowDialog(true);
        handleGameWon();
      }
    }
  }, [gameWon, maze, playerPos, gameWon]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
        movePlayer('right');
        break;
      case 'ArrowRight':
        movePlayer('down');
        break;
      case 'ArrowDown':
        movePlayer('left');
        break;
      case 'ArrowLeft':
        movePlayer('up');
        break;
    }
  }, [movePlayer]);

  // Initialization effect
  useEffect(() => {
    const newMaze = generateMaze(initializeMaze());
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setGameWon(false);
    setShowDialog(false);
    setTime(0);
  }, [generateMaze, setTime]);

  // Keyboard event effect
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-[#181818] p-8">
      <div className="max-w-3xl mx-auto relative">
        <div className="text-2xl font-mono text-gray-300 bg-[#242424] px-4 py-2 rounded-lg mb-8 inline-block">
          {Math.floor(time / 60).toString().padStart(2, '0')}:
          {(time % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex flex-col items-center"></div>
    <div className="flex flex-col items-center gap-6">
      <div className="bg-[#242424] p-6 rounded-lg shadow-xl">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)` }}>
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="w-8 h-8 relative"
                style={{
                  borderTop: cell.walls.top ? '2px solid #404040' : 'none',
                  borderRight: cell.walls.right ? '2px solid #404040' : 'none',
                  borderBottom: cell.walls.bottom ? '2px solid #404040' : 'none',
                  borderLeft: cell.walls.left ? '2px solid #404040' : 'none',
                }}
              >
                {playerPos.x === x && playerPos.y === y && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  </div>
                )}
                {x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1 && (
                  <div className="absolute inset-0 flex items-center justify-center text-yellow-500">
                    <Trophy size={20} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => movePlayer('right')}
            className="p-2 bg-[#242424] text-gray-300 rounded hover:bg-[#2a2a2a]"
          >
            <ArrowUp size={24} />
          </button>
        </div>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => movePlayer('up')}
            className="p-2 bg-[#242424] text-gray-300 rounded hover:bg-[#2a2a2a]"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={() => movePlayer('left')}
            className="p-2 bg-[#242424] text-gray-300 rounded hover:bg-[#2a2a2a]"
          >
            <ArrowDown size={24} />
          </button>
          <button
            onClick={() => movePlayer('down')}
            className="p-2 bg-[#242424] text-gray-300 rounded hover:bg-[#2a2a2a]"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#242424] p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Congratulations!</h2>
            <p className="text-gray-300 text-lg mb-6">The code is 9</p>
            <button
              onClick={handleNextRound}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next Round
            </button>
          </div>
        </div>
      )}
    </div>
    {gameWon && <p className="text-2xl text-green-500 mt-4">Congratulations! You won!</p>}
        <p className="mt-6 text-gray-400 text-center">
          Use arrow keys or buttons to navigate through the maze.<br />
          Reach the trophy to win!
        </p>
      </div>
    </div>
  );
};

export default Maze;