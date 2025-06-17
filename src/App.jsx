import React from 'react';
import RegisterForm from './components/RegisterForm';
import './Register.css';
import logo from './assets/issalonlogo.jpg';
import infinityLogo from './assets/issalonnails.png';

function App() {
  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </div>
      </header>
      <main className="main">
        <RegisterForm />
      </main>
      <footer className="footer">
        <div className="footer-container">
          <div className="nail">
            <img src={infinityLogo} alt="infinitysalon" id="nails" />
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Terms & Condition</a>
            <a href="#" className="footer-link">Policy Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;