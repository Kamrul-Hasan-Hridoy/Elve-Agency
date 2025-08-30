import React, { useState, useEffect } from 'react';

const PricingManager = ({ setMessage }) => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    badge: '',
    description: '',
    price: '',
    price_period: '/month',
    features: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/pricing`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPricingPlans(data);
      } else {
        setMessage({ text: 'Failed to fetch pricing plans', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error fetching pricing plans', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const planData = {
        ...formData,
        features: formData.features.split('\n').filter(item => item.trim() !== '')
      };
      
      const url = editingId 
        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/pricing/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/pricing`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(planData)
      });
      
      if (response.ok) {
        setMessage({ 
          text: editingId ? 'Pricing plan updated successfully!' : 'Pricing plan added successfully!', 
          type: 'success' 
        });
        resetForm();
        fetchPricingPlans();
      } else {
        setMessage({ text: 'Error saving pricing plan', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error saving pricing plan', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      badge: plan.badge,
      description: plan.description,
      price: plan.price,
      price_period: plan.price_period,
      features: plan.features.join('\n')
    });
    setEditingId(plan.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing plan?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/pricing/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setMessage({ text: 'Pricing plan deleted successfully!', type: 'success' });
        fetchPricingPlans();
      } else {
        setMessage({ text: 'Error deleting pricing plan', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error deleting pricing plan', type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      badge: '',
      description: '',
      price: '',
      price_period: '/month',
      features: ''
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
      <h2>Manage Pricing Plans</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Plan Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Badge Text:</label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleInputChange}
            placeholder="Popular, Recommended, etc."
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="3"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Price:</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              placeholder="$99"
            />
          </div>
          
          <div className="form-group">
            <label>Price Period:</label>
            <select
              name="price_period"
              value={formData.price_period}
              onChange={handleInputChange}
            >
              <option value="/month">/month</option>
              <option value="/year">/year</option>
              <option value="one-time">one-time</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Features (one per line):</label>
          <textarea
            name="features"
            value={formData.features}
            onChange={handleInputChange}
            rows="6"
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editingId ? 'Update Plan' : 'Add Plan')}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="admin-list">
        <h3>Existing Pricing Plans</h3>
        {pricingPlans.length === 0 ? (
          <p>No pricing plans found.</p>
        ) : (
          <div className="items-grid">
            {pricingPlans.map(plan => (
              <div key={plan._id} className="item-card">
                <div className="item-header">
                  <h4>{plan.name}</h4>
                  {plan.badge && <span className="badge">{plan.badge}</span>}
                </div>
                <p className="price">{plan.price}{plan.price_period}</p>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.slice(0, 3).map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                  {plan.features.length > 3 && <li>+{plan.features.length - 3} more</li>}
                </ul>
                <div className="item-actions">
                  <button onClick={() => handleEdit(plan)}>Edit</button>
                  <button onClick={() => handleDelete(plan.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingManager;