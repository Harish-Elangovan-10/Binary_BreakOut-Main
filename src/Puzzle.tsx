import { useState, useEffect } from 'react';
import { Trophy, Timer, Clock, Eye, TimerIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const IMAGE_URL = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=600&fit=crop";

interface Tile {
  id: number;
  currentPos: number;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${
    minutes.toString().padStart(2, '0')}:${
    remainingSeconds.toString().padStart(2, '0')}`;
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            width: '10px',
            height: '10px',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function CongratsModal({ moves, time }: { moves: number; time: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative animate-slideIn">        
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Congratulations! 🎉
          </h2>
          
          <p className="text-gray-600 mb-6">
            You've successfully completed the Binary Breakout Event!
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Timer size={20} />
              <span className="font-semibold">Total Moves: {moves}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Clock size={20} />
              <span className="font-semibold">Time: {formatTime(time)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Puzzle() {
  const location = useLocation();
  const previousTime = location.state?.round5Time || 0;
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [time, setTime] = useState(0); // Initialize to 0
  const [isActive, setIsActive] = useState(false);
  const [peeksRemaining, setPeeksRemaining] = useState(3);
  const [isPeeking, setIsPeeking] = useState(false);
  const [peekCooldown, setPeekCooldown] = useState(false);

  // Initialize puzzle
  useEffect(() => {
    initializePuzzle();
  }, []);

  useEffect(() => {
    document.title = 'Sliding Puzzle';
  });

  useEffect(() => {
    initializePuzzle();
    if (previousTime > 0) {
      setTime(previousTime);
    }
  }, [previousTime]); 

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isComplete]);

  const initializePuzzle = () => {
    // Fixed starting configuration
    // This configuration ensures the puzzle is solvable
    const fixedConfiguration: Tile[] = [
      { id: 0, currentPos: 6 },
      { id: 1, currentPos: 3 },
      { id: 2, currentPos: 8 },
      { id: 3, currentPos: 4 },
      { id: 4, currentPos: 5 },
      { id: 5, currentPos: 1 },
      { id: 6, currentPos: 7 },
      { id: 7, currentPos: 0 },
      { id: 8, currentPos: 2 }, // Empty tile
    ];

    setTiles(fixedConfiguration);
    setMoves(0);
    setIsComplete(false);
    setShowFullImage(false);
    setShowCongrats(false);
    setIsActive(true); // Start timer immediately when puzzle initializes
    setPeeksRemaining(3);
    setIsPeeking(false);
    setPeekCooldown(false);
  };

  const handlePeek = () => {
    if (peeksRemaining > 0 && !isPeeking && !peekCooldown) {
      setIsPeeking(true);
      setPeeksRemaining(prev => prev - 1);
      setPeekCooldown(true);
      setTime((prev: number) => prev + 10); // Add 10 second penalty

      // Hide the image after 5 seconds
      setTimeout(() => {
        setIsPeeking(false);
        // Reset cooldown after another 5 seconds
        setTimeout(() => {
          setPeekCooldown(false);
        }, 5000);
      }, 5000);
    }
  };

  const canMoveTile = (currentPos: number, emptyPos: number): boolean => {
    const currentRow = Math.floor(currentPos / 3);
    const currentCol = currentPos % 3;
    const emptyRow = Math.floor(emptyPos / 3);
    const emptyCol = emptyPos % 3;

    return (
      (Math.abs(currentRow - emptyRow) === 1 && currentCol === emptyCol) ||
      (Math.abs(currentCol - emptyCol) === 1 && currentRow === emptyRow)
    );
  };

  const moveTile = (tile: Tile) => {
    const emptyTile = tiles.find(t => t.id === 8);
    if (!emptyTile || !canMoveTile(tile.currentPos, emptyTile.currentPos)) return;

    // Start timer on first move
    if (!isActive) {
      setIsActive(true);
    }

    const newTiles = tiles.map(t => {
      if (t.id === tile.id) return { ...t, currentPos: emptyTile.currentPos };
      if (t.id === emptyTile.id) return { ...t, currentPos: tile.currentPos };
      return t;
    });

    setTiles(newTiles);
    setMoves(prev => prev + 1);
    
    // Check if puzzle is solved
    const isSolved = newTiles.every(t => t.currentPos === t.id);
    if (isSolved && !isComplete) {
      setIsComplete(true);
      setIsActive(false);
      // Delay showing full image and congrats modal for dramatic effect
      setTimeout(() => {
        setShowFullImage(true);
        setShowCongrats(true);
      }, 500);
    }
  };

  const getBackgroundPosition = (id: number) => {
    const row = Math.floor(id / 3);
    const col = id % 3;
    return `${-col * 200}px ${-row * 200}px`;
  };

  return (
    <div className="main-puzzle-bg min-h-screen flex items-center justify-center">
      {showCongrats && (
        <>
          <Confetti />
          <CongratsModal
            moves={moves}
            time={time}
            onClose={initializePuzzle}
          />
        </>
      )}
      
      <div className="h-12 w-24 bg-white/10 absolute left-5 top-5 flex items-center justify-center rounded-lg gap-2 text-zinc-300 text-lg">
        <TimerIcon size={25} />
        <span className="font-mono">{formatTime(time)}</span>
      </div>
      
      <div className="puzzle-bg p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6 relative">          
          <h1 className="text-3xl font-bold text-zinc-300 mb-2">Sliding Puzzle</h1>
          <p className="text-zinc-300 mb-4">Moves: {moves}</p>
          <button
            onClick={handlePeek}
            disabled={peeksRemaining === 0 || isPeeking || peekCooldown}
            className={`bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center mx-auto gap-2 transition-colors ${
              (peeksRemaining === 0 || isPeeking || peekCooldown) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Eye size={20} />
            Peek ({peeksRemaining} left) for +10s penalty
          </button>
        </div>
        
        <div className="relative bg-zinc-800 rounded-lg">
          {(showFullImage || isPeeking) && (
            <div 
              className={`absolute inset-0 z-10 ${showFullImage ? 'animate-fadeIn' : ''}`}
              style={{
                backgroundImage: `url(${IMAGE_URL})`,
                backgroundSize: 'cover',
                animation: showFullImage ? 'fadeIn 1s ease-in-out' : undefined
              }}
            />
          )}
          
          <div className={`grid grid-cols-3 gap-2 w-[625px] h-[625px] bg-color-1 p-2 rounded-lg ${
            isComplete ? 'opacity-0 transition-opacity duration-1000' : ''
          }`}>
            {Array.from({ length: 9 }, (_, index) => {
              const tile = tiles.find(t => t.currentPos === index);
              const isEmpty = tile?.id === 8;
              
              return (
                <div
                  key={index}
                  onClick={() => tile && !isEmpty && moveTile(tile)}
                  className={`relative w-full h-full transition-transform duration-200 ${
                    !isEmpty ? 'cursor-pointer hover:scale-[0.98]' : 'bg-color-1'
                  }`}
                >
                  {tile && !isEmpty && (
                    <div
                      className="w-full h-full bg-cover rounded-md shadow-md"
                      style={{
                        backgroundImage: `url(${IMAGE_URL})`,
                        backgroundPosition: getBackgroundPosition(tile.id),
                        backgroundSize: '600px 600px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Puzzle;