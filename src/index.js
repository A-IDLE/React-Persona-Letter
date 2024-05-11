
// // 원래 코드
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import Main from './pages/main/Main';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './pages/main/Main.css';
// import  MailAppInbox  from './pages/mailList/inboxList';
// import  MailAppOutbox  from './pages/mailList/outboxList';
// import { LetterPage } from './pages/letterPage/LetterPage';
// import SendLetter from './pages/sendLetter/SendLetter';
// import Sending from './pages/sendLetter/Sending';
// import ReceivedLetter from './pages/receivedLetter/receivedLetter';
// import LoginPage from './pages/auth/LoginPage';




// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <BrowserRouter>
//   <Routes>
//     <Route path="/" element={<Main />} />
//     <Route path="/mailIn" element={<MailAppInbox />} />
//     <Route path="/mailOut" element={<MailAppOutbox />} />
//     <Route path="/LetterPage" element={<LetterPage/>}/>
//     <Route path="/SendLetter" element={<SendLetter/>}/>
//     <Route path='/Sending' element={<Sending/>}/>
//     <Route path="/receivedLetter/:letterId" element={<ReceivedLetter />} />
//     <Route path="login" element={<LoginPage/>}/>
//   </Routes>
//   </BrowserRouter>
  
// );


// 로그인 관련 페이지로 이동하는 코드
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

import Main from './pages/main/Main';
import MailAppInbox from './pages/mailList/inboxList';
import MailAppOutbox from './pages/mailList/outboxList';
import LetterPage from './pages/letterPage/LetterPage';
import SendLetter from './pages/sendLetter/SendLetter';
import Sending from './pages/sendLetter/Sending';
import ReceivedLetter from './pages/receivedLetter/receivedLetter';
import LoginPage from './pages/auth/LoginPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PrivateRoute><Main /></PrivateRoute>} />
      <Route path="/mailIn" element={<PrivateRoute><MailAppInbox /></PrivateRoute>} />
      <Route path="/mailOut" element={<PrivateRoute><MailAppOutbox /></PrivateRoute>} />
      <Route path="/LetterPage" element={<PrivateRoute><LetterPage /></PrivateRoute>} />
      <Route path="/SendLetter" element={<PrivateRoute><SendLetter /></PrivateRoute>} />
      <Route path='/Sending' element={<PrivateRoute><Sending /></PrivateRoute>} />
      <Route path="/receivedLetter/:letterId" element={<PrivateRoute><ReceivedLetter /></PrivateRoute>} />
      <Route path="login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
);