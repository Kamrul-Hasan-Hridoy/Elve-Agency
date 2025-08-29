
import React, { useState, useEffect } from 'react';

const AboutManager = ({ setMessage }) => {
  const [aboutData, setAboutData] = useState(null);
  const [activeSection, setActiveSection] = useState('learnContainer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/about`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
      } else {
        setMessage({ text: 'Failed to fetch about data', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error fetching about data', type: 'error' });
    }
  };

  const handleSectionUpdate = async (section, data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Convert camelCase to kebab-case for API endpoint
      const sectionMap = {
        'learnContainer': 'learn-container',
        'storySection': 'story-section',
        'coreValues': 'core-values',
        'team': 'team',
        'services': 'services',
        'testimonials': 'testimonials',
        'awards': 'awards',
        'faqs': 'faqs'
      };
      
      const apiSection = sectionMap[section] || section;
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/about/${apiSection}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        }
      );
      
      if (response.ok) {
        setMessage({ 
          text: `${section.replace(/([A-Z])/g, ' $1').trim()} updated successfully!`, 
          type: 'success' 
        });
      } else {
        setMessage({ text: `Error updating ${section}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: `Error updating ${section}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      // Handle array fields
      const newArray = [...aboutData[section]];
      if (typeof field === 'object' && field.nested) {
        // Handle nested objects in arrays
        newArray[index][field.key] = value;
      } else {
        newArray[index] = value;
      }
      setAboutData(prev => ({
        ...prev,
        [section]: newArray
      }));
    } else if (field.includes('.')) {
      // Handle nested fields
      const [parent, child] = field.split('.');
      setAboutData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [parent]: {
            ...prev[section][parent],
            [child]: value
          }
        }
      }));
    } else {
      // Handle regular fields
      setAboutData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const addArrayItem = (section, template) => {
    setAboutData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const removeArrayItem = (section, index) => {
    setAboutData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  if (!aboutData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-content-section">
      <h2>Manage About Page</h2>
      
      <div className="section-tabs">
        <button 
          className={activeSection === 'learnContainer' ? 'active' : ''} 
          onClick={() => setActiveSection('learnContainer')}
        >
          Learn Container
        </button>
        <button 
          className={activeSection === 'storySection' ? 'active' : ''} 
          onClick={() => setActiveSection('storySection')}
        >
          Story Section
        </button>
        <button 
          className={activeSection === 'coreValues' ? 'active' : ''} 
          onClick={() => setActiveSection('coreValues')}
        >
          Core Values
        </button>
        <button 
          className={activeSection === 'team' ? 'active' : ''} 
          onClick={() => setActiveSection('team')}
        >
          Team
        </button>
        <button 
          className={activeSection === 'services' ? 'active' : ''} 
          onClick={() => setActiveSection('services')}
        >
          Services
        </button>
        <button 
          className={activeSection === 'testimonials' ? 'active' : ''} 
          onClick={() => setActiveSection('testimonials')}
        >
          Testimonials
        </button>
        <button 
          className={activeSection === 'awards' ? 'active' : ''} 
          onClick={() => setActiveSection('awards')}
        >
          Awards
        </button>
        <button 
          className={activeSection === 'faqs' ? 'active' : ''} 
          onClick={() => setActiveSection('faqs')}
        >
          FAQs
        </button>
      </div>
      
      <div className="section-form">
        {activeSection === 'learnContainer' && (
          <div>
            <h3>Learn Container</h3>
            <div className="form-group">
              <label>Heading:</label>
              <textarea
                value={aboutData.learnContainer.heading}
                onChange={(e) => handleInputChange('learnContainer', 'heading', e.target.value)}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Video Image Path:</label>
              <input
                type="text"
                value={aboutData.learnContainer.videoImage}
                onChange={(e) => handleInputChange('learnContainer', 'videoImage', e.target.value)}
              />
            </div>
            <button 
              onClick={() => handleSectionUpdate('learnContainer', aboutData.learnContainer)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Learn Container'}
            </button>
          </div>
        )}
        
        {activeSection === 'storySection' && (
          <div>
            <h3>Story Section</h3>
            <div className="form-group">
              <label>Main Heading:</label>
              <textarea
                value={aboutData.storySection.mainHeading}
                onChange={(e) => handleInputChange('storySection', 'mainHeading', e.target.value)}
                rows="3"
              />
            </div>
            
            <h4>Paragraphs:</h4>
            {aboutData.storySection.paragraphs.map((paragraph, index) => (
              <div key={index} className="form-group array-item">
                <label>Paragraph {index + 1}:</label>
                <textarea
                  value={paragraph}
                  onChange={(e) => handleInputChange('storySection', 'paragraphs', e.target.value, index)}
                  rows="3"
                />
                <button onClick={() => removeArrayItem('storySection.paragraphs', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('storySection.paragraphs', 'New paragraph')}>Add Paragraph</button>
            
            <h4>Images:</h4>
            {aboutData.storySection.images.map((image, index) => (
              <div key={index} className="form-group array-item">
                <label>Image {index + 1} Path:</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleInputChange('storySection', 'images', e.target.value, index)}
                />
                <button onClick={() => removeArrayItem('storySection.images', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('storySection.images', '/images/new-image.png')}>Add Image</button>
            
            <button 
              onClick={() => handleSectionUpdate('storySection', aboutData.storySection)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Story Section'}
            </button>
          </div>
        )}
        
        {activeSection === 'coreValues' && (
          <div>
            <h3>Core Values</h3>
            {aboutData.coreValues.map((value, index) => (
              <div key={index} className="array-item card">
                <h4>Core Value {index + 1}</h4>
                <div className="form-group">
                  <label>Icon Path:</label>
                  <input
                    type="text"
                    value={value.icon}
                    onChange={(e) => handleInputChange('coreValues', {nested: true, key: 'icon'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => handleInputChange('coreValues', {nested: true, key: 'title'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={value.description}
                    onChange={(e) => handleInputChange('coreValues', {nested: true, key: 'description'}, e.target.value, index)}
                    rows="3"
                  />
                </div>
                <button onClick={() => removeArrayItem('coreValues', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('coreValues', {
              icon: '/images/icon.png',
              title: 'New Value',
              description: 'Value description'
            })}>Add Core Value</button>
            
            <button 
              onClick={() => handleSectionUpdate('coreValues', aboutData.coreValues)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Core Values'}
            </button>
          </div>
        )}
        
        {activeSection === 'team' && (
          <div>
            <h3>Team Members</h3>
            {aboutData.team.map((member, index) => (
              <div key={index} className="array-item card">
                <h4>Team Member {index + 1}</h4>
                <div className="form-group">
                  <label>Image Path:</label>
                  <input
                    type="text"
                    value={member.image}
                    onChange={(e) => handleInputChange('team', {nested: true, key: 'image'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleInputChange('team', {nested: true, key: 'name'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => handleInputChange('team', {nested: true, key: 'role'}, e.target.value, index)}
                  />
                </div>
                <button onClick={() => removeArrayItem('team', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('team', {
              image: '/images/team-member.png',
              name: 'New Member',
              role: 'Team Role'
            })}>Add Team Member</button>
            
            <button 
              onClick={() => handleSectionUpdate('team', aboutData.team)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Team'}
            </button>
          </div>
        )}
        
        {activeSection === 'services' && (
          <div>
            <h3>Services</h3>
            {aboutData.services.map((service, index) => (
              <div key={index} className="array-item card">
                <h4>Service {index + 1}</h4>
                <div className="form-group">
                  <label>Icon Path:</label>
                  <input
                    type="text"
                    value={service.icon}
                    onChange={(e) => handleInputChange('services', {nested: true, key: 'icon'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleInputChange('services', {nested: true, key: 'title'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleInputChange('services', {nested: true, key: 'description'}, e.target.value, index)}
                    rows="3"
                  />
                </div>
                <button onClick={() => removeArrayItem('services', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('services', {
              icon: '/images/service-icon.png',
              title: 'New Service',
              description: 'Service description'
            })}>Add Service</button>
            
            <button 
              onClick={() => handleSectionUpdate('services', aboutData.services)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Services'}
            </button>
          </div>
        )}
        
        {activeSection === 'testimonials' && (
          <div>
            <h3>Testimonials</h3>
            {aboutData.testimonials.map((testimonial, index) => (
              <div key={index} className="array-item card">
                <h4>Testimonial {index + 1}</h4>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={testimonial.description}
                    onChange={(e) => handleInputChange('testimonials', {nested: true, key: 'description'}, e.target.value, index)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) => handleInputChange('testimonials', {nested: true, key: 'name'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <input
                    type="text"
                    value={testimonial.role}
                    onChange={(e) => handleInputChange('testimonials', {nested: true, key: 'role'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Image Path:</label>
                  <input
                    type="text"
                    value={testimonial.image}
                    onChange={(e) => handleInputChange('testimonials', {nested: true, key: 'image'}, e.target.value, index)}
                  />
                </div>
                <button onClick={() => removeArrayItem('testimonials', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('testimonials', {
              description: 'Testimonial text',
              name: 'Customer Name',
              role: 'Customer Role',
              image: '/images/testimonial.png'
            })}>Add Testimonial</button>
            
            <button 
              onClick={() => handleSectionUpdate('testimonials', aboutData.testimonials)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Testimonials'}
            </button>
          </div>
        )}
        
        {activeSection === 'awards' && (
          <div>
            <h3>Awards</h3>
            {aboutData.awards.map((award, index) => (
              <div key={index} className="array-item card">
                <h4>Award {index + 1}</h4>
                <div className="form-group">
                  <label>Image Path:</label>
                  <input
                    type="text"
                    value={award.image}
                    onChange={(e) => handleInputChange('awards', {nested: true, key: 'image'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => handleInputChange('awards', {nested: true, key: 'title'}, e.target.value, index)}
                  />
                </div>
                <button onClick={() => removeArrayItem('awards', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('awards', {
              image: '/images/award.png',
              title: 'Award Title'
            })}>Add Award</button>
            
            <button 
              onClick={() => handleSectionUpdate('awards', aboutData.awards)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Awards'}
            </button>
          </div>
        )}
        
        {activeSection === 'faqs' && (
          <div>
            <h3>FAQs</h3>
            {aboutData.faqs.map((faq, index) => (
              <div key={index} className="array-item card">
                <h4>FAQ {index + 1}</h4>
                <div className="form-group">
                  <label>Question:</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleInputChange('faqs', {nested: true, key: 'question'}, e.target.value, index)}
                  />
                </div>
                <div className="form-group">
                  <label>Answer:</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleInputChange('faqs', {nested: true, key: 'answer'}, e.target.value, index)}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={faq.open || false}
                      onChange={(e) => handleInputChange('faqs', {nested: true, key: 'open'}, e.target.checked, index)}
                    />
                    Open by default
                  </label>
                </div>
                <button onClick={() => removeArrayItem('faqs', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('faqs', {
              question: 'New Question',
              answer: 'Answer to the question',
              open: false
            })}>Add FAQ</button>
            
            <button 
              onClick={() => handleSectionUpdate('faqs', aboutData.faqs)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save FAQs'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutManager;