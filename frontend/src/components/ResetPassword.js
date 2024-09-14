import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      alert('Password reset successful');
    } catch (err) {
      console.error(err);
      alert('Error resetting password.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="password" 
        placeholder="Enter new password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
