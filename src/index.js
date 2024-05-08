import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './pages/main/Main';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './pages/main/Main.css';
import  MailApp  from './pages/mailList/mailList';
import { LetterPage } from './pages/letterPage/LetterPage';
import SendLetter from './pages/sendLetter/SendLetter';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/mail" element={<MailApp />} />
    <Route path="/LetterPage" element={<LetterPage/>}/>
    <Route path="/SendLetter" element={<SendLetter/>}/>
  </Routes>
  </BrowserRouter>
  
);


