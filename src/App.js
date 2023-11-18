import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Components/Home';
import Authenticate from './Components/Authenticate/Authenticate';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' element={<Authenticate />} />
          <Route path='/signup' element={<Authenticate signup />} />
          <Route path='/account' element={<h1>Account</h1>} />
          <Route path='/' element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
