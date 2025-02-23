import logo from './logo.svg';
import './App.css';
import React from 'react';
import Algorithm from './Algorithm';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to Mancii</h1>
      </header>
      <main>
        <Algorithm />
      </main>
    </div>
  );
}

export default App;

