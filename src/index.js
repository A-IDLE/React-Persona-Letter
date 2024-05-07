import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './Main';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Main.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Main />} />
  </Routes>
  </BrowserRouter>
  
);