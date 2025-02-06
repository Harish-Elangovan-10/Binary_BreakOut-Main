import { TimerIcon } from 'lucide-react';

interface TimerProps {
  time: number;
}

export function Timer({ time }: TimerProps) {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 left-4 bg-white/10 backdrop-blur-lg rounded-lg p-4 text-white flex items-center space-x-2">
      <TimerIcon size={25}/>
      <span className="text-2xl font-bold">{formatTime(time)}</span>
    </div>
  );
}