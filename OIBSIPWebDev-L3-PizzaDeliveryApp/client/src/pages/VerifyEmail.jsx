import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
      <Link to="/login"><button>Go to Login</button></Link>
    </div>
  );
};

export default VerifyEmail;
