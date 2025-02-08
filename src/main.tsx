import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Maze from './Maze';
import Flip from './Flip';
import Round3 from './Round3';
import MorseCode from './MorseCode';
import Vault from './Vault';
import Puzzle from './Puzzle';
import './index.css';
import Intro from './Intro';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== '/' && window.performance && window.performance.navigation.type === 1) {
      navigate('/');
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/Maze" element={<Maze />} />
      <Route path="/Flip" element={<Flip />} />
      <Route path="/Round3" element={<Round3 />} />
      <Route path='/MorseCode' element={<MorseCode />} />
      <Route path='/Vault' element={<Vault />} />
      <Route path='/Puzzle' element={<Puzzle />} />
    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);