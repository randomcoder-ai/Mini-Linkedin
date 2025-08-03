import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PostItem from '../posts/PostItem';
import axios from 'axios';
import { FaUser, FaEdit, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchUserPosts();
    }
  }, [user?._id, user?.id]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const userId = user?._id || user?.id;
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      
      const res = await axios.get(`/api/users/${userId}/posts`);
      setPosts(res.data);
    } catch (error) {
      console.error('Fetch user posts error:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setFormData({
      name: user.name,
      bio: user.bio || ''
    });
    setEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setUpdateLoading(true);
      const result = await updateProfile(formData);
      
      if (result.success) {
        setEditing(false);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setUpdateLoading(false);
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

  // Function to refresh posts (can be called from parent components)
  const refreshPosts = () => {
    fetchUserPosts();
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <FaSpinner style={{ 
          fontSize: '2rem', 
          color: 'var(--primary-color)',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Loading user data...
        </p>
      </div>
    );
  }

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

  return (
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
            {editing ? (
              <form onSubmit={handleSubmit}>
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
                
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    maxLength="500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateLoading}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {updateLoading ? (
                      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <>
                        <FaSave />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {user.name}
                </h1>
                {user.bio && (
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {user.bio}
                  </p>
                )}
                <button
                  onClick={handleEdit}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <FaEdit />
                  Edit Profile
                </button>
              </div>
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
              {user.email}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Email
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
          My Posts ({posts.length})
        </h2>

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

        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              You haven't posted anything yet. Start sharing your thoughts!
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

export default Profile; 