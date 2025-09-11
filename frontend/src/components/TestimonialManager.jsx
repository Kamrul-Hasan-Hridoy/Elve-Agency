import React, { useState, useEffect } from 'react';
import './TestimonialManager.css';

const TestimonialManager = ({ setMessage }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    desc: '',
    img: '/images/Ellipse 2.png'
  });

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/testimonials`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        setMessage({ text: 'Failed to fetch testimonials', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      let url, method;
      
      if (editingTestimonial) {
        const testimonialId = editingTestimonial.id || editingTestimonial._id;
        url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/testimonials/${testimonialId}`;
        method = 'PUT';
      } else {
        url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/testimonials`;
        method = 'POST';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        setMessage({ 
          text: editingTestimonial 
            ? 'Testimonial updated successfully' 
            : 'Testimonial added successfully', 
          type: 'success' 
        });
        
        setFormData({
          name: '',
          role: '',
          desc: '',
          img: '/images/Ellipse 2.png'
        });
        
        setEditingTestimonial(null);
        fetchTestimonials();
      } else {
        setMessage({ 
          text: responseData.error || 'Failed to save testimonial', 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ text: 'Error saving testimonial', type: 'error' });
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      desc: testimonial.desc,
      img: testimonial.img || '/images/Ellipse 2.png'
    });
  };

  const handleDelete = async (testimonial) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const testimonialId = testimonial.id || testimonial._id;
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/testimonials/${testimonialId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      const responseData = await response.json();
      
      if (response.ok) {
        setMessage({ text: 'Testimonial deleted successfully', type: 'success' });
        fetchTestimonials();
      } else {
        setMessage({ 
          text: responseData.error || 'Failed to delete testimonial', 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ text: 'Error deleting testimonial', type: 'error' });
    }
  };

  const handleCancel = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      desc: '',
      img: '/images/Ellipse 2.png'
    });
  };

  const buildImageUrl = (imgPath) => {
    if (!imgPath) return '/images/placeholder.png';
    if (imgPath.startsWith('http')) return imgPath;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${imgPath}`;
  };

  if (loading) {
    return <div className="admin-loading">Loading testimonials...</div>;
  }

  return (
    <div className="testimonial-manager">
      <div className="admin-page-header">
        <h2 className="section-title">Testimonial Management</h2>
        <p className="section-subtitle">.. ... ..</p>
      </div>
      
      <div className="form-section">
        <h3 className="form-title">{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
        
        <form onSubmit={handleSubmit} className="testimonial-form">
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter customer's full name"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Role/Position *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                placeholder="e.g., CEO, Marketing Director"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Testimonial Text *</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="What did the customer say about your service?"
              className="form-textarea"
            />
          </div>
          
          <div className="form-group">
            <label>Profile Image URL</label>
            <div className="input-with-preview">
              <input
                type="text"
                name="img"
                value={formData.img}
                onChange={handleInputChange}
                placeholder="/images/profile.jpg"
                className="form-input"
              />
              {formData.img && (
                <div className="image-preview">
                  <img 
                    src={buildImageUrl(formData.img)} 
                    alt="Preview" 
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                </div>
              )}
            </div>
            <p className="input-help">Leave blank to use default profile image</p>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
            </button>
            
            {editingTestimonial && (
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel Edit
              </button>
            )}
            
            {!editingTestimonial && (
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Clear Form
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="testimonial-list-section">
        <div className="section-header">
          <h3 className="section-subtitle">Existing Testimonials</h3>
          <span className="items-count">{testimonials.length} testimonials</span>
        </div>
        
        {testimonials.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h4>No testimonials yet</h4>
            <p>Add your first testimonial to build trust with potential customers</p>
          </div>
        ) : (
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => {
              const uniqueKey = testimonial.id || testimonial._id || `testimonial-${index}`;
              return (
                <div key={uniqueKey} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-image">
                      <img 
                        src={buildImageUrl(testimonial.img)} 
                        alt={testimonial.name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                    <div className="testimonial-info">
                      <h4 className="testimonial-name">{testimonial.name}</h4>
                      <p className="testimonial-role">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="testimonial-content">
                    <p className="testimonial-text">"{testimonial.desc}"</p>
                  </div>
                  
                  <div className="testimonial-actions">
                    <button 
                      onClick={() => handleEdit(testimonial)}
                      className="btn btn-outline"
                    >
                      <span className="btn-icon">✏️</span> Edit
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(testimonial)}
                      className="btn btn-danger"
                    >
                      <span className="btn-icon">🗑️</span> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialManager;