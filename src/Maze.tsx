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
    navigate('/phishing', { state: { round1Time: time } });
  }, [navigate, time]);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111122] to-[#0a0a0a] p-8">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="absolute top-4 left-4 text-2xl font-mono text-cyan-300 bg-[#0f1419] border border-cyan-500/30 px-6 py-3 rounded-xl shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
          <div className="text-center font-bold tracking-wider">
            <span className="text-cyan-400">TIME:</span> {Math.floor(time / 60).toString().padStart(2, '0')}:
            {(time % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="flex flex-col items-center mb-5">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 tracking-wider">
            NEURAL MAZE
          </h1>
          <p className="mt-2 text-cyan-200/80 text-center text-lg">
            Use arrow keys or buttons to navigate through the maze.<br />
            <span className='text-amber-400 text-center font-bold text-lg glow-text animate-pulse'>Note: Your keys are FAULTY!!!</span>
          </p>
        </div>
    <div className="flex flex-col items-center gap-8">
      <div className="bg-[#0f1419] border-2 border-cyan-500/40 p-8 rounded-3xl shadow-2xl shadow-cyan-500/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>
        <div className="grid gap-0.5 relative z-10" style={{ gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)` }}>
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="w-8 h-8 relative bg-[#0a0f14] transition-all duration-200"
                style={{
                  borderTop: cell.walls.top ? '2px solid rgb(34 211 238 / 0.8)' : 'none',
                  borderRight: cell.walls.right ? '2px solid rgb(34 211 238 / 0.8)' : 'none',
                  borderBottom: cell.walls.bottom ? '2px solid rgb(34 211 238 / 0.8)' : 'none',
                  borderLeft: cell.walls.left ? '2px solid rgb(34 211 238 / 0.8)' : 'none',
                  boxShadow: (cell.walls.top || cell.walls.right || cell.walls.bottom || cell.walls.left) 
                    ? '0 0 8px rgba(34, 211, 238, 0.3), inset 0 0 8px rgba(34, 211, 238, 0.1)' 
                    : 'none',
                }}
              >
                {playerPos.x === x && playerPos.y === y && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse shadow-xl shadow-pink-500/60" 
                         style={{ 
                           boxShadow: '0 0 20px rgb(236 72 153 / 0.8), 0 0 40px rgb(236 72 153 / 0.4), 0 0 60px rgb(236 72 153 / 0.2)' 
                         }} />
                  </div>
                )}
                {x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1 && (
                  <div className="absolute inset-0 flex items-center justify-center text-amber-400 animate-bounce">
                    <Trophy size={22} className="drop-shadow-lg" 
                           style={{ 
                             filter: 'drop-shadow(0 0 10px rgb(251 191 36 / 0.8)) drop-shadow(0 0 20px rgb(251 191 36 / 0.4))' 
                           }} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => movePlayer('right')}
            className="group p-4 bg-gradient-to-br from-[#1a2332] to-[#0f1419] border-2 border-cyan-500/40 text-cyan-300 rounded-2xl hover:border-cyan-400/80 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-95"
          >
            <ArrowUp size={28} className="group-hover:text-cyan-200 transition-colors duration-200" />
          </button>
        </div>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => movePlayer('up')}
            className="group p-4 bg-gradient-to-br from-[#1a2332] to-[#0f1419] border-2 border-cyan-500/40 text-cyan-300 rounded-2xl hover:border-cyan-400/80 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-95"
          >
            <ArrowLeft size={28} className="group-hover:text-cyan-200 transition-colors duration-200" />
          </button>
          <button
            onClick={() => movePlayer('left')}
            className="group p-4 bg-gradient-to-br from-[#1a2332] to-[#0f1419] border-2 border-cyan-500/40 text-cyan-300 rounded-2xl hover:border-cyan-400/80 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-95"
          >
            <ArrowDown size={28} className="group-hover:text-cyan-200 transition-colors duration-200" />
          </button>
          <button
            onClick={() => movePlayer('down')}
            className="group p-4 bg-gradient-to-br from-[#1a2332] to-[#0f1419] border-2 border-cyan-500/40 text-cyan-300 rounded-2xl hover:border-cyan-400/80 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-95"
          >
            <ArrowRight size={28} className="group-hover:text-cyan-200 transition-colors duration-200" />
          </button>
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#0f1419] to-[#1a2332] border-2 border-cyan-500/60 p-10 rounded-3xl shadow-2xl shadow-cyan-500/40 text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-6 tracking-wider">
                MISSION COMPLETE!
              </h2>
              <p className="text-cyan-200 text-xl mb-8 font-mono">The code is <span className="text-amber-400 font-bold text-2xl glow-text">9</span></p>
              <button
                onClick={handleNextRound}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 tracking-wider"
              >
                NEXT ROUND →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      </div>
    </div>
  );
};

export default Maze;