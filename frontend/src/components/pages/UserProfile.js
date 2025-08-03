import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PostItem from '../posts/PostItem';
import Notification from '../layout/Notification';
import axios from 'axios';
import { FaUser, FaSpinner, FaUserPlus, FaUserCheck, FaUsers } from 'react-icons/fa';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && user && currentUser) {
      const currentUserId = currentUser._id || currentUser.id;
      const profileUserId = user._id || user.id;
      
      if (currentUserId !== profileUserId) {
        checkConnectionStatus();
      }
    }
  }, [user, isAuthenticated, currentUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userRes, postsRes] = await Promise.all([
        axios.get(`/api/users/${id}`),
        axios.get(`/api/users/${id}/posts`)
      ]);
      
      setUser(userRes.data);
      setPosts(postsRes.data);
      setError('');
    } catch (error) {
      console.error('Fetch user data error:', error);
      setError('User not found');
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const res = await axios.get(`/api/users/${id}/connection-status`);
      setIsConnected(res.data.isConnected);
    } catch (error) {
      console.error('Connection status error:', error);
    }
  };

  const handleConnect = async () => {
    if (!isAuthenticated) return;

    try {
      setConnectionLoading(true);
      const res = await axios.put(`/api/users/${id}/connect`);
      setIsConnected(res.data.isConnected);
      
      // Show success notification
      const message = res.data.isConnected ? 'Connected successfully!' : 'Disconnected successfully!';
      setNotification({
        visible: true,
        message,
        type: 'success'
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ visible: false, message: '', type: 'success' });
      }, 3000);
    } catch (error) {
      console.error('Connection error:', error);
      setNotification({
        visible: true,
        message: error.response?.data?.message || 'Failed to connect',
        type: 'error'
      });

      // Auto-hide error notification after 5 seconds
      setTimeout(() => {
        setNotification({ visible: false, message: '', type: 'error' });
      }, 5000);
    } finally {
      setConnectionLoading(false);
    }
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
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          backgroundColor: '#ffebee',
          color: 'var(--error-color)',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      </div>
    );
  }

  const currentUserId = currentUser?._id || currentUser?.id;
  const profileUserId = user?._id || user?.id;
  const isOwnProfile = currentUserId === profileUserId;

  return (
    <>
      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ visible: false, message: '', type: 'success' })}
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
        {/* Profile Header */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              marginRight: '1rem'
            }}>
              <FaUser />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {user.name}
              </h1>
              {user.bio && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {user.bio}
                </p>
              )}
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
              
              {/* Connection Button */}
              {isAuthenticated && !isOwnProfile && (
                <button
                  onClick={handleConnect}
                  disabled={connectionLoading}
                  className={`btn ${isConnected ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginTop: '0.5rem'
                  }}
                >
                  {connectionLoading ? (
                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  ) : isConnected ? (
                    <>
                      <FaUserCheck />
                      Connected
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      Connect
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '2rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {posts.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Posts
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {user.connections?.length || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Connections
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {user.followers?.length || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Followers
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {user.email}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Email
              </div>
            </div>
          </div>

          {/* Connections List */}
          {user.connections && user.connections.length > 0 && (
            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: '1rem',
              marginTop: '1rem'
            }}>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaUsers />
                Connections ({user.connections.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user.connections.map(connection => (
                  <span
                    key={connection._id}
                    style={{
                      backgroundColor: 'var(--background-color)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {connection.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User's Posts */}
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {user.name}'s Posts ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                {user.name} hasn't posted anything yet.
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
    </>
  );
};

export default UserProfile; 