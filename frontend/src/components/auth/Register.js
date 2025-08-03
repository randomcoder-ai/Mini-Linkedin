import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, bio } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register({ name, email, password, bio });
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '2rem auto', 
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
          Join LinkedIn Community
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Create your account and start connecting
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: 'var(--error-color)',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <FaUser style={{ marginRight: '0.5rem' }} />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaEnvelope style={{ marginRight: '0.5rem' }} />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaLock style={{ marginRight: '0.5rem' }} />
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your password (min 6 characters)"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaLock style={{ marginRight: '0.5rem' }} />
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className="form-control"
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Bio (Optional)
          </label>
          <textarea
            name="bio"
            value={bio}
            onChange={handleChange}
            className="form-control"
            placeholder="Tell us about yourself..."
            rows="3"
            maxLength="500"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? (
            <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              <FaUserPlus style={{ marginRight: '0.5rem' }} />
              Create Account
            </>
          )}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

const FaSpinner = ({ style }) => (
  <span style={style}>⏳</span>
);

export default Register; 