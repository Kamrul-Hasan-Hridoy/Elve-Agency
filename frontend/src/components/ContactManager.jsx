import React, { useState, useEffect } from 'react';

const ContactManager = ({ setMessage, updateUnreadCount }) => { // Add updateUnreadCount prop
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/contact-messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        
        // Calculate unread count and update parent component
        const unread = data.filter(msg => !msg.read).length;
        updateUnreadCount(unread); // Update the unread count in Admin
      } else {
        setMessage({ text: 'Failed to fetch messages', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error fetching messages', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/contact-messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ read: true })
      });
      
      if (response.ok) {
        setMessage({ text: 'Message marked as read', type: 'success' });
        fetchMessages(); // Refresh the list (which will update unread count)
      } else {
        setMessage({ text: 'Failed to mark as read', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error marking as read', type: 'error' });
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/contact-messages/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setMessage({ text: 'Message deleted successfully', type: 'success' });
          fetchMessages(); // Refresh the list (which will update unread count)
        } else {
          setMessage({ text: 'Failed to delete message', type: 'error' });
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage({ text: 'Error deleting message', type: 'error' });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-content-section">
      <h2>Contact Messages</h2>
      
      <div className="messages-list">
        {messages.map(message => (
          <div key={message._id} className={`message-card ${message.read ? 'read' : 'unread'}`}>
            <div className="message-header">
              <h3>{message.full_name}</h3>
              <span className="message-date">
                {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
            <div className="message-contact">
              <p>Email: {message.email}</p>
              {message.phone && <p>Phone: {message.phone}</p>}
            </div>
            <div className="message-content">
              <p>{message.message}</p>
            </div>
            <div className="message-actions">
              {!message.read && (
                <button onClick={() => markAsRead(message._id)}>Mark as Read</button>
              )}
              <button onClick={() => deleteMessage(message._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <p>No messages yet.</p>
        )}
      </div>
    </div>
  );
};

export default ContactManager;