import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending registration data:', { email, password });
      await axiosInstance.post('/api/auth/register', { email, password });
      alert('Check your email for OTP');
      setShowOtp(true);
    } catch (err) {
      console.error('Error registering:', err.response ? err.response.data.msg : err.message);
      alert('Error registering: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      console.log('Verifying OTP:', { email, otp });
      await axiosInstance.post('/api/auth/verify-otp', { email, otp });
      alert('Email verified successfully');
      setShowOtp(false);
      setEmail('');
      setPassword('');
      setOtp('');
    } catch (err) {
      console.error('Invalid OTP:', err.response ? err.response.data.msg : err.message);
      alert('Invalid OTP: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <form onSubmit={showOtp ? handleVerifyOtp : handleRegister}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {!showOtp && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      )}
      {showOtp && (
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      )}
      <button type="submit">{showOtp ? 'Verify OTP' : 'Register'}</button>
    </form>
  );
};

export default Register;
