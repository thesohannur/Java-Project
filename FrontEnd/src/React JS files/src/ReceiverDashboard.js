import React, { useState } from 'react';
import './App.css';


function ReceiverDashboard() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    contact: '',
    category: '',
    description: '',
    agree: false,
    file: null,
  });

  const [help, setHelp] = useState({
    email: '',
    problem: '',
  });

  const [requests] = useState([
    {
      title: 'I need for college fees',
      category: 'Scholarship',
      status: 'Pending',
      date: '7/30/2025',
      contact: '22004864',
    },
    {
      title: 'Blood transfusion for surgery',
      category: 'Blood',
      status: 'Accepted',
      date: '6/22/2025',
      contact: '22004865',
    },
    {
      title: 'Financial help',
      category: 'Money',
      status: 'Rejected',
      date: '5/12/2025',
      contact: '22004866',
    },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const handleHelpChange = (e) => {
    const { name, value } = e.target;
    setHelp({ ...help, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.category === 'Scholarship' && !form.file) {
      alert('Please upload required documents for scholarship.');
      return;
    }
    if (!form.agree) {
      alert('You must agree to the terms and conditions.');
      return;
    }
    alert('Donation request submitted successfully.');
  };

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    alert(`Help request submitted.\nEmail: ${help.email}\nProblem: ${help.problem}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'lightgreen';
      case 'Pending': return 'khaki';
      case 'Rejected': return 'lightcoral';
      default: return 'white';
    }
  };

  return (
    <div className="App" style={{ position: 'relative', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      {/* ✅ TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          
          <h1 style={{ color: '#fcba03', margin: 0 }}>Shohay | Receiver Dashboard</h1>
        </div>
        <div>
          <button
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            style={{ marginRight: '10px' }}
          >
            Contact
          </button>
          <button
            onClick={() => document.getElementById('help').scrollIntoView({ behavior: 'smooth' })}
          >
            Help
          </button>
        </div>
      </div>

      {/* ✅ DONATION FORM */}
      <form onSubmit={handleSubmit}>
        <h2>Submit Donation Request</h2>

        <label>Full Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} required />

        <label>Contact Number</label>
        <input type="tel" name="contact" value={form.contact} onChange={handleChange} required />

        <label>Donation Category</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select a category</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Blood">Blood</option>
          <option value="Goods">Goods</option>
          <option value="Money">Money</option>
        </select>

        <label>Description of Need</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        {form.category === 'Scholarship' && (
          <>
            <label>Upload Supporting Documents (PDF, JPG, PNG)</label>
            <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} />
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            style={{ marginRight: '10px' }}
          />
          <label style={{ margin: 0 }}>I agree to the terms and conditions</label>
        </div>

        <button type="submit">Submit Request</button>
      </form>

      {/* ✅ PREVIOUS REQUESTS */}
      <div style={{ marginTop: '100px' }}>
        <h2>My Previous Requests</h2>
        {requests.map((req, idx) => (
          <div className="card" key={idx}>
            <strong>{req.title}</strong>
            <p>Category: {req.category}</p>
            <p>Submitted on: {req.date}</p>
            <p>Contact: {req.contact}</p>
            <p style={{ color: getStatusColor(req.status) }}>Status: {req.status}</p>
          </div>
        ))}
      </div>

      {/* ✅ CONTACT SECTION */}
      <div id="contact" style={{ marginTop: '100px' }}>
        <h2>📞 Contact Us</h2>
        <p>Phone: +880 1700 000 000</p>
        <p>Address: Islamic University of Technology (IUT), Gazipur, Bangladesh</p>
      </div>

      {/* ✅ HELP SECTION */}
      <div id="help" style={{ marginTop: '80px' }}>
        <h2>🛠️ Help / Report a Problem</h2>
        <form onSubmit={handleHelpSubmit}>
          <label>Your Email</label>
          <input
            type="email"
            name="email"
            value={help.email}
            onChange={handleHelpChange}
            required
          />
          <label>Describe Your Issue</label>
          <textarea
            name="problem"
            value={help.problem}
            onChange={handleHelpChange}
            required
            rows="4"
          />
          <button type="submit">Submit Issue</button>
        </form>
      </div>

    </div>
  );
}

export default ReceiverDashboard;
