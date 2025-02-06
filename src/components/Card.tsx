import { useState, useEffect } from 'react';
import { Clock, Shuffle, PartyPopper, Quote, Slack } from 'lucide-react';
import { CardType } from '../types';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export function Card({ card, onClick }: CardProps) {
  const [showTimeChange, setShowTimeChange] = useState(false);

  useEffect(() => {
    if (card.isFlipped && (card.type === 'bonus' || card.type === 'penalty')) {
      const startTimer = setTimeout(() => {
        setShowTimeChange(true);
        const hideTimer = setTimeout(() => setShowTimeChange(false), 1000);
        return () => clearTimeout(hideTimer);
      }, 500);
      return () => clearTimeout(startTimer);
    }
  }, [card.isFlipped, card.type]);

  const getCardContent = () => {
    switch (card.type) {
      case 'answer':
        return (
          <>
          <span className="absolute self-center w-20 h-20 text-emerald-500 flex items-center justify-center text-4xl font-bold">6</span>
          <PartyPopper className="absolute w-5 h-5 top-4 left-4 text-emerald-300"/>
          <PartyPopper className="absolute w-5 h-5 bottom-4 right-4 text-emerald-700"/>            
          <Slack className="absolute w-3.5 h-3.5 top-3.5 right-3.5 text-zinc-700"/>
          <Slack className="absolute w-3.5 h-3.5 bottom-3.5 left-3.5 text-zinc-700"/>
          </>
        );
      case 'penalty':
        return (
          <>
          <div className="absolute self-center w-8 h-8 flex items-center justify-center">
            <Clock className="w-8 h-8 text-red-500"/>
            {showTimeChange && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 font-bold text-lg animate-ping">
                +5s
              </span>
            )}
          </div>
          <div className="absolute top-2.5 left-3 text-xl font-semibold text-red-300">+5</div>
          <div className="absolute bottom-2.5 right-3.5 text-xl font-semibold text-red-700">+5</div>            
          <Slack className="absolute w-3.5 h-3.5 top-3.5 right-3.5 text-zinc-700"/>
          <Slack className="absolute w-3.5 h-3.5 bottom-3.5 left-3.5 text-zinc-700"/>
          </>
        );
      case 'bonus':
        return (
          <>
          <div className="absolute self-center w-8 h-8 flex items-center justify-center">
            <Clock className="w-8 h-8 text-blue-500"/>
            {showTimeChange && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-blue-500 font-bold text-lg animate-ping">
                -5s
              </span>
            )}
          </div>
          <div className="absolute top-2.5 left-3 text-xl font-semibold text-blue-300">-5</div>
          <div className="absolute bottom-2.5 right-3.5 text-xl font-semibold text-blue-700">-5</div>            
          <Slack className="absolute w-3.5 h-3.5 top-3.5 right-3.5 text-zinc-700"/>
          <Slack className="absolute w-3.5 h-3.5 bottom-3.5 left-3.5 text-zinc-700"/>
          </>
        );
      case 'shuffle':
        return (
          <>
          <Shuffle className="absolute self-center w-8 h-8 text-purple-500 flex items-center justify-center"/>
          <Shuffle className="absolute w-5 h-5 top-4 left-4 text-purple-300"/>
          <Shuffle className="absolute w-5 h-5 bottom-4 right-4 text-purple-700"/>            
          <Slack className="absolute w-3.5 h-3.5 top-3.5 right-3.5 text-zinc-700"/>
          <Slack className="absolute w-3.5 h-3.5 bottom-3.5 left-3.5 text-zinc-700"/>
          </>
        );
      case 'message':
        return (
          <>
          <p className="absolute self-center w-20 h-20 text-yellow-500 flex items-center justify-center text-sm font-medium">{card.message}</p>
          <Quote className="absolute w-5 h-5 top-4 left-4 text-yellow-300"/>
          <Quote className="absolute w-5 h-5 bottom-4 right-4 text-yellow-700"/>            
          <Slack className="absolute w-3.5 h-3.5 top-3.5 right-3.5 text-zinc-700"/>
          <Slack className="absolute w-3.5 h-3.5 bottom-3.5 left-3.5 text-zinc-700"/>
          </>
        );
      default:
        return null;
    }
  };

  const getCardColor = () => {
    if (!card.isFlipped) return 'outline-zinc-500';
    switch (card.type) {
      case 'answer':
        return 'outline-emerald-500';
      case 'penalty':
        return 'outline-red-500';
      case 'bonus':
        return 'outline-blue-500';
      case 'shuffle':
        return 'outline-purple-500';
      case 'message':
        return 'outline-yellow-500';
      default:
        return 'outline-zinc-500';
    }
  };

  return (
    <div 
      onClick={!card.isFlipped ? onClick : undefined}
      className={`card-container relative w-32 pt-[100%] ${!card.isFlipped ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute inset-0 ${card.isFlipped ? 'card-flipped' : ''}`}>
        <div className="card-inner">
          <div className="card-front absolute w-full h-full backface-hidden rounded-lg shadow-md shadow-zinc-950 flex flex-col items-center justify-center p-1.5">
            <div className="outline outline-2 outline-zinc-500 w-full h-full rounded-md"></div>
            <img className="absolute self-center w-12 h-12 rounded-lg" src="/revilogo.png" alt="Revil"></img>
            <div className="vert-text flex flex-col items-start absolute bottom-3 left-3 font-semibold">
              <span className="text-violet-400">R</span>
              <span className="text-violet-500">E</span>
              <span className="text-violet-500">V</span>
              <span className="text-violet-600">I</span>
              <span className="text-violet-600">L</span>
            </div>
            <div className="vert-text flex flex-col items-start absolute top-3 right-3 font-semibold">
              <span className="text-yellow-300">R</span>
              <span className="text-yellow-400">E</span>
              <span className="text-yellow-400">V</span>
              <span className="text-yellow-500">I</span>
              <span className="text-yellow-500">L</span>
            </div>            
            <Slack className="absolute w-3.5 h-3.5 top-3.5 left-3.5 text-zinc-700"/>
            <Slack className="absolute w-3.5 h-3.5 bottom-3.5 right-3.5 text-zinc-700"/>
          </div>
          <div className="card-back absolute rounded-xl shadow-md shadow-zinc-950 flex flex-col items-center justify-center p-1.5">
            <div className={`outline outline-2 ${getCardColor()} w-full h-full rounded-md`}></div>
            {getCardContent()}
          </div>
        </div>
      </div>
    </div>
  );
}