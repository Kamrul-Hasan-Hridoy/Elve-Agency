import React, { useState, useEffect } from 'react';
import './ContactManager.css';

const ContactManager = ({ setMessage, updateUnreadCount }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

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
        updateUnreadCount(unread);
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
        fetchMessages();
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
          fetchMessages();
          setSelectedMessage(null);
        } else {
          setMessage({ text: 'Failed to delete message', type: 'error' });
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage({ text: 'Error deleting message', type: 'error' });
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/contact-messages/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setMessage({ text: 'All messages marked as read', type: 'success' });
        fetchMessages();
      } else {
        setMessage({ text: 'Failed to mark all as read', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error marking all as read', type: 'error' });
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading messages...</div>;
  }

  const unreadMessages = messages.filter(msg => !msg.read);
  const readMessages = messages.filter(msg => msg.read);

  return (
    <div className="contact-manager">
      <div className="contact-header">
        <h2 className="section-title">Contact Messages</h2>
        <div className="header-actions">
          <span className="message-count">{messages.length} messages</span>
          {unreadMessages.length > 0 && (
            <button onClick={markAllAsRead} className="btn btn-outline">
              Mark All as Read
            </button>
          )}
        </div>
      </div>
      
      <div className="messages-container">
        <div className="messages-list">
          {unreadMessages.length > 0 && (
            <div className="message-section">
              <h3 className="message-section-title">Unread Messages ({unreadMessages.length})</h3>
              {unreadMessages.map(message => (
                <MessageItem 
                  key={message._id} 
                  message={message} 
                  isSelected={selectedMessage && selectedMessage._id === message._id}
                  onSelect={setSelectedMessage}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteMessage}
                />
              ))}
            </div>
          )}
          
          {readMessages.length > 0 && (
            <div className="message-section">
              <h3 className="message-section-title">Read Messages ({readMessages.length})</h3>
              {readMessages.map(message => (
                <MessageItem 
                  key={message._id} 
                  message={message} 
                  isSelected={selectedMessage && selectedMessage._id === message._id}
                  onSelect={setSelectedMessage}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteMessage}
                />
              ))}
            </div>
          )}
          
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>No messages yet</h4>
              <p>Customer messages will appear here</p>
            </div>
          )}
        </div>
        
        <div className="message-detail">
          {selectedMessage ? (
            <MessageDetail 
              message={selectedMessage} 
              onMarkAsRead={markAsRead}
              onDelete={deleteMessage}
            />
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">👆</div>
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MessageItem = ({ message, isSelected, onSelect, onMarkAsRead, onDelete }) => {
  return (
    <div 
      className={`message-item ${isSelected ? 'selected' : ''} ${message.read ? 'read' : 'unread'}`}
      onClick={() => onSelect(message)}
    >
      <div className="message-item-header">
        <h4 className="message-sender">{message.full_name}</h4>
        <span className="message-date">
          {new Date(message.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="message-preview">
        {message.message.length > 100 
          ? `${message.message.substring(0, 100)}...` 
          : message.message
        }
      </p>
      <div className="message-meta">
        <span className="message-email">{message.email}</span>
        {message.phone && <span className="message-phone">• {message.phone}</span>}
      </div>
    </div>
  );
};

const MessageDetail = ({ message, onMarkAsRead, onDelete }) => {
  return (
    <div className="message-detail-card">
      <div className="message-detail-header">
        <div className="sender-info">
          <h3>{message.full_name}</h3>
          <div className="contact-details">
            <p className="contact-email">{message.email}</p>
            {message.phone && <p className="contact-phone">{message.phone}</p>}
          </div>
        </div>
        <div className="message-date">
          {new Date(message.created_at).toLocaleString()}
        </div>
      </div>
      
      <div className="message-content">
        <p>{message.message}</p>
      </div>
      
      <div className="message-actions">
        {!message.read && (
          <button 
            onClick={() => onMarkAsRead(message._id)} 
            className="btn btn-primary"
          >
            Mark as Read
          </button>
        )}
        <button 
          onClick={() => onDelete(message._id)} 
          className="btn btn-danger"
        >
          Delete Message
        </button>
      </div>
    </div>
  );
};

export default ContactManager;