import React, { useState, useEffect } from 'react';
import './HomeManager.css';
const HomeManager = ({ setMessage }) => {
  const [homeData, setHomeData] = useState(null);
  const [activeSection, setActiveSection] = useState('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/home`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setHomeData(data);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch home data' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching home data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section = null) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      let endpoint = '/api/admin/home';
      let dataToSend = homeData;

      if (section) {
        endpoint = `/api/admin/home/section/${section}`;
        dataToSend = homeData[section];

        if (section === 'banner' && homeData.bannerImage) {
          dataToSend = { ...dataToSend, bannerImage: homeData.bannerImage };
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${endpoint}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        setMessage({ type: 'success', text: 'Home page updated successfully' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to update home page' });
      }
    } catch (error) {
      console.error('Error updating home page:', error);
      setMessage({ type: 'error', text: 'Error updating home page' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value, index = null, subField = null) => {
    setHomeData(prevData => {
      const newData = { ...prevData };
      
      if (index !== null) {
        if (subField !== null) {
          if (Array.isArray(newData[section][field])) {
            newData[section][field] = newData[section][field].map((item, i) => 
              i === index ? { ...item, [subField]: value } : item
            );
          }
        } else {
          if (Array.isArray(newData[section][field])) {
            newData[section][field] = newData[section][field].map((item, i) => 
              i === index ? value : item
            );
          }
        }
      } else if (subField !== null) {
        newData[section] = {
          ...newData[section],
          [field]: {
            ...newData[section][field],
            [subField]: value
          }
        };
      } else if (section && field) {
        newData[section] = {
          ...newData[section],
          [field]: value
        };
      } else if (field) {
        newData[field] = value;
      }
      
      return newData;
    });
  };

  if (loading) {
    return <div className="admin-loading">Loading home data...</div>;
  }

  if (!homeData) {
    return <div className="admin-error">No home data found</div>;
  }

  return (
    <div className="home-manager">
      <h2 className="section-title">Home Page Management</h2>
      
      <div className="section-tabs">
        {['header', 'banner', 'serviceSection', 'about'].map(section => (
          <button
            key={section}
            className={`tab-btn ${activeSection === section ? 'active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {section === 'header' && 'Header'}
            {section === 'banner' && 'Banner'}
            {section === 'serviceSection' && 'Services'}
            {section === 'about' && 'About'}
          </button>
        ))}
      </div>

      <div className="section-editor">
        {activeSection === 'header' && homeData.header && (
          <div className="editor-section">
            <h3 className="editor-title">Header Section</h3>
            <div className="form-group">
              <label>Title (HTML allowed)</label>
              <textarea
                value={homeData.header.title || ''}
                onChange={(e) => handleInputChange('header', 'title', e.target.value)}
                rows="3"
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={homeData.header.description || ''}
                onChange={(e) => handleInputChange('header', 'description', e.target.value)}
                rows="3"
                className="form-textarea"
              />
            </div>
            <button 
              onClick={() => handleSave('header')} 
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save Header'}
            </button>
          </div>
        )}

        {activeSection === 'banner' && homeData.banner && (
          <div className="editor-section">
            <h3 className="editor-title">Banner Section</h3>
            <div className="form-group">
              <label>Video Thumbnail URL</label>
              <input
                type="text"
                value={homeData.banner.videoThumb || ''}
                onChange={(e) => handleInputChange('banner', 'videoThumb', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Statistics</label>
              {homeData.banner.statistics && homeData.banner.statistics.map((stat, index) => (
                <div key={index} className="sub-form">
                  <input
                    type="text"
                    placeholder="Value"
                    value={stat.value || ''}
                    onChange={(e) => handleInputChange('banner', 'statistics', e.target.value, index, 'value')}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Label"
                    value={stat.label || ''}
                    onChange={(e) => handleInputChange('banner', 'statistics', e.target.value, index, 'label')}
                    className="form-input"
                  />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Banner Image URL</label>
              <input
                type="text"
                value={homeData.bannerImage || ''}
                onChange={(e) => handleInputChange('', 'bannerImage', e.target.value)}
                className="form-input"
              />
            </div>
            <button 
              onClick={() => handleSave('banner')} 
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        )}

        {activeSection === 'serviceSection' && homeData.serviceSection && (
          <div className="editor-section">
            <h3 className="editor-title">Service Section</h3>
            <div className="form-group">
              <label>Title (HTML allowed)</label>
              <textarea
                value={homeData.serviceSection.title || ''}
                onChange={(e) => handleInputChange('serviceSection', 'title', e.target.value)}
                rows="3"
                className="form-textarea"
              />
            </div>
            <button 
              onClick={() => handleSave('serviceSection')} 
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save Service Section'}
            </button>
          </div>
        )}

        {activeSection === 'about' && homeData.about && (
          <div className="editor-section">
            <h3 className="editor-title">About Section</h3>
            <div className="form-group">
              <label>Logo URL</label>
              <input
                type="text"
                value={homeData.about.logo || ''}
                onChange={(e) => handleInputChange('about', 'logo', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={homeData.about.title || ''}
                onChange={(e) => handleInputChange('about', 'title', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={homeData.about.description || ''}
                onChange={(e) => handleInputChange('about', 'description', e.target.value)}
                rows="3"
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label>Buttons</label>
              {homeData.about.buttons && homeData.about.buttons.map((button, index) => (
                <div key={index} className="sub-form">
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={button.text || ''}
                    onChange={(e) => handleInputChange('about', 'buttons', e.target.value, index, 'text')}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Button Link"
                    value={button.link || ''}
                    onChange={(e) => handleInputChange('about', 'buttons', e.target.value, index, 'link')}
                    className="form-input"
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={() => handleSave('about')} 
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save About Section'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeManager;