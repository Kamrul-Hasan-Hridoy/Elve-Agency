import React, { useState, useEffect } from 'react';

const ServiceManager = ({ setMessage }) => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    desc: '',
    list: '',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/services`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        setMessage({ text: 'Failed to fetch services', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error fetching services', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const serviceData = {
        ...formData,
        list: formData.list.split('\n').filter(item => item.trim() !== '')
      };
      
      const url = editingId 
        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/services/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/services`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      
      if (response.ok) {
        setMessage({ 
          text: editingId ? 'Service updated successfully!' : 'Service added successfully!', 
          type: 'success' 
        });
        resetForm();
        fetchServices();
      } else {
        setMessage({ text: 'Error saving service', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error saving service', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      icon: service.icon,
      desc: service.desc,
      list: service.list.join('\n'),
      image: service.image
    });
    setEditingId(service.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setMessage({ text: 'Service deleted successfully!', type: 'success' });
        fetchServices();
      } else {
        setMessage({ text: 'Error deleting service', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error deleting service', type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      icon: '',
      desc: '',
      list: '',
      image: ''
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="admin-content-section">
      <h2>Manage Services</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Icon Path:</label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleInputChange}
            placeholder="/images/icon.png"
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            required
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label>Features (one per line):</label>
          <textarea
            name="list"
            value={formData.list}
            onChange={handleInputChange}
            rows="4"
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
          />
        </div>
        
        <div className="form-group">
          <label>Image Path:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="/images/service-image.png"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editingId ? 'Update Service' : 'Add Service')}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="admin-list">
        <h3>Existing Services</h3>
        {services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          <div className="items-grid">
            {services.map(service => (
              <div key={service._id} className="item-card">
                <h4>{service.title}</h4>
                <p>{service.desc}</p>
                <div className="item-actions">
                  <button onClick={() => handleEdit(service)}>Edit</button>
                  <button onClick={() => handleDelete(service.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManager;