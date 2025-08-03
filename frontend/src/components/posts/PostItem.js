import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FaUser, 
  FaHeart, 
  FaRegHeart, 
  FaComment, 
  FaTrash, 
  FaClock,
  FaEllipsisH,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';

const PostItem = ({ post, onPostDeleted, onPostUpdated }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const userId = user?._id || user?.id;
  const isLiked = post.likes?.some(like => {
    const likeId = like._id || like;
    return likeId === userId;
  });
  const isAuthor = (post.author._id || post.author) === userId;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleLike = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const res = await axios.put(`/api/posts/${post._id}/like`);
      onPostUpdated(res.data);
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      setCommentLoading(true);
      const res = await axios.post(`/api/posts/${post._id}/comments`, {
        text: commentText
      });
      onPostUpdated(res.data);
      setCommentText('');
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthor) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        setDeleteLoading(true);
        await axios.delete(`/api/posts/${post._id}`);
        onPostDeleted(post._id);
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete post. Please try again.');
      } finally {
        setDeleteLoading(false);
        setShowOptions(false);
      }
    } else {
      setShowOptions(false);
    }
  };

  return (
    <div className="card">
      {/* Post Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <Link 
              to={`/user/${post.author._id || post.author}`}
              style={{ 
                textDecoration: 'none', 
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {post.author.name}
            </Link>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary)',
              gap: '0.5rem'
            }}>
              <FaClock />
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>

        {isAuthor && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="btn"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-secondary)',
                padding: '0.25rem'
              }}
            >
              <FaEllipsisH />
            </button>
            
            {showOptions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 1001,
                minWidth: '150px'
              }}>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  disabled={deleteLoading}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {deleteLoading ? (
                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <>
                      <FaExclamationTriangle />
                      Delete Post
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ 
          lineHeight: '1.6', 
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap'
        }}>
          {post.content}
        </p>
      </div>

      {/* Post Actions */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1rem'
      }}>
        <button
          onClick={handleLike}
          disabled={loading || !user}
          className="btn"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: isLiked ? 'var(--error-color)' : 'var(--text-secondary)',
            cursor: user ? 'pointer' : 'default'
          }}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          {post.likes?.length || 0}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="btn"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)'
          }}
        >
          <FaComment />
          {post.comments?.length || 0}
        </button>

        {/* Delete Button for Author */}
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="btn btn-danger"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginLeft: 'auto',
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem'
            }}
          >
            {deleteLoading ? (
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <FaTrash />
                Delete
              </>
            )}
          </button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          {/* Add Comment */}
          {user && (
            <form onSubmit={handleComment} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="form-control"
                  placeholder="Write a comment..."
                  maxLength="500"
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={commentLoading || !commentText.trim()}
                >
                  {commentLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div>
            {post.comments?.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} style={{ 
                  padding: '0.75rem', 
                  backgroundColor: 'var(--background-color)', 
                  borderRadius: '4px',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <Link 
                      to={`/user/${comment.user._id || comment.user}`}
                      style={{ 
                        textDecoration: 'none', 
                        color: 'var(--primary-color)',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}
                    >
                      {comment.user.name}
                    </Link>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)',
                      marginLeft: '0.5rem'
                    }}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem; 