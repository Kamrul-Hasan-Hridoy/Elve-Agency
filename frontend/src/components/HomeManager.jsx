import React, { useState, useEffect } from 'react';

const HomeManager = ({ setMessage }) => {
  const [homeData, setHomeData] = useState(null);
  const [activeSection, setActiveSection] = useState('header');
  const [loading, setLoading] = useState(true);

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

  // ✅ Updated handleSave function
  const handleSave = async (section = null) => {
    try {
      const token = localStorage.getItem('adminToken');
      let endpoint = '/api/admin/home';
      let dataToSend = homeData;

      if (section) {
        endpoint = `/api/admin/home/section/${section}`;
        // Send flat structure instead of nested
        dataToSend = homeData[section];

        // Handle bannerImage separately as it's at the root level
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
    }
  };

  const handleInputChange = (section, field, value, index = null, subField = null) => {
    setHomeData(prevData => {
      const newData = { ...prevData };
      
      if (index !== null) {
        // For array fields
        if (subField !== null) {
          // For objects within arrays
          if (Array.isArray(newData[section][field])) {
            newData[section][field] = newData[section][field].map((item, i) => 
              i === index ? { ...item, [subField]: value } : item
            );
          }
        } else {
          // For simple array values
          if (Array.isArray(newData[section][field])) {
            newData[section][field] = newData[section][field].map((item, i) => 
              i === index ? value : item
            );
          }
        }
      } else if (subField !== null) {
        // For nested objects
        newData[section] = {
          ...newData[section],
          [field]: {
            ...newData[section][field],
            [subField]: value
          }
        };
      } else if (section && field) {
        // For simple fields within a section
        newData[section] = {
          ...newData[section],
          [field]: value
        };
      } else if (field) {
        // For root-level fields (like bannerImage)
        newData[field] = value;
      }
      
      return newData;
    });
  };

  if (loading) {
    return <div>Loading home data...</div>;
  }

  if (!homeData) {
    return <div>No home data found</div>;
  }

  return (
    <div className="admin-home-manager">
      <h2>Home Page Management</h2>
      
      <div className="section-selector">
        <button 
          className={activeSection === 'header' ? 'active' : ''} 
          onClick={() => setActiveSection('header')}
        >
          Header
        </button>
        <button 
          className={activeSection === 'banner' ? 'active' : ''} 
          onClick={() => setActiveSection('banner')}
        >
          Banner
        </button>
        <button 
          className={activeSection === 'serviceSection' ? 'active' : ''} 
          onClick={() => setActiveSection('serviceSection')}
        >
          Service Section
        </button>
        <button 
          className={activeSection === 'about' ? 'active' : ''} 
          onClick={() => setActiveSection('about')}
        >
          About
        </button>
      </div>

      <div className="section-editor">
        {activeSection === 'header' && homeData.header && (
          <div>
            <h3>Header Section</h3>
            <div className="form-group">
              <label>Title (HTML allowed)</label>
              <textarea
                value={homeData.header.title || ''}
                onChange={(e) => handleInputChange('header', 'title', e.target.value)}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={homeData.header.description || ''}
                onChange={(e) => handleInputChange('header', 'description', e.target.value)}
                rows="3"
              />
            </div>
            <button onClick={() => handleSave('header')}>Save Header</button>
          </div>
        )}

        {activeSection === 'banner' && homeData.banner && (
          <div>
            <h3>Banner Section</h3>
            <div className="form-group">
              <label>Video Thumbnail URL</label>
              <input
                type="text"
                value={homeData.banner.videoThumb || ''}
                onChange={(e) => handleInputChange('banner', 'videoThumb', e.target.value)}
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
                  />
                  <input
                    type="text"
                    placeholder="Label"
                    value={stat.label || ''}
                    onChange={(e) => handleInputChange('banner', 'statistics', e.target.value, index, 'label')}
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
              />
            </div>
            <button onClick={() => handleSave('banner')}>Save Banner</button>
          </div>
        )}

        {activeSection === 'serviceSection' && homeData.serviceSection && (
          <div>
            <h3>Service Section</h3>
            <div className="form-group">
              <label>Title (HTML allowed)</label>
              <textarea
                value={homeData.serviceSection.title || ''}
                onChange={(e) => handleInputChange('serviceSection', 'title', e.target.value)}
                rows="3"
              />
            </div>
            <button onClick={() => handleSave('serviceSection')}>Save Service Section</button>
          </div>
        )}

        {activeSection === 'about' && homeData.about && (
          <div>
            <h3>About Section</h3>
            <div className="form-group">
              <label>Logo URL</label>
              <input
                type="text"
                value={homeData.about.logo || ''}
                onChange={(e) => handleInputChange('about', 'logo', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={homeData.about.title || ''}
                onChange={(e) => handleInputChange('about', 'title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={homeData.about.description || ''}
                onChange={(e) => handleInputChange('about', 'description', e.target.value)}
                rows="3"
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
                  />
                  <input
                    type="text"
                    placeholder="Button Link"
                    value={button.link || ''}
                    onChange={(e) => handleInputChange('about', 'buttons', e.target.value, index, 'link')}
                  />
                </div>
              ))}
            </div>
            <button onClick={() => handleSave('about')}>Save About Section</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeManager;
