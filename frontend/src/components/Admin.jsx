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
  const [activeTab, setActiveTab] = useState('home');
  const [message, setMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
      fetchUnreadCount();
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'home', label: 'Home Page', icon: '🏠' },
    { id: 'services', label: 'Services', icon: '🛠️' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
    { id: 'clients', label: 'Clients', icon: '🏢' },
    { id: 'faqs', label: 'FAQs', icon: '❓' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'blogs', label: 'Blogs', icon: '📝' },
    { id: 'about', label: 'About Page', icon: 'ℹ️' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'contact', label: 'Messages', icon: '📨', badge: unreadCount }
  ];

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <h1>Elve Agency Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="welcome-text">Welcome, Admin</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h2>Menu</h2>
          </div>
          <nav className="sidebar-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (isMobile) setSidebarOpen(false);
                }}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="nav-badge">{tab.badge}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>System Online</span>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          {message && (
            <div className={`admin-message ${message.type || 'info'}`}>
              <div className="message-content">
                <span className="message-text">{message.text}</span>
                <button onClick={() => setMessage(null)} className="message-close">
                  ×
                </button>
              </div>
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
        </main>
      </div>
    </div>
  );
};

export default Admin;