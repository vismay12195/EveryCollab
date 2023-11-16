import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' element={<h1>Login</h1>} />
          <Route path='/signup' element={<h1>Sign Up</h1>} />
          <Route path='/account' element={<h1>Account</h1>} />
          <Route path='/' element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
