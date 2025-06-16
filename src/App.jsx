import React from 'react';
import RegisterForm from './components/RegisterForm';
import './Register.css';

function App() {
  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            {/* <img src={logoImg} alt="infinitysalon" /> */}
            {/* Replace above with your actual image import */}
          </div>
        </div>
      </header>
      <main className="main">
        <RegisterForm />
      </main>
      <footer className="footer">
        <div className="footer-container">
          <div className="nail">
            {/* <img src={nailsImg} alt="infinitysalon" id="nails" /> */}
            {/* Replace above with your actual image import */}
          </div>
          <div className="footer-links">
            <svg className="facebook-icon" fill="currentColor" viewBox="0 0 24 24">
              {/* Add your SVG path here if needed */}
            </svg>
            <a href="#" className="footer-link">Terms & Condition</a>
            <a href="#" className="footer-link">Policy Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;