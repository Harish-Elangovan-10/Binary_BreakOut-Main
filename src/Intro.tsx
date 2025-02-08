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
        <p>• You will need to finish 6 levels to finish the event.</p>
        <p>•	Each level gives a secret code that you need to note down.</p>
        <p>•	You will be given 35 minutes to complete the entire event.</p>
        <p>•	You cannot collaborate with other teams to complete the event.</p>
        <p>•	DO NOT REFRESH THE PAGE. REFRESHING THE PAGE WILL RESULT IN IMMEDIATE DISQUALIFICATION.</p>
        <p>•	Use of external tools such as Mobile Phones, Laptops are strictly prohibited.</p>
        <p>•	DO NOT NAVIGATE OUT OF THE BinaryBreakout page.</p>
        <p>•	Do cooperate with the moderators.</p>
        <p>•	The violation of the above rules will result in immediate disqualification.</p>
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
