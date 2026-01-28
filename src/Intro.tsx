import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  Mail, 
  Search, 
  Hash, 
  Key, 
  Lock, 
  AlertTriangle,
  Ban, 
  XCircle, 
  CircleCheck,
  Zap
} from 'lucide-react';

function Intro() {
  const navigate = useNavigate();
  const startGame = useCallback(() => {
    navigate('/maze');
  }, [navigate]);

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

  const rounds = [
    {
      id: 1,
      title: "Round 1 – Maze",
      icon: <Gamepad2 className="w-8 h-8 text-blue-400" />,
      objective: "Reach the destination in the maze.",
      hints: [
        "Your arrow keys are corrupted, what you press isn’t the way you’ll move.",
        "Keep one wall on your side; follow it until reaching the trophy.",
        "Take one step, check the walls, then adjust using the rotated controls."
      ]
    },
    {
      id: 2,
      title: "Round 2 – Phishing Mail Detection",
      icon: <Mail className="w-8 h-8 text-orange-400" />,
      objective: "Identify the phishing email from the given emails.",
      hints: [
        "Check the sender email carefully (small spelling tricks are common).",
        "Look for urgent threats or fake rewards like \"Account will be blocked\" / \"You won\".",
        "Hover over links — the real URL often exposes the scam."
      ]
    },
    {
      id: 3,
      title: "Round 3 – Find the Phrase",
      icon: <Search className="w-8 h-8 text-purple-400" />,
      objective: "Download the folder and find the hidden secret code.",
      hints: [
        "Don't just open files — check file names, extensions, and hidden folders.",
        "Read before you click — decoy folders exist, and mistakes waste time.",
        "Not every folder wants to be found — look for the one that blends in."
      ]
    },
    {
      id: 4,
      title: "Round 4 – Morse Code",
      icon: <Hash className="w-8 h-8 text-yellow-400" />,
      objective: "Decode three Morse code messages using the provided reference.",
      hints: [
        "The cipher is corrupted — trust the reference, not what you already know.",
        "Decode slowly — one wrong symbol can change the whole message.",
        "If the output looks weird, try rechecking dashes vs dots for similar letters."
      ]
    },
    {
      id: 5,
      title: "Round 5 – Secret Code Entry",
      icon: <Key className="w-8 h-8 text-green-400" />,
      objective: "Enter all secret codes collected from the previous rounds.",
      hints: [
        "Order matters — write each round’s code down the moment you find it.",
        "No spaces. If it still fails, try different code orders (permutations).",
        "Stuck? After 20 wrong tries, the vault will reveal the first digit."
      ]
    },
    {
      id: 6,
      title: "Round 6 – Final Escape",
      icon: <Lock className="w-8 h-8 text-red-400" />,
      objective: "Derive the correct system password using given user details.",
      hints: [
        "Use the employee profile — the password is built from what you already see.",
        "Use terminal basics: ls to list, cd to move, cat to read.",
        "Case matters — one wrong letter style locks you out."
      ]
    }
  ];

  return (
    <div className="min-h-screen main-bg bg-cyber-grid text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 animate-fade-in1">
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <img src="/revilogo.png" alt="Revil" className="relative w-24 h-24 drop-shadow-2xl" />
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent tracking-tighter">
            Escape Room
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full mb-6"></div>
          <p className="text-xl text-white/60 max-w-2xl text-center leading-relaxed">
            Unravel mysteries, solve complex puzzles, and showcase your technical prowess in the ultimate race against time.
          </p>
        </div>

        {/* Rounds Grid */}
        <div className="w-full mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">The Challenges</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rounds.map((round) => (
              <div key={round.id} className="glass-card p-8 rounded-3xl group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                    {round.icon}
                  </div>
                  <span className="text-5xl font-black text-white/10 group-hover:text-white/20 transition-colors select-none">
                    0{round.id}
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors">{round.title}</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-emerald-400 text-sm font-bold uppercase tracking-tighter">Objective</span>
                    <p className="text-white/70 text-sm leading-relaxed mt-1">{round.objective}</p>
                  </div>
                  {round.hints && (
                    <div>
                      <span className="text-yellow-400 text-sm font-bold uppercase tracking-tighter">Hints</span>
                      <ul className="text-white/70 text-sm leading-relaxed mt-1 space-y-1">
                        {round.hints.map((hint, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-400 text-xs mt-1">•</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules & Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mb-16">
          <div className="glass-card p-8 rounded-3xl border-l-4 border-l-red-500">
            <div className="flex items-center gap-4 mb-6 text-red-500">
              <Ban className="w-8 h-8" />
              <h3 className="text-2xl font-bold uppercase tracking-wide">Strict Rules</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/75 group-hover:text-white transition-colors">Refreshing or navigating away leads to <strong>immediate disqualification</strong>.</span>
              </li>
              <li className="flex items-start gap-3 group">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/75 group-hover:text-white transition-colors">No external tools (mobile phones, AI tools, calculators) allowed.</span>
              </li>
              <li className="flex items-start gap-3 group">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/75 group-hover:text-white transition-colors">Only one laptop per team is allowed. No collaboration between teams.</span>
              </li>
            </ul>
          </div>

          <div className="glass-card p-8 rounded-3xl border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-4 mb-6 text-emerald-500">
              <CircleCheck className="w-8 h-8" />
              <h3 className="text-2xl font-bold uppercase tracking-wide">Pro-Tips</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <AlertTriangle className="w-5 h-5 text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/75 group-hover:text-white transition-colors">The event is time-based. Penalties or bonuses affect your total time.</span>
              </li>
              <li className="flex items-start gap-3 group">
                <AlertTriangle className="w-5 h-5 text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/75 group-hover:text-white transition-colors">Cooperate with the moderators at all times.</span>
              </li>
              <li className="flex items-start gap-3 group">
                <AlertTriangle className="w-5 h-5 text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/75 group-hover:text-white transition-colors">Speed is important, but accuracy avoids time penalties.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Start Button */}
        <div className="relative group mt-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-400 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <button
            onClick={startGame}
            className="relative neon-button w-64 h-16 bg-gradient-to-br from-emerald-500 to-green-700 text-white text-xl font-bold rounded-xl shadow-2xl flex items-center justify-center gap-3"
          >
            INITIALIZE MISSION <Zap className="w-5 h-5 fill-current" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default Intro;