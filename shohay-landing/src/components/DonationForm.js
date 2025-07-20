import React, { useState } from 'react';

function DonationForm() {
  const [amount, setAmount] = useState(50);

  return (
    <div className="donation-form">
      <h3>Make a Difference</h3>
      <input
        type="range"
        min="10"
        max="1000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div>${amount}</div>
      <button className="donate-btn">Donate Now</button>
    </div>
  );
}

export default DonationForm;