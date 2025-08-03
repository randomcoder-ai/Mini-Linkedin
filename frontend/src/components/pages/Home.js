import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PostForm from '../posts/PostForm';
import PostItem from '../posts/PostItem';
import api from '../../api';
import { FaSpinner } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts');
      setPosts(res.data);
      setError('');
    } catch (error) {
      setError('Failed to load posts');
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    // Add the new post to the beginning of the posts array
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <FaSpinner style={{ 
          fontSize: '2rem', 
          color: 'var(--primary-color)',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Loading posts...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          LinkedIn Community Feed
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Share your thoughts and connect with others
        </p>
      </div>

      {isAuthenticated && (
        <div style={{ marginBottom: '2rem' }}>
          <PostForm onPostCreated={handlePostCreated} />
        </div>
      )}

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

      {!isAuthenticated && (
        <div style={{
          backgroundColor: '#e3f2fd',
          color: 'var(--primary-color)',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #bbdefb',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            <strong>Sign in</strong> to create posts and interact with the community!
          </p>
        </div>
      )}

      <div>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              No posts yet. Be the first to share something!
            </p>
          </div>
        ) : (
          posts.map(post => (
            <PostItem
              key={post._id}
              post={post}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home; 