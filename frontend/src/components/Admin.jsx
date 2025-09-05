import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import ServiceManager from './ServiceManager';
import TestimonialManager from './TestimonialManager';
import AboutManager from './AboutManager';
import ClientManager from './ClientManager';
import FAQManager from './FAQManager';
import PricingManager from './PricingManager';
import ContactManager from './ContactManager';
import BlogManager from './BlogManager';
import ProjectManager from './ProjectManager';
import HomeManager from './HomeManager'; 
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // Set home as default
  const [message, setMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
      fetchUnreadCount();
    }
  }, []);

  // Function to fetch unread message count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/contact-messages`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const messages = await response.json();
        const unread = messages.filter(msg => !msg.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/verify`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('adminToken');
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
    fetchUnreadCount();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUnreadCount(0);
  };

  // Function to update unread count
  const updateUnreadCount = (count) => {
    setUnreadCount(count);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Elve Agency Admin Panel</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="admin-tabs">
        <button
          className={activeTab === 'home' ? 'active' : ''}
          onClick={() => setActiveTab('home')}
        >
          Home Page
        </button>
        <button
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button
          className={activeTab === 'testimonials' ? 'active' : ''}
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonials
        </button>
        <button
          className={activeTab === 'clients' ? 'active' : ''}
          onClick={() => setActiveTab('clients')}
        >
          Clients
        </button>
        <button
          className={activeTab === 'faqs' ? 'active' : ''}
          onClick={() => setActiveTab('faqs')}
        >
          FAQs
        </button>
        <button
          className={activeTab === 'pricing' ? 'active' : ''}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing
        </button>
        <button
          className={activeTab === 'blogs' ? 'active' : ''}
          onClick={() => setActiveTab('blogs')}
        >
          Blogs
        </button>
        <button
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          About Page
        </button>
        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={activeTab === 'contact' ? 'active' : ''}
          onClick={() => setActiveTab('contact')}
        >
          Contact Messages
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </button>
      </div>

      {message && (
        <div className={`admin-message ${message.type || 'info'}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="close-btn">
            ×
          </button>
        </div>
      )}

      <div className="admin-content">
        {activeTab === 'home' && (
          <HomeManager setMessage={setMessage} />
        )}
        {activeTab === 'services' && (
          <ServiceManager setMessage={setMessage} />
        )}
        {activeTab === 'testimonials' && (
          <TestimonialManager setMessage={setMessage} />
        )}
        {activeTab === 'clients' && (
          <ClientManager setMessage={setMessage} />
        )}
        {activeTab === 'faqs' && (
          <FAQManager setMessage={setMessage} />
        )}
        {activeTab === 'pricing' && (
          <PricingManager setMessage={setMessage} />
        )}
        {activeTab === 'blogs' && (
          <BlogManager setMessage={setMessage} />
        )}
        {activeTab === 'about' && (
          <AboutManager setMessage={setMessage} />
        )}
        {activeTab === 'projects' && (
          <ProjectManager setMessage={setMessage} />
        )}
        {activeTab === 'contact' && (
          <ContactManager 
            setMessage={setMessage} 
            updateUnreadCount={updateUnreadCount}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;