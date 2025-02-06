import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Maze from './Maze';
import Flip from './Flip';
import Round3 from './Round3';
import MorseCode from './MorseCode';
import Vault from './Vault';
import Puzzle from './Puzzle';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Maze />} />
        <Route path="/Flip" element={<Flip />} />
        <Route path="/Round3" element={<Round3 />} />
        <Route path='/MorseCode' element={<MorseCode />} />
        <Route path='/Vault' element={<Vault />} />
        <Route path='/Puzzle' element={<Puzzle />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);