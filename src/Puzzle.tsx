import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, User, Lock, Info, TimerIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

interface TerminalLine {
  type: "command" | "output";
  content: string;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

const fileSystem: Record<string, any> = {
  "/home/emp_login": {
    files: ["employee_details.txt"],
    directories: ["projects", "logs", "secret"],
  },
  "/home/emp_login/projects": {
    files: ["archive.txt"],
    directories: [],
  },
  "/home/emp_login/logs": {
    files: ["access.log"],
    directories: [],
  },
  "/home/emp_login/secret": {
    files: ["final_code.txt"],
    directories: [],
  },
};

const fileContents: Record<string, string> = {
  "/home/emp_login/employee_details.txt": `Employee ID: EMP154
Name: Ramesh Kumar
Department: SALES
Year of Joining: 2021
Note: These details were shown on the employee details page.`,
  "/home/emp_login/projects/archive.txt": `Project Archive Log
No active projects found.`,
  "/home/emp_login/logs/access.log": `[2024-01-15 09:23:11] User emp_login connected
[2024-01-15 09:45:33] File access: employee_details.txt
[2024-01-15 10:12:45] Directory changed: /secret`,
  "/home/emp_login/secret/final_code.txt": `ESCAPE-ROOM-42X9
==================================================
Final code found. Submit this code to escape the room.
==================================================`,
};

export default function Puzzle() {
  const location = useLocation();
  const previousTime = location.state?.round5Time || 0;

  // ✅ Timer state INSIDE component
  const [time, setTime] = useState<number>(previousTime);
  const [isActive, setIsActive] = useState(true);

  // Login + UI state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInitialized, setTerminalInitialized] = useState(false);
  const [loginStage, setLoginStage] = useState<"username" | "password" | "none">("username");
  const [tempUsername, setTempUsername] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  // Terminal state
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentDir, setCurrentDir] = useState("/home/emp_login");
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [finalCode, setFinalCode] = useState("");
  const [codeResult, setCodeResult] = useState<"success" | "error" | "">("");

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Carry-forward time if coming from round5
  useEffect(() => {
    if (previousTime > 0) setTime(previousTime);
  }, [previousTime]);

