import React, { useState, useEffect } from 'react';
import './PricingManager.css';

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
        const errorData = await response.json();
        setMessage({ text: errorData.error || 'Error saving pricing plan', type: 'error' });
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
        const errorData = await response.json();
        setMessage({ text: errorData.error || 'Error deleting pricing plan', type: 'error' });
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
    <div className="pricing-manager">
      <h2 className="section-title">Manage Pricing Plans</h2>
      
      <div className="form-section">
        <h3 className="form-title">{editingId ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}</h3>
        <form onSubmit={handleSubmit} className="pricing-form">
          <div className="form-group">
            <label>Plan Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Badge Text <span className="optional">(optional)</span></label>
            <input
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleInputChange}
              placeholder="Popular, Recommended, etc."
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
              className="form-textarea"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="$99"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Price Period</label>
              <select
                name="price_period"
                value={formData.price_period}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="/month">/month</option>
                <option value="/year">/year</option>
                <option value="one-time">one-time</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Features (one per line)</label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              rows="6"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              required
              className="form-textarea"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : (editingId ? 'Update Plan' : 'Add Plan')}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="pricing-list-section">
        <h3 className="section-subtitle">Existing Pricing Plans</h3>
        {pricingPlans.length === 0 ? (
          <p className="no-items">No pricing plans found.</p>
        ) : (
          <div className="pricing-grid">
            {pricingPlans.map(plan => (
              <div key={plan.id} className="pricing-card">
                <div className="card-header">
                  <h4 className="plan-name">{plan.name}</h4>
                  {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                </div>
                <div className="plan-price">{plan.price}{plan.price_period}</div>
                <p className="plan-description">{plan.description}</p>
                <ul className="plan-features">
                  {plan.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="feature-item">✓ {feature}</li>
                  ))}
                  {plan.features.length > 3 && <li className="feature-more">+{plan.features.length - 3} more features</li>}
                </ul>
                <div className="card-actions">
                  <button onClick={() => handleEdit(plan)} className="btn btn-outline">Edit</button>
                  <button onClick={() => handleDelete(plan.id)} className="btn btn-danger">Delete</button>
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