import React, { useState, useEffect } from 'react';

const AboutManager = ({ setMessage }) => {
  const [aboutData, setAboutData] = useState({
    learnContainer: { heading: '', videoImage: '' },
    storySection: { mainHeading: '', paragraphs: [], images: [] },
    coreValues: [],
    team: [],
    awards: [],
    faqs: []
  });
  const [activeSection, setActiveSection] = useState('learnContainer');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSectionUpdate = async (section, data) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      const sectionMap = {
        'learnContainer': 'learn-container',
        'storySection': 'story-section',
        'coreValues': 'core-values',
        'team': 'team',
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
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value, index = null, subField = null) => {
    setAboutData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      
      if (index !== null) {
        if (subField) {
          newData[section][index][subField] = value;
        } else {
          newData[section][index] = value;
        }
      } else if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newData[section][parent][child] = value;
      } else {
        newData[section][field] = value;
      }
      
      return newData;
    });
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

  if (loading) {
    return <div className="admin-loading">Loading About Data...</div>;
  }

  return (
    <div className="admin-content-section">
      <h2>Manage About Page</h2>
      
      <div className="section-tabs">
        {['learnContainer', 'storySection', 'coreValues', 'team', 'awards', 'faqs'].map(section => (
          <button
            key={section}
            className={activeSection === section ? 'active' : ''}
            onClick={() => setActiveSection(section)}
          >
            {section.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
      
      <div className="section-form">
        {activeSection === 'learnContainer' && (
          <LearnContainerSection 
            data={aboutData.learnContainer} 
            onChange={handleInputChange}
            onSave={() => handleSectionUpdate('learnContainer', aboutData.learnContainer)}
            saving={saving}
          />
        )}
        
        {activeSection === 'storySection' && (
          <StorySection 
            data={aboutData.storySection} 
            onChange={handleInputChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
            onSave={() => handleSectionUpdate('storySection', aboutData.storySection)}
            saving={saving}
          />
        )}
        
        {activeSection === 'coreValues' && (
          <CoreValuesSection 
            data={aboutData.coreValues} 
            onChange={handleInputChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
            onSave={() => handleSectionUpdate('coreValues', aboutData.coreValues)}
            saving={saving}
          />
        )}
        
        {activeSection === 'team' && (
          <TeamSection 
            data={aboutData.team} 
            onChange={handleInputChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
            onSave={() => handleSectionUpdate('team', aboutData.team)}
            saving={saving}
          />
        )}
        
        {activeSection === 'awards' && (
          <AwardsSection 
            data={aboutData.awards} 
            onChange={handleInputChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
            onSave={() => handleSectionUpdate('awards', aboutData.awards)}
            saving={saving}
          />
        )}
        
        {activeSection === 'faqs' && (
          <FaqsSection 
            data={aboutData.faqs} 
            onChange={handleInputChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
            onSave={() => handleSectionUpdate('faqs', aboutData.faqs)}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
};

// Sub-components for each section
const LearnContainerSection = ({ data, onChange, onSave, saving }) => (
  <div className="form-section">
    <h3>Learn Container</h3>
    <div className="form-group">
      <label>Heading:</label>
      <textarea
        value={data.heading}
        onChange={(e) => onChange('learnContainer', 'heading', e.target.value)}
        rows="3"
      />
    </div>
    <div className="form-group">
      <label>Video Image Path:</label>
      <input
        type="text"
        value={data.videoImage}
        onChange={(e) => onChange('learnContainer', 'videoImage', e.target.value)}
      />
    </div>
    <button onClick={onSave} disabled={saving} className="save-btn">
      {saving ? 'Saving...' : 'Save Learn Container'}
    </button>
  </div>
);

const StorySection = ({ data, onChange, onAdd, onRemove, onSave, saving }) => (
  <div className="form-section">
    <h3>Story Section</h3>
    <div className="form-group">
      <label>Main Heading:</label>
      <textarea
        value={data.mainHeading}
        onChange={(e) => onChange('storySection', 'mainHeading', e.target.value)}
        rows="3"
      />
    </div>
    
    <h4>Paragraphs:</h4>
    {data.paragraphs.map((paragraph, index) => (
      <div key={index} className="form-group array-item">
        <label>Paragraph {index + 1}:</label>
        <textarea
          value={paragraph}
          onChange={(e) => onChange('storySection', 'paragraphs', e.target.value, index)}
          rows="3"
        />
        <button onClick={() => onRemove('storySection.paragraphs', index)} className="remove-btn">
          Remove
        </button>
      </div>
    ))}
    <button onClick={() => onAdd('storySection.paragraphs', 'New paragraph')} className="add-btn">
      Add Paragraph
    </button>
    
    <h4>Images:</h4>
    {data.images.map((image, index) => (
      <div key={index} className="form-group array-item">
        <label>Image {index + 1} Path:</label>
        <input
          type="text"
          value={image}
          onChange={(e) => onChange('storySection', 'images', e.target.value, index)}
        />
        <button onClick={() => onRemove('storySection.images', index)} className="remove-btn">
          Remove
        </button>
      </div>
    ))}
    <button onClick={() => onAdd('storySection.images', '/images/new-image.png')} className="add-btn">
      Add Image
    </button>
    
    <button onClick={onSave} disabled={saving} className="save-btn">
      {saving ? 'Saving...' : 'Save Story Section'}
    </button>
  </div>
);

const CoreValuesSection = ({ data, onChange, onAdd, onRemove, onSave, saving }) => (
  <div className="form-section">
    <h3>Core Values</h3>
    {data.map((value, index) => (
      <div key={index} className="array-item card">
        <h4>Core Value {index + 1}</h4>
        <div className="form-group">
          <label>Icon Path:</label>
          <input
            type="text"
            value={value.icon}
            onChange={(e) => onChange('coreValues', null, e.target.value, index, 'icon')}
          />
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={value.title}
            onChange={(e) => onChange('coreValues', null, e.target.value, index, 'title')}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={value.description}
            onChange={(e) => onChange('coreValues', null, e.target.value, index, 'description')}
            rows="3"
          />
        </div>
        <button onClick={() => onRemove('coreValues', index)} className="remove-btn">
          Remove
        </button>
      </div>
    ))}
    <button onClick={() => onAdd('coreValues', {
      icon: '/images/icon.png',
      title: 'New Value',
      description: 'Value description'
    })} className="add-btn">
      Add Core Value
    </button>
    
    <button onClick={onSave} disabled={saving} className="save-btn">
      {saving ? 'Saving...' : 'Save Core Values'}
    </button>
  </div>
);

const TeamSection = ({ data, onChange, onAdd, onRemove, onSave, saving }) => (
  <div className="form-section">
    <h3>Team Members</h3>
    {data.map((member, index) => (
      <div key={index} className="array-item card">
        <h4>Team Member {index + 1}</h4>
        <div className="form-group">
          <label>Image Path:</label>
          <input
            type="text"
            value={member.image}
            onChange={(e) => onChange('team', null, e.target.value, index, 'image')}
          />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={member.name}
            onChange={(e) => onChange('team', null, e.target.value, index, 'name')}
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <input
            type="text"
            value={member.role}
            onChange={(e) => onChange('team', null, e.target.value, index, 'role')}
          />
        </div>
        <button onClick={() => onRemove('team', index)} className="remove-btn">
          Remove
        </button>
      </div>
    ))}
    <button onClick={() => onAdd('team', {
      image: '/images/team-member.png',
      name: 'New Member',
      role: 'Team Role'
    })} className="add-btn">
      Add Team Member
    </button>
    
    <button onClick={onSave} disabled={saving} className="save-btn">
      {saving ? 'Saving...' : 'Save Team'}
    </button>
  </div>
);

const AwardsSection = ({ data, onChange, onAdd, onRemove, onSave, saving }) => (
  <div className="form-section">
    <h3>Awards</h3>
    {data.map((award, index) => (
      <div key={index} className="array-item card">
        <h4>Award {index + 1}</h4>
        <div className="form-group">
          <label>Image Path:</label>
          <input
            type="text"
            value={award.image}
            onChange={(e) => onChange('awards', null, e.target.value, index, 'image')}
          />
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={award.title}
            onChange={(e) => onChange('awards', null, e.target.value, index, 'title')}
          />
        </div>
        <button onClick={() => onRemove('awards', index)} className="remove-btn">
          Remove
        </button>
      </div>
    ))}
    <button onClick={() => onAdd('awards', {
      image: '/images/award.png',
      title: 'Award Title'
    })} className="add-btn">
      Add Award
    </button>
    
    <button onClick={onSave} disabled={saving} className="save-btn">
      {saving ? 'Saving...' : 'Save Awards'}
    </button>
  </div>
);

const FaqsSection = ({ data, onChange, onAdd, onRemove, onSave, saving }) => (
  <div className="form-section">
    <h3>FAQs</h3>
    {data.map((faq, index) => (
      <div key={index} className="array-item card">
        <h4>FAQ {index + 1}</h4>
        <div className="form-group">
          <label>Question:</label>
          <input
            type="text"
            value={faq.question}
            onChange={(e) => onChange('faqs', null, e.target.value, index, 'question')}
          />
        </div>
        <div className="form-group">
          <label>Answer:</label>
          <textarea
            value={faq.answer}
            onChange={(e) => onChange('faqs', null, e.target.value, index, 'answer')}
            rows="3"
          />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={faq.open || false}
              onChange={(e) => onChange('faqs', null, e.target.checked, index, 'open')}
            />
            Open by default
          </label>
        </div>
        <button onClick={() => onRemove('faqs', index)} className="remove-btn">
          Remove
        </button>
      </div>
    ))}
    <button onClick={() => onAdd('faqs', {
      question: 'New Question',
      answer: 'Answer to the question',
      open: false
    })} className="add-btn">
      Add FAQ
    </button>
    
    <button onClick={onSave} disabled={saving} className="save-btn">
      {saving ? 'Saving...' : 'Save FAQs'}
    </button>
  </div>
);

export default AboutManager;