  // ✅ Timer effect - continues running as long as isActive is true
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Auto scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Disable right click / paste / refresh warning
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handlePaste = (e: ClipboardEvent) => e.preventDefault();
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("paste", handlePaste);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("paste", handlePaste);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleNextToTerminal = () => {
    setShowTerminal(true);
    
    // Only initialize terminal content if it's the first time or if code was successful
    if (!terminalInitialized) {
      setTerminalInitialized(true);
      
      if (codeResult === "success") {
        setIsLoggedIn(true);
        setLoginStage("none");
        setLines([
          { type: "output", content: "Connected to emp_login@escaperoom.local" },
          { type: "output", content: "Welcome to the Escape Room Terminal System" },
          { type: "output", content: 'Type "help" to see available commands.' },
          { type: "output", content: "" },
          { type: "output", content: "✓ Escape Successful! You have completed the challenge in " + formatTime(time) },
          { type: "output", content: "" },
        ]);
      } else {
        // Normal SSH login flow - only reset if not already logged in
        if (!isLoggedIn) {
          setIsLoggedIn(false);
          setLoginStage("username");
        }
        setIsActive(true);
        if (!isLoggedIn) {
          setLines([
            { type: "output", content: "SSH Connection Initiated" },
            { type: "output", content: "Connecting to emp_login@escaperoom.local..." },
            { type: "output", content: "" },
          ]);
        }
      }
    }
    
    // Focus input after a short delay
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleBackToDetails = () => {
    setShowTerminal(false);
    // Don't reset login state - preserve it so user stays logged in
    // setIsLoggedIn(false);  // Removed this line
    // setLoginStage("username");  // Removed this line
    // Only continue timer if code hasn't been successfully submitted
    if (codeResult !== "success") {
      setIsActive(true);
    }
  };

  const handleLogin = (input: string) => {
    if (loginStage === "username") {
      setTempUsername(input);
      setLoginStage("password");
      setLines((prev) => [
        ...prev,
        { type: "command", content: `username: ${input}` },
      ]);
      setInput("");
      return true;
    } else if (loginStage === "password") {
      if (input === "sales2021") {
        setLoginStage("none");
        setIsLoggedIn(true);
        setIsActive(true);
        setLines((prev) => [
          ...prev,
          { type: "command", content: "password:" },
          { type: "output", content: "Connected to emp_login@escaperoom.local" },
          { type: "output", content: "Welcome to the Escape Room Terminal System" },
          { type: "output", content: 'Type "help" to see available commands.' },
          { type: "output", content: "" },
        ]);
      } else {
        setLoginStage("username");
        setTempUsername("");
        setLines((prev) => [
          ...prev,
          { type: "command", content: "password:" },
          { type: "output", content: "Wrong password. Access denied." },
          { type: "output", content: "" },
          { type: "output", content: "SSH Connection Initiated" },
          { type: "output", content: "" },
        ]);
      }
      setInput("");
      return true;
    }
    return false;
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    
    // Handle login flow for both initial load and terminal access
    if (!isLoggedIn) {
      if (handleLogin(trimmedCmd)) {
        return;
      }
      // If login not handled, show verification message
      setLines((prev) => [...prev, { type: "output", content: "Please verify yourself first." }, { type: "output", content: "" }]);
      return;
    }

    const parts = trimmedCmd.split(" ");
    const command = parts[0];
    const args = parts.slice(1);

    setLines((prev) => [...prev, { type: "command", content: `${currentDir}$ ${trimmedCmd}` }]);

    if (!trimmedCmd) {
      setLines((prev) => [...prev, { type: "output", content: "" }]);
      return;
    }

    if (!["ls", "cd", "cat", "help", "submit"].includes(command)) {
      setLines((prev) => [
        ...prev,
        { type: "output", content: 'Command not found. Type "help".' },
        { type: "output", content: "" },
      ]);
      return;
    }

    switch (command) {
      case "ls":
        handleLs();
        break;
      case "cd":
        handleCd(args.join(" "));
        break;
      case "cat":
        handleCat(args.join(" "));
        break;
      case "help":
        handleShowCommands();
        break;
      case "submit":
        handleSubmitCode(args.join(" "));
        break;
    }
  };

  const handleSubmitCode = (code: string) => {
    if (!code) {
      setLines((prev) => [...prev, { type: "output", content: "Usage: submit <code>" }, { type: "output", content: "" }]);
      return;
    }

    if (code === "ESCAPE-ROOM-42X9") {
      setLines((prev) => [
        ...prev,
        { type: "output", content: "✓ Escape Successful! You have completed the challenge in " + formatTime(time) },
        { type: "output", content: "" },
      ]);
      setCodeResult("success");
      setIsActive(false);
    } else {
      setLines((prev) => [...prev, { type: "output", content: "✗ Incorrect code. Try again." }, { type: "output", content: "" }]);
      setCodeResult("error");
    }
  };

  const handleLs = () => {
    const dir = fileSystem[currentDir];
    if (!dir) return;

    const items = [...dir.files, ...dir.directories];
    const itemLines = items.map(item => ({ type: "output" as const, content: item }));
    setLines((prev) => [...prev, ...itemLines, { type: "output", content: "" }]);
  };

  const handleCd = (dir: string) => {
    if (!dir) {
      setLines((prev) => [...prev, { type: "output", content: "Usage: cd <directory>" }, { type: "output", content: "" }]);
      return;
    }

    let newPath: string;
    if (dir === "..") {
      const pathParts = currentDir.split("/");
      pathParts.pop();
      newPath = pathParts.join("/") || "/";
    } else if (dir.startsWith("/")) {
      newPath = dir;
    } else {
      newPath = `${currentDir}/${dir}`;
    }

    if (fileSystem[newPath]) {
      setCurrentDir(newPath);
      setLines((prev) => [...prev, { type: "output", content: `Directory changed to ${newPath}` }, { type: "output", content: "" }]);
    } else {
      setLines((prev) => [...prev, { type: "output", content: `cd: ${dir}: No such directory` }, { type: "output", content: "" }]);
    }
  };

  const handleCat = (filename: string) => {
    if (!filename) {
      setLines((prev) => [...prev, { type: "output", content: "Usage: cat <filename>" }, { type: "output", content: "" }]);
      return;
    }

    const filePath = `${currentDir}/${filename}`;
    const content = fileContents[filePath];

    if (content) {
      const contentLines = content.split("\n");
      setLines((prev) => [...prev, ...contentLines.map((line) => ({ type: "output" as const, content: line })), { type: "output", content: "" }]);
    } else {
      setLines((prev) => [...prev, { type: "output", content: `cat: ${filename}: No such file` }, { type: "output", content: "" }]);
    }
  };

  const handleShowCommands = () => {
    setLines((prev) => [
      ...prev,
      { type: "output", content: "Available commands:" },
      { type: "output", content: "- ls - list files/folders" },
      { type: "output", content: "- cd <directory> - change directory" },
      { type: "output", content: "- cat <filename> - print file contents" },
      { type: "output", content: "- help - display this help" },
      { type: "output", content: "" },
    ]);
  };

  const handleExit = () => {
    setLines((prev) => [...prev, { type: "output", content: "Session terminated." }, { type: "output", content: "" }]);
    setIsActive(false); // ✅ stop timer
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (newIndex === commandHistory.length - 1 && historyIndex === commandHistory.length - 1) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleFinalCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitCode(finalCode.trim());
  };

  const renderSuccessPopup = () => {
    if (codeResult !== "success") return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-none flex items-center justify-center z-50">
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-green-400 rounded-full opacity-0"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 80}%`,
                animation: `sparkle ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 1}s infinite`
              }}
            />
          ))}
        </div>

        <div className="relative animate-[bounce_1s_ease-in-out] max-w-2xl w-full mx-4">
          {/* Outer glow effect */}
          <div className="absolute -inset-6 bg-gradient-to-r from-green-400 via-emerald-500 to-green-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />
          
          {/* Main success card */}
          <div 
            className="relative bg-gradient-to-br from-green-900/95 via-emerald-900/95 to-green-800/95 border-4 border-green-400/90 text-green-50 px-12 py-10 rounded-3xl shadow-2xl backdrop-blur-md"
            style={{
              boxShadow: '0 0 60px rgba(34, 197, 94, 0.4), 0 20px 80px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(34, 197, 94, 0.15)'
            }}
          >
            {/* Trophy icon */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <svg className="w-20 h-20 text-green-300 animate-[spin_3s_ease-in-out_infinite]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-60" />
              </div>
            </div>

            {/* Success text */}
            <p className="text-lg font-bold uppercase tracking-widest text-green-300/90 text-center mb-3 animate-[pulse_2s_ease-in-out_infinite]">
              Escape Room Breached Successfully
            </p>
            <p className="text-5xl font-black text-center bg-gradient-to-r from-green-200 via-emerald-100 to-green-200 bg-clip-text text-transparent drop-shadow-2xl">
              Escape Successful: {formatTime(time)}
            </p>
            
            {/* Decorative lines */}
            <div className="flex justify-center gap-3 mt-6">
              <div className="h-1.5 w-16 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full animate-pulse" />
              <div className="h-1.5 w-16 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="h-1.5 w-16 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---------------- UI ----------------

  if (!showTerminal && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        {renderSuccessPopup()}
        {/* Timer Display */}
        <div className="fixed left-5 top-5 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-zinc-200">
          <TimerIcon size={22} />
          <span className="font-mono">{formatTime(time)}</span>
        </div>

        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-400 mb-2">Escape Room Terminal System</h1>
            <p className="text-gray-400">Technical Event - Final Round</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Employee Details - Expanded */}
            <div className="md:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full text-xl font-semibold text-white mb-4 flex items-center justify-between hover:text-green-400 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Employee Profile
                </span>
                <span className="text-sm">{showDetails ? "▼" : "▶"}</span>
              </button>

              {showDetails && (
                <div className="space-y-6">
                  {/* Employee Photo */}
                  <div className="flex justify-center">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh"
                      alt="Employee Photo"
                      className="w-32 h-32 rounded-lg border-2 border-green-400"
                    />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-gray-300">
                    <div className="border border-gray-700 rounded p-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Employee ID</span>
                      <p className="text-white text-lg font-mono">EMP154</p>
                    </div>
                    <div className="border border-gray-700 rounded p-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Status</span>
                      <p className="text-green-400 text-lg font-medium">Active</p>
                    </div>
                    <div className="border border-gray-700 rounded p-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Full Name</span>
                      <p className="text-white text-lg">Ramesh Kumar</p>
                    </div>
                    <div className="border border-gray-700 rounded p-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Email</span>
                      <p className="text-white text-lg">ramesh.kumar@corp.com</p>
                    </div>
                    <div className="border border-gray-700 rounded p-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Department</span>
                      <p className="text-white text-lg">SALES</p>
                    </div>
                    <div className="border border-gray-700 rounded p-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Year of Joining</span>
                      <p className="text-white text-lg">2021</p>
                    </div>
                    <div className="border border-gray-700 rounded p-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Designation</span>
                      <p className="text-white text-lg">Sales Executive</p>
                    </div>
                    <div className="border border-gray-700 rounded p-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase">Reporting To</span>
                      <p className="text-white text-lg">Priya Sharma</p>
                    </div>
                  </div>

                  {/* Hint */}
                  <div className="mt-4 text-sm bg-blue-900/20 border border-blue-800 rounded p-4">
                    <span className="text-blue-300 font-medium">💡 Hint:</span>
                    <p className="text-gray-300 mt-2">
                      SSH Password is derived from employee details. Think: Department + Year = Password
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal Login Info */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-fit">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-400" />
                Terminal Access
              </h2>
              <div className="space-y-4 text-gray-300 text-sm">
                <p>Review employee details and proceed to the terminal system.</p>
                <div className="bg-gray-900/50 border border-gray-700 rounded p-3 font-mono text-xs text-green-400">
                  emp_login@escaperoom.local
                </div>
                <div className="text-blue-300 text-xs bg-blue-900/20 border border-blue-800 rounded p-3">
                  Click "Proceed to Terminal" to access the command interface.
                </div>
                
                {/* Next Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleNextToTerminal}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Proceed to Terminal
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {renderSuccessPopup()}
      {/* Timer Display */}
      <div className="fixed left-5 top-5 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-zinc-200">
        <TimerIcon size={22} />
        <span className="font-mono">{formatTime(time)}</span>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-400 flex items-center gap-2">
            <TerminalIcon className="w-8 h-8" />
            Escape Room Terminal
          </h1>
          <button
            onClick={handleBackToDetails}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            ← Back to Details
          </button>
        </div>

        <div className="bg-black rounded-lg border border-gray-700 shadow-2xl mb-6" style={{ height: "50vh", minHeight: "400px", display: "flex", flexDirection: "column" }}>
          <div className="bg-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2 border-b border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-gray-400 text-sm ml-4">emp_login@escaperoom.local</span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto font-mono text-sm flex flex-col" onClick={() => inputRef.current?.focus()}>
            {lines.map((line, index) => (
              <div key={index} className={line.type === "command" ? "text-green-400" : "text-gray-300"}>
                {line.content}
              </div>
            ))}
            {codeResult !== "success" && (
              <div className="flex gap-2">
                <span className="text-green-400 flex-shrink-0">
                  {isLoggedIn ? `${currentDir}$` : 
                   loginStage === "username" ? "username:" : 
                   loginStage === "password" ? "password:" : "$"}
                </span>
                <form onSubmit={handleSubmit} className="flex-1">
                  <input
                    ref={inputRef}
                    type={loginStage === "password" ? "password" : "text"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none text-white font-mono w-full"
                    autoFocus
                  />
                </form>
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Enter Final Escape Code</h2>
          <form onSubmit={handleFinalCodeSubmit} className="flex gap-4">
            <input
              type="text"
              value={finalCode}
              onChange={(e) => setFinalCode(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 font-mono"
              placeholder="Enter the escape code..."
              autoComplete="off"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition-colors">
              Submit
            </button>
          </form>

          {codeResult === "success" && (
            <div className="mt-4 bg-green-900/20 border border-green-800 rounded p-4 text-green-300">
              Escape Successful! You have completed the challenge in <b>{formatTime(time)}</b>.
            </div>
          )}

          {codeResult === "error" && (
            <div className="mt-4 bg-red-900/20 border border-red-800 rounded p-4 text-red-300">
              Incorrect code. Try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
