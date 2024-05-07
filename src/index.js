

import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './Main';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Main.css';
import  MailApp  from './mailList/mailList';
import { LetterPage } from './letterPage/LetterPage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/mail" element={<MailApp />} />
    <Route path="/LetterPage" element={<LetterPage/>}/>
  </Routes>
  </BrowserRouter>
  
);