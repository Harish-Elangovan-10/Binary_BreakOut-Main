import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Intro() {

  const navigate = useNavigate();
  const startGame = useCallback(() => {
    navigate('/Maze');
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center main-bg px-40 py-10">
      <div className='flex flex-row justify-center gap-5'>
        <img src="/revilogo.png" alt="Revil" className="w-14 h-14 mx-auto" />
        <h2 className="h-14 text-5xl font-bold mb-10 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-400 bg-clip-text text-transparent">Binary Breakout</h2>
      </div>
      <div className="p-6 mb-10 w-full text-lg rounded-lg bg-white/10 text-lime-400">
        <h1 className="font-bold text-4xl mb-2 bg-gradient-to-br from-purple-800 via-purple-500 to-purple-300 bg-clip-text text-transparent">Rules</h1>
        <div>
          <h3 className="font-bold text-xl bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">1st Round: Maze</h3>
          <p className='text-white/75'><strong>Objective:</strong> Reach the destination within the maze.</p>
          <p className='text-white/75'><strong>Challenge:</strong> Your keyboard is faulty, so the keys may not work as expected.</p>
          <p className='bg-gradient-to-r from-lime-600 via-lime-400 to-lime-300 bg-clip-text text-transparent'><strong>Tips:</strong> Be strategic in your movements, and find alternate routes if certain keys aren't functioning as expected.</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-xl bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">2nd Round: Flip the Card</h3>
          <p className='text-white/75'><strong>Objective:</strong> Find the correct card among five types of cards.</p>
          <ul className="list-disc ml-5 text-white/75">
            <li>There are five types of cards.</li>
            <li><strong>Penalty Card:</strong> 5 seconds will be added to your time.</li>
            <li><strong>Bonus Card:</strong> 5 seconds will be subtracted to your time.</li>
            <li><strong>Shuffle Card:</strong> Cards will be shuffled.</li>
            <li><strong>Message Card:</strong> A message will be displayed.</li>
            <li><strong>Correct Card:</strong> Only one card is correct.</li>
          </ul>
          <p className='bg-gradient-to-r from-lime-600 via-lime-400 to-lime-300 bg-clip-text text-transparent'><strong>Tips:</strong> Pay attention to the card and plan your flips wisely.</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-xl bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">3rd Round: Find the Phrase</h3>
          <p className='text-white/75'><strong>Objective:</strong> Find the secret code hidden within a folder.</p>
          <ul className="list-disc ml-5 text-white/75">
            <li>Download the folder provided.</li>
            <li>Search through the contents to locate the secret code.</li>
            <li>Enter the secret code to complete the round.</li>
          </ul>
          <p className='bg-gradient-to-r from-lime-600 via-lime-400 to-lime-300 bg-clip-text text-transparent'><strong>Tips:</strong> Look for patterns or hints in the file names and contents.</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-xl bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">4th Round: Morse Code</h3>
          <p className='text-white/75'><strong>Objective:</strong> Decode three Morse code messages.</p>
          <ul className="list-disc ml-5 text-white/75">
            <li>Each message is in Morse code format.</li>
            <li>Use a Morse code reference to decode the messages.</li>
            <li>Enter the decoded messages to complete the round.</li>
          </ul>
          <p className='bg-gradient-to-r from-lime-600 via-lime-400 to-lime-300 bg-clip-text text-transparent'><strong>Tips:</strong> Use reference for quick decoding.</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-xl bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">5th Round: Secret Code Entry</h3>
          <p className='text-white/75'><strong>Objective:</strong> Use the secret codes obtained from the previous four rounds.</p>
          <ul className="list-disc ml-5 text-white/75">
            <li>Enter all the secret codes you've collected in the previous rounds.</li>
            <li>Ensure the codes are entered correctly to proceed to the next round.</li>
          </ul>
          <p className='bg-gradient-to-r from-lime-600 via-lime-400 to-lime-300 bg-clip-text text-transparent'><strong>Tips:</strong> Try all possible combinations.</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-xl bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">6th and Final Round: Sliding Puzzle</h3>
          <p className='text-white/75'><strong>Objective:</strong> Solve the sliding image puzzle.</p>
          <p className='text-white/75'><strong>Challenge:</strong> Reassemble the image to its original form.</p>
          <p className='bg-gradient-to-r from-lime-600 via-lime-400 to-lime-300 bg-clip-text text-transparent'><strong>Tips:</strong> Be patient and plan your moves to avoid unnecessary shuffles.</p>
        </div>

        <h1 className="font-bold text-4xl mb-2 mt-6 bg-gradient-to-br from-purple-800 via-purple-500 to-purple-300 bg-clip-text text-transparent">DO's & DONT's</h1>
        <div className="mt-4">
          <ul className="list-disc ml-5 text-red-500">
            <li>Do not collaborate with other teams to complete the event.</li>
            <li>Do not refresh the page. Refreshing the page will result in immediate disqualification.</li>
            <li>Do not use external tools such as Mobile Phones, Laptops and Calculators.</li>
            <li>Do cooperate with the moderators.</li>
            <li>Do not navigate out of the page.</li>
          </ul>
        </div>

        <p className="mt-4 bg-gradient-to-br from-lime-600 via-lime-400 to-lime-300 bg-clip-text text-transparent"><strong>Final Note:</strong> Completing each round successfully will provide you with the necessary clues and codes to advance through the Binary Breakout event. Good luck and enjoy the challenge!</p>
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
