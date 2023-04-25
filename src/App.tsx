import React from 'react';
import logo from './logo.svg';
import './App.css';
import Layouts from './Layout';
import { Routes, Route } from 'react-router-dom';
import Login from './Page/Login';
import Slider from './Page/Slider';

function App() {
  return (
    <>
  <Routes>
  <Route path="/login" element={  <Login/>} />
  <Route path="/*" element={  <Layouts/>} />
</Routes>
 
    </>

  );
}

export default App;
