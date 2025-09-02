import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const result = await loginNGO(email, password);
if (result.success) {
  navigate('/ngo/dashboard'); // After successful login
}


const Login = ({ onSwitchToRegister, selectedRole }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setMessage('Login successful! Redirecting...');
    } else {
      setMessage(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Login {selectedRole && `as ${selectedRole}`}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <p>
        Don't have an account?{' '}
        <span className="auth-link" onClick={onSwitchToRegister}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
