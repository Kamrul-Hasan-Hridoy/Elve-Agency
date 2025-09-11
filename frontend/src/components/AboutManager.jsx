import React, { useState, useEffect } from 'react';
import './AboutManager.css';

const AboutManager = ({ setMessage }) => {
  const [aboutData, setAboutData] = useState({
    learnContainer: { heading: '', videoImage: '' },
    storySection: { mainHeading: '', paragraphs: [], images: [] },
    coreValues: [],
    team: [],
    awards: []
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
        // Remove FAQs from the data as we're using the shared API now
        const { faqs, ...aboutDataWithoutFaqs } = data;
        setAboutData(aboutDataWithoutFaqs);
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
        'awards': 'awards'
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
    <div className="about-manager">
      <h2 className="section-title">Manage About Page</h2>
      
      <div className="section-tabs">
        {['learnContainer',  'coreValues', 'team', 'awards'].map(section => ( /* 'storySection, '  */
          <button
            key={section}
            className={`tab-btn ${activeSection === section ? 'active' : ''}`}
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
        
        {/* {activeSection === 'storySection' && (
          <StorySection 
            data={aboutData.storySection} 
            onChange={handleInputChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
            onSave={() => handleSectionUpdate('storySection', aboutData.storySection)}
            saving={saving}
          />
        )} */}
        
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
      </div>
    </div>
  );
};

// Sub-components for each section
const LearnContainerSection = ({ data, onChange, onSave, saving }) => (
  <div className="form-section">
    <h3 className="form-title">Learn Container</h3>
    <div className="form-group">
      <label>Heading</label>
      <textarea
        value={data.heading}
        onChange={(e) => onChange('learnContainer', 'heading', e.target.value)}
        rows="3"
        className="form-textarea"
      />
    </div>
    <div className="form-group">
      <label>Video Image Path</label>
      <input
        type="text"
        value={data.videoImage}
        onChange={(e) => onChange('learnContainer', 'videoImage', e.target.value)}
        className="form-input"
      />
    </div>
    <button onClick={onSave} disabled={saving} className="btn btn-primary">
      {saving ? 'Saving...' : 'Save Learn Container'}
    </button>
  </div>
);

// const StorySection = ({ data, onChange, onAdd, onRemove, onSave, saving }) => (
//   <div className="form-section">
//     <h3 className="form-title">Story Section</h3>
//     <div className="form-group">
//       <label>Main Heading</label>
//       <textarea
//         value={data.mainHeading}
//         onChange={(e) => onChange('storySection', 'mainHeading', e.target.value)}
//         rows="3"
//         className="form-textarea"
//       />
//     </div>
    
//     <div className="array-section">
//       <h4 className="array-title">Paragraphs</h4>
//       {data.paragraphs.map((paragraph, index) => (
//         <div key={index} className="array-item">
//           <div className="form-group">
//             <label>Paragraph {index + 1}</label>
//             <textarea
//               value={paragraph}
//               onChange={(e) => onChange('storySection', 'paragraphs', e.target.value, index)}
//               rows="3"
//               className="form-textarea"
//             />
//           </div>
//           <button onClick={() => onRemove('storySection.paragraphs', index)} className="btn btn-danger btn-sm">
//             Remove
//           </button>
//         </div>
//       ))}
//       <button onClick={() => onAdd('storySection.paragraphs', 'New paragraph')} className="btn btn-outline">
//         Add Paragraph
//       </button>
//     </div>
    
//     <div className="array-section">
//       <h4 className="array-title">Images</h4>
//       {data.images.map((image, index) => (
//         <div key={index} className="array-item">
//           <div className="form-group">
//             <label>Image {index + 1} Path</label>
//             <input
//               type="text"
//               value={image}
//               onChange={(e) => onChange('storySection', 'images', e.target.value, index)}
//               className="form-input"
//             />
//           </div>
//           <button onClick={() => onRemove('storySection.images', index)} className="btn btn-danger btn-sm">
//             Remove
//           </button>
//         </div>
//       ))}
//       <button onClick={() => onAdd('storySection.images', '/images/new-image.png')} className="btn btn-outline">
//         Add Image
//       </button>
//     </div>
    
//     <button onClick={onSave} disabled={saving} className="btn btn-primary">
//       {saving ? 'Saving...' : 'Save Story Section'}
//     </button>
//   </div>
// );

const CoreValuesSection = ({ data, onChange, onAdd, onRemove, onSave, saving }) => (
  <div className="form-section">
    <h3 className="form-title">Core Values</h3>
    <div className="values-grid">
      {data.map((value, index) => (
        <div key={index} className="array-item card">
          <div className="card-header">
            <h4>Core Value {index + 1}</h4>
            <button onClick={() => onRemove('coreValues', index)} className="btn btn-danger btn-sm">
              Remove
            </button>
          </div>
          <div className="form-group">
            <label>Icon Path</label>
            <input
              type="text"
              value={value.icon}
              onChange={(e) => onChange('coreValues', null, e.target.value, index, 'icon')}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={value.title}
              onChange={(e) => onChange('coreValues', null, e.target.value, index, 'title')}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={value.description}
              onChange={(e) => onChange('coreValues', null, e.target.value, index, 'description')}
              rows="3"
              className="form-textarea"
            />
          </div>
        </div>
      ))}
    </div>
    <button onClick={() => onAdd('coreValues', {
      icon: '/images/icon.png',
      title: 'New Value',
      description: 'Value description'
    })} className="btn btn-outline">
      Add Core Value
    </button>
    
    <button onClick={onSave} disabled={saving} className="btn btn-primary">
      {saving ? 'Saving...' : 'Save Core Values'}
    </button>
  </div>
);

const TeamSection = ({ data, onChange, onAdd, onRemove, onSave, saving }) => (
  <div className="form-section">
    <h3 className="form-title">Team Members</h3>
    <div className="team-grid">
      {data.map((member, index) => (
        <div key={index} className="array-item card">
          <div className="card-header">
            <h4>Team Member {index + 1}</h4>
            <button onClick={() => onRemove('team', index)} className="btn btn-danger btn-sm">
              Remove
            </button>
          </div>
          <div className="form-group">
            <label>Image Path</label>
            <input
              type="text"
              value={member.image}
              onChange={(e) => onChange('team', null, e.target.value, index, 'image')}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={member.name}
              onChange={(e) => onChange('team', null, e.target.value, index, 'name')}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              value={member.role}
              onChange={(e) => onChange('team', null, e.target.value, index, 'role')}
              className="form-input"
            />
          </div>
        </div>
      ))}
    </div>
    <button onClick={() => onAdd('team', {
      image: '/images/team-member.png',
      name: 'New Member',
      role: 'Team Role'
    })} className="btn btn-outline">
      Add Team Member
    </button>
    
    <button onClick={onSave} disabled={saving} className="btn btn-primary">
      {saving ? 'Saving...' : 'Save Team'}
    </button>
  </div>
);

const AwardsSection = ({ data, onChange, onAdd, onRemove, onSave, saving }) => (
  <div className="form-section">
    <h3 className="form-title">Awards</h3>
    <div className="awards-grid">
      {data.map((award, index) => (
        <div key={index} className="array-item card">
          <div className="card-header">
            <h4>Award {index + 1}</h4>
            <button onClick={() => onRemove('awards', index)} className="btn btn-danger btn-sm">
              Remove
            </button>
          </div>
          <div className="form-group">
            <label>Image Path</label>
            <input
              type="text"
              value={award.image}
              onChange={(e) => onChange('awards', null, e.target.value, index, 'image')}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={award.title}
              onChange={(e) => onChange('awards', null, e.target.value, index, 'title')}
              className="form-input"
            />
          </div>
        </div>
      ))}
    </div>
    <button onClick={() => onAdd('awards', {
      image: '/images/award.png',
      title: 'Award Title'
    })} className="btn btn-outline">
      Add Award
    </button>
    
    <button onClick={onSave} disabled={saving} className="btn btn-primary">
      {saving ? 'Saving...' : 'Save Awards'}
    </button>
  </div>
);

export default AboutManager;