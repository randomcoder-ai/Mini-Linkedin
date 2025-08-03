import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaPaperPlane, FaUser } from 'react-icons/fa';

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    if (content.length > 1000) {
      setError('Post content cannot exceed 1000 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await axios.post('/api/posts', { content });
      onPostCreated(res.data);
      setContent('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          marginRight: '0.75rem'
        }}>
          <FaUser />
        </div>
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Share your thoughts...
          </div>
        </div>
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
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            placeholder="What's on your mind?"
            rows="3"
            maxLength="1000"
            style={{ resize: 'vertical' }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '0.5rem'
          }}>
            <span style={{ 
              fontSize: '0.875rem', 
              color: content.length > 900 ? 'var(--error-color)' : 'var(--text-secondary)' 
            }}>
              {content.length}/1000 characters
            </span>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !content.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {loading ? (
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <FaPaperPlane />
                  Post
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const FaSpinner = ({ style }) => (
  <span style={style}>⏳</span>
);

export default PostForm; 