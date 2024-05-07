

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MailApp from './mailList/mailList';
import LetterPage from './letterPage/LetterPage.js';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/mail" element={<MailApp />} />
    <Route path="/LetterPage" element={<LetterPage/>}/>
  </Routes>
  </BrowserRouter>
  
);

