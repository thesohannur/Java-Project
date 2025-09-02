import React from 'react';

const Landing = ({ onShowAuth }) => {
  return (
    <div>
      <h1>Welcome to Shohay</h1>
      <button onClick={onShowAuth}>Login / Register</button>
    </div>

  );
};

export default Landing;
