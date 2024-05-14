// src/routes/config.js
import Main from '../pages/main/Main';
import MailAppInbox from '../pages/mailList/inboxList';
import MailAppOutbox from '../pages/mailList/outboxList';
import LetterPage from '../pages/letterPage/LetterPage';
import SendLetter from '../pages/sendLetter/SendLetter';
import Sending from '../pages/sendLetter/Sending';
import ReceivedLetter from '../pages/receivedLetter/receivedLetter';
import LoginPage from '../pages/auth/LoginPage';
import { Test3 } from '../pages/main/test3';

const routes = [
  { path: '/', component: Main, isPrivate: false },
  { path: '/inbox', component: MailAppInbox, isPrivate: true },
  { path: '/outbox', component: MailAppOutbox, isPrivate: true },
  { path: '/LetterPage', component: LetterPage, isPrivate: true },
  { path: '/SendLetter', component: SendLetter, isPrivate: true },
  { path: '/Sending', component: Sending, isPrivate: true },
  { path: '/letter/:letterId', component: ReceivedLetter, isPrivate: true },
  { path: '/login', component: LoginPage, isPrivate: false },
  { path: '/test3', component: Test3, isPrivate: false }
];

export default routes;