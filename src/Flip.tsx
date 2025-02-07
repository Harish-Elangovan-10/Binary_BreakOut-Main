import { useState, useEffect, useCallback } from 'react';
import { Card } from './components/Card';
import { Timer } from './components/Timer';
import { CardType, GameState } from './types.ts';
import { useLocation, useNavigate } from 'react-router-dom';

const MESSAGES = [
  "Keep going!",
  "You're doing great!",
  "Almost there!",
  "Don't give up!",
];

function createDeck(): CardType[] {
  const cards: CardType[] = [
    { id: 0, type: 'answer', value: 6, isFlipped: false },
    ...Array(15).fill(null).map((_, i) => ({ 
      id: i + 1, 
      type: 'penalty' as 'penalty', 
      isFlipped: false 
    })),
    ...Array(8).fill(null).map((_, i) => ({ 
      id: i + 16, 
      type: 'bonus' as 'bonus', 
      isFlipped: false 
    })),
    ...Array(7).fill(null).map((_, i) => ({ 
      id: i + 24, 
      type: 'shuffle' as 'shuffle', 
      isFlipped: false 
    })),
    ...Array(4).fill(null).map((_, i) => ({ 
      id: i + 31, 
      type: 'message' as 'message', 
      message: MESSAGES[i], 
      isFlipped: false 
    }))
  ];
  
  return cards.sort(() => Math.random() - 0.5);
}

function Flip() {
  const location = useLocation();
  const previousTime = location.state?.round1Time || 0;
  const [cards, setCards] = useState<CardType[]>(createDeck());
  const [time, setTime] = useState(previousTime);
  const [gameState, setGameState] = useState<GameState>('playing');

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    document.title = 'Flip the Cards';
  });

  const shuffleRemainingCards = useCallback(() => {
    setCards(cards => {
      const unflippedCards = cards.filter(card => !card.isFlipped);
      const flippedCards = cards.filter(card => card.isFlipped);
      const shuffledUnflipped = [...unflippedCards].sort(() => Math.random() - 0.5);
      return [...flippedCards, ...shuffledUnflipped];
    });
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (gameState !== 'playing') return;

    setCards(prevCards => {
      const newCards = [...prevCards];
      const card = newCards[index];
      card.isFlipped = true;
      return newCards;
    });

    const card = cards[index];
    switch (card.type) {
      case 'answer':
        setTimeout(() => setGameState('won'), 250);
        break;
      case 'penalty':
        setTime((t: number) => t + 5);
        break;
      case 'bonus':
        setTime((t: number) => Math.max(0, t - 5));
        break;
      case 'shuffle':
        setTimeout(shuffleRemainingCards, 750);
        break;
    }
  }, [gameState, shuffleRemainingCards, cards]);
  useEffect(() => {
    console.log('Current time:', time);
  }, [time]);

  const navigate = useNavigate();
  const nextRound = useCallback(() => {
    navigate('/Round3', { state: { round2Time: time } });
  }, [navigate, time]);

  useEffect(() => {
    if (gameState !== 'playing') return;
  
    const timer = setInterval(() => {
      setTime((prevTime: number) => prevTime + 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [gameState]);

  return (
    <div className="main-bg left-10 min-h-screen self-center pt-4 pl-10">
      <Timer time={time} />
      
      <div className="grid-size mx-auto">
        <div className="grid grid-cols-7 gap-4">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>

      {gameState !== 'playing' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-emerald-500">
            🎉 Congratulations!
          </h2>
          <p className="text-2xl mb-2 text-white">
            You found the key: <span className="text-green-600 font-bold">6</span>
          </p>
          <p className="text-xl mb-6 text-white">
            Completion time: {formatTime(time)}
          </p>
          <button 
            type='button'
            onClick={nextRound}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Next Round
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

export default Flip