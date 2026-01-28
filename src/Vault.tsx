import { useState, useEffect, useCallback } from 'react';
import { Timer, Lock, Unlock, Key } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function Vault() {
  const location = useLocation();
  const previousTime = location.state?.round4Time || 0;
  const no_of_possibilities = [9637, 9673, 9367, 9376, 9763, 9736, 6937, 6973, 6397, 6379, 6793, 6739, 3967, 3976, 3697, 3679, 3796, 3769, 7963, 7936, 7693, 7639, 7396, 7369];
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(previousTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isWrongAttempt, setIsWrongAttempt] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [correctCode] = useState(() => {
    const random = Math.floor(Math.random() * no_of_possibilities.length);
    return no_of_possibilities[random].toString();
  });

  useEffect(() => {
    document.title = 'Vault';
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime: number) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key) && !isAnimating) {
        handleInput(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [password, isOpen, isAnimating]);

  // Auto-focus when component mounts
  useEffect(() => {
    // This will enable keyboard input immediately
    window.focus();
    document.body.focus();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInput = (digit: string) => {
    if (password.length < 4 && !isOpen && !isAnimating) {
      const newPassword = password + digit;
      setPassword(newPassword);
      
      if (!isRunning) {
        setIsRunning(true);
      }

      if (newPassword.length === 4) {
        if (newPassword === correctCode) {
          setIsAnimating(true);
          setTimeout(() => {
            setIsOpen(true);
            setIsRunning(false);
            setIsAnimating(false);
          }, 1000);
        } else {
          setAttempts(prev => prev + 1);
          setIsWrongAttempt(true);
          setTimeout(() => {
            setPassword('');
            setIsWrongAttempt(false);
          }, 500);
        }
      }
    }
  };

  const navigate = useNavigate();
  const nextRound = useCallback(() => {
    navigate('/escaperoom', { state: { round5Time: time } });
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
  
  const handleHint = useCallback(() => {
    setShowHint(true);
    setTime((prev: number) => prev + 20); // 15 seconds penalty
  }, []);

  return (
    <div className="main-bg min-h-screen flex items-center justify-center p-4" tabIndex={-1}>
      <div className="absolute top-4 left-4 text-2xl font-mono text-white flex items-center gap-2 bg-white/20 p-3 rounded-lg backdrop-blur-sm">
        <Timer className="w-6 h-6 animate-pulse" />
        {formatTime(time)}
      </div>

      <div className={`bg-gradient-to-br from-zinc-800 to-zinc-950 backdrop-blur-sm p-12 rounded-2xl shadow-xl shadow-black max-w-md w-full transform transition-all duration-500 ${isAnimating ? 'scale-105' : ''}`}>
        <div className="text-center mb-8">
          <div className="relative w-full h-48 mb-8">
            {/* Vault Door */}
            <div className={`absolute inset-0 bg-zinc-700 rounded-xl border-8 border-zinc-700 shadow-2xl overflow-hidden
              ${isOpen ? 'animate-vault-open' : 'animate-vault-close'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900">
                {/* Vault Handle */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-600 rounded-full border-4 border-zinc-700 shadow-md">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isOpen ? (
                      <Unlock className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Lock className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </div>
                {/* Vault Bolts */}
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="absolute left-6 w-4 h-4 bg-zinc-500 rounded-full"
                    style={{ top: `${25 * (i + 1)}%` }} />
                ))}
              </div>
            </div>

            <div className='absolute inset-0 bg-zinc-950/60 rounded-lg' style={{zIndex: -10}}></div>
            
            {/* Vault Interior */}
            <div className={`absolute inset-0 bg-transparent flex items-center justify-center ${(!isAnimating && isOpen) ? 'z-50' : '-z-10'}`}>
              {isOpen && !isAnimating && (
              <button 
                type='button'
                onClick={nextRound}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Next Round
              </button>
              )}
            </div>
          </div>

          <div className={`bg-zinc-700/50 backdrop-blur-sm p-6 rounded-xl mb-4 transition-all duration-200 ${isWrongAttempt ? 'bg-red-800/50 shake' : ''}`}>
            <div className="flex justify-center space-x-4">
              {Array(4).fill(0).map((_, i) => (
                <div
                  key={i}
                  className={`relative w-14 h-14 border-2 ${
                    password.length === i 
                      ? 'border-emerald-600 animate-pulse-ring' 
                      : password.length > i 
                        ? 'border-emerald-600' 
                        : 'border-zinc-500'
                  } rounded-lg flex items-center justify-center text-2xl font-mono text-white backdrop-blur-sm
                    transition-all duration-300`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {password[i] || ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isOpen && (
          <>
            <div className="text-zinc-300 text-center mb-6 font-mono">
              Enter 4-digit code
            </div>
            {attempts < 20 && (
              <div className="text-yellow-500 text-center mb-6 font-mono">
                Help arrives in{" "}
                <span className="font-bold text-yellow-400">{20 - attempts}</span>{" "}
                moves!
              </div>
            )}

            {attempts >= 20 && !showHint && (
              <button
                onClick={handleHint}
                className="w-full bg-yellow-500/80 hover:bg-yellow-600 text-white py-3 rounded-xl mb-4 transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2 font-medium"
              >
                <Key className="w-5 h-5" />
                Show First Digit (+20s penalty)
              </button>
            )}

            {showHint && (
              <div className="text-center text-yellow-500 font-mono bg-gray-800/50 p-3 rounded-lg backdrop-blur-sm mb-4">
                First digit: {correctCode[0]}
              </div>
            )}

            <div className="text-red-600 text-center mt-4 font-mono">
              Failed attempts: {attempts}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Vault;