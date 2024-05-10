import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './pages/main/Main';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  MailApp  from './pages/mailList/mailList';
import { LetterPage } from './pages/letterPage/LetterPage';
import SendLetter from './pages/sendLetter/SendLetter';
import ReceivedLetter from './pages/receivedLetter/receivedLetter';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/mail" element={<MailApp />} />
    <Route path="/LetterPage" element={<LetterPage/>}/>
    <Route path="/SendLetter" element={<SendLetter/>}/>
    <Route path='/Sending' element={<Sending/>}/>
    <Route path="/receivedLetter/:letterId" element={<ReceivedLetter />} />
  </Routes>
  </BrowserRouter>
  
);


