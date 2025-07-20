import React from 'react';
import './App.css';
import DonationForm from './components/DonationForm';
import FeatureCard from './components/FeatureCard';
import logo from './Donate.png';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <img 
              src={logo} 
              alt="Shohay Logo" 
              className="logo-icon" 
            />
            <h1>Shohay</h1>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <h2>Transparent Giving, Transformative Impact</h2>
          <DonationForm />
        </section>

        <section className="features">
          <FeatureCard 
            icon="📊" 
            title="Track Donations" 
            description="Follow your contribution from donor to beneficiary"
          />
        </section>
      </main>
    </div>
  );
}

export default App;