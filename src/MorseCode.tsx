import React, { useState, useEffect, useCallback } from 'react';
import { Book, Timer } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const morseCodeMap: { [key: string]: string } = {
  A: '-',
  B: '.--.',
  C: '.',
  D: '--.',
  E: '--.-',
  F: '....',
  G: '.--',
  H: '.---',
  I: '...',
  J: '-.--',
  K: '---',
  L: '-.-.',
  M: '.-..',
  N: '-.-',
  O: '-...',
  P: '..-',
  Q: '-..-',
  R: '--..',
  S: '...-',
  T: '.-.',
  U: '-..',
  V: '..',
  W: '--',
  X: '-.',
  Y: '.-',
  Z: '..-.',
  LetterGap: '|',
  Space: '|##|'
};

const sampleSentences = [
  'QUICK BROWN FOX',
  'MORSE CODE MASTER',
  'SECRET MESSAGE',
  'HIDDEN TREASURE',
  'CODE BREAKER',
  'MISSION SUCCESS',
  'PUZZLE SOLVED',
  'CRYPTO EXPERT',
  'SIGNAL RECEIVED',
  'DECODE THIS NOW',
  'TOP SECRET FILES',
  'SPY NETWORK ACTIVE',
  'ENCRYPTED DATA',
  'HACKER ALERT',
  'CIPHER LOCKED',
  'UNDERCOVER OPERATION',
  'CLASSIFIED REPORT',
  'AGENT ON MISSION',
  'ANONYMOUS IDENTITY',
  'INTEL GATHERING',
  'DEEP COVER SPY',
  'SECURE TRANSMISSION',
  'HIDDEN CLUES FOUND',
  'MYSTERY UNSOLVED',
  'ESPIONAGE THREAT',
  'SHADOW OPERATION',
  'PASSWORD PROTECTED',
  'TOP LEVEL ACCESS',
  'UNTRACEABLE SIGNAL',
  'INTERCEPTED COMMUNICATION',
  'INTELLIGENCE REPORT',
  'SAFE HOUSE LOCATION',
  'STEALTH MODE ON',
  'COVERT TASK FORCE',
  'DECRYPT THE CODE',
  'MISSION IMPOSSIBLE',
  'ALERT RED STATUS',
  'EVIDENCE DESTROYED',
  'SUSPECT IDENTIFIED',
  'TACTICAL EVASION',
  'NOISE JAMMING ACTIVE',
  'AGENT DOUBLE IDENTITY',
  'ROGUE OPERATIVE FOUND',
  'THREAT NEUTRALIZED',
  'SPECIAL OPS TEAM',
  'HACKED SYSTEM SECURED',
  'COMPROMISED NETWORK',
  'STEALTHY INFILTRATION',
  'CLASSIFIED LOCATION',
  'EMERGENCY EXTRACTION',
  'LOCKDOWN IN EFFECT',
  'CODED TRANSMISSION',
  'TARGET LOCATED',
  'INFILTRATION SUCCESS',
  'BLACK OPS TEAM',
  'ENCRYPTION ACTIVE',
  'TACTICAL MANEUVER',
  'DISGUISE CONFIRMED',
  'CONFIDENTIAL FILES',
  'REMOTE ACCESS DENIED',
  'SECURITY BREACHED',
  'DECEPTION MASTERED',
  'ANONYMOUS MESSAGE',
  'TOP PRIORITY CASE',
  'UNKNOWN ENCRYPTION',
  'HIDDEN PATHWAY FOUND',
  'INVISIBLE TRACKS',
  'LOCKED DATA VAULT',
  'STRATEGIC WITHDRAWAL',
  'GHOST PROTOCOL ACTIVE'
];

function MorseCode() {
  const location = useLocation();
  const previousTime = location.state?.round3Time || 0;
  const [availableSentences, setAvailableSentences] = useState<string[]>([]);
  const [selectedSentences, setSelectedSentences] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [completedSentences, setCompletedSentences] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [timer, setTimer] = useState(previousTime);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    document.title = 'Morse Code';
  });

  useEffect(() => {
    setAvailableSentences([...sampleSentences]);
  }, []);

  useEffect(() => {
    if (availableSentences.length > 0) {
      const shuffled = [...availableSentences].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      setSelectedSentences(selected);

      setAvailableSentences((prev) =>
        prev.filter((sentence) => !selected.includes(sentence))
      );
    }
  }, [availableSentences.length === sampleSentences.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev: number) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (completedSentences === 3) {
      setIsTimerRunning(false);

      let code = '3';

      setSecretCode(code);
    }
  }, [completedSentences]);

  const navigate = useNavigate();
  const nextRound = useCallback(() => {
    navigate('/Vault', { state: { round4Time: timer } });
  }, [navigate, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getMorseCode = (text: string) => {
    return text
      .split(' ')
      .map((word) =>
        word
          .split('')
          .map((char) => morseCodeMap[char] || char)
          .join(' | ')
      )
      .join('   |##|  ');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setUserInput(value);

    if (value === selectedSentences[currentIndex]) {
      if (currentIndex < 2) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setUserInput('');
          setCompletedSentences((prev) => prev + 1);
        }, 1000);
      } else {
        setCompletedSentences(3);
        setShowSuccess(true);
      }
    }
  };

  if (selectedSentences.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="fixed top-4 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
        <Timer className="w-5 h-5 text-blue-600" />
        <span className="font-mono text-lg">{formatTime(timer)}</span>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Book className="w-8 h-8" />
            Morse Code Challenge
          </h1>
          <p className="text-gray-300">
            Decode {3 - completedSentences} more message
            {3 - completedSentences !== 1 ? 's' : ''} to reveal the secret code
          </p>
        </div>

        {!showSuccess && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Morse Code Reference
              </h2>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(morseCodeMap).map(([letter, morse]) => (
                  <div
                    key={letter}
                    className="flex items-center justify-center bg-gray-50 rounded-lg p-3"
                  >
                    <span className="text-lg font-mono">
                      {letter} = <span className="text-blue-600">{morse}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Decode Message {currentIndex + 1}/3:
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p className="text-2xl font-mono text-center tracking-wider">
                  {getMorseCode(selectedSentences[currentIndex])}
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="decode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Answer:
                </label>
                <input
                  type="text"
                  id="decode"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your answer in UPPERCASE"
                  value={userInput}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </>
        )}

        {showSuccess && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                Congratulations!
              </h2>
              <p className="text-xl text-gray-700 mb-2">
                You've successfully decoded all three messages!
              </p>
              <p className="text-gray-600">Final Time: {formatTime(timer)}</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Your Secret Code:
              </h3>
              <p className="text-4xl font-mono font-bold tracking-wider text-blue-600">
                {secretCode}
              </p>
            </div>            
          <button
              onClick={nextRound}
              className="px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 mt-6"
            >
              Next Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MorseCode;
