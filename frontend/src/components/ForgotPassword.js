import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post('/api/auth/forgot-password', { email });
          alert('Password reset email sent');
        } catch (err) {
          console.error(err);
          alert('Error sending reset email.');
        }
      };
    
      return (
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit">Send Reset Link</button>
        </form>
      );
    };
    
    export default ForgotPassword;
    