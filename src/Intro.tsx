import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Intro () {

  const navigate = useNavigate();
  const startGame = useCallback(() => {
    navigate('/Maze');
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen main-bg px-40">
      <h2 className="text-5xl font-bold mb-10 text-zinc-200">Instructions</h2>
      <div className="p-6 mb-10 w-full text-lg rounded-lg bg-white/10 text-lime-400">
        <p>Please follow the instructions carefully to proceed.</p>
      </div>
      <button
        className="w-32 h-12 px-4 py-2 text-xl text-white bg-gradient-to-br from-green-500 to-emerald-800 rounded hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-800 ease-in"
        onClick={startGame}
      >
        Start
      </button>
    </div>
  );
};

export default Intro;
