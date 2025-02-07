import React, { useState, useEffect, useCallback } from 'react';
import { Download, Timer, Search, ArrowRight, Lock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function Round3() {
  const location = useLocation();
  const previousTime = location.state?.round2Time || 0;
  const [searchInput, setSearchInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [time, setTime] = useState(previousTime);
  const [isShaking, setIsShaking] = useState(false);

  const navigate = useNavigate();
  const nextRound = useCallback(() => {
    navigate('/MorseCode', { state: { round3Time: time } });
  }, [navigate, time]);

  useEffect(() => {
    document.title = 'Find the Phrase';
  });

  useEffect(() => {
    if (showSuccess) return;
  
    const timer = setInterval(() => {
      setTime((prevTime: number) => prevTime + 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [showSuccess]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${
      mins.toString().padStart(2, '0')}:${
      secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput === 'Why So Serious?') {
      setShowSuccess(true);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const downloadFolder = () => {
    // Using the base URL in case the app is hosted in a subdirectory
    const zipUrl = new URL('/round3.zip', window.location.origin).href;
    
    fetch(zipUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'round3.zip');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading the file:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Timer */}
      <div className="fixed w-32 h-14 top-4 left-4 flex items-center gap-2 bg-zinc-200/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50 shadow-lg">
        <Timer className="w-6 h-6 text-purple-400" />
        <span className="font-mono text-purple-100 text-2xl">{formatTime(time)}</span>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen relative z-10">
        {!showSuccess ? (
          <>
            <div className="mb-12 text-center">
              <div className="inline-block p-3 rounded-full bg-purple-500/10 mb-6">
                <Lock className="w-12 h-12 text-purple-400" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Enter the Code
              </h1>
              <h2 className="text-xl mt-6 font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Note: Download and Open the round3 folder and proceed...</h2>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className={`w-full bg-gray-800/50 border border-zinc-300 rounded-lg py-4 px-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-zinc-400 shadow-lg transition-all ${
                    isShaking ? 'animate-shake1' : ''
                  }`}
                  placeholder="Enter the secret code..."
                  style={{
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)',
                  }}
                />
              </div>
            </form>
            <button
              onClick={downloadFolder}
              className="mt-10 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-3 mx-auto hover:from-orange-400 hover:to-red-400 transition-all duration-1000 shadow-lg hover:shadow-yellow-500/20 ease-in"
            >
              Download Folder
              <Download className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center transform animate-fade-in1">
            <div className="mb-8 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-purple-500/20 mx-auto flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-500/40 flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-purple-400"></div>
                </div>
              </div>
              <h2 className="h-14 text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-emerald-700 bg-clip-text text-transparent">
                Congratulations!
              </h2>
              <p className="text-2xl mb-8 text-gray-300">
                Your key is: <span className="font-mono text-3xl text-yellow-400 bg-purple-500/10 px-4 py-2 rounded-lg ml-2">7</span>
              </p>
              <p className="text-2xl text-gray-400 mb-8">
                Time taken: <span className="font-mono text-purple-400">{formatTime(time)}</span>
              </p>
            </div>
            <button
              onClick={nextRound}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-3 mx-auto hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
            >
              Next Round
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Round3;