import React, { useState, useEffect } from "react";
import "./ClientManager.css";

const ClientManager = ({ setMessage }) => {
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    logo: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch Clients
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/admin/clients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        setMessage({ text: "Failed to fetch clients", type: "error" });
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setMessage({ text: "Failed to fetch clients", type: "error" });
    }
  };

  // Add / Update Client
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.logo.trim()) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      
      const url = editingId
        ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/admin/clients/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/admin/clients`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          text: `Client ${editingId ? "updated" : "added"} successfully`,
          type: "success",
        });
        resetForm();
        fetchClients();
      } else {
        const errorData = await response.json();
        setMessage({
          text: errorData.error || "Failed to save client",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error saving client:", error);
      setMessage({ text: "Failed to save client", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Delete Client
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/admin/clients/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage({ text: "Client deleted successfully", type: "success" });
        fetchClients();
      } else {
        const errorData = await response.json();
        setMessage({
          text: errorData.error || "Failed to delete client",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      setMessage({ text: "Failed to delete client", type: "error" });
    }
  };

  // Edit Client
  const handleEdit = (client) => {
    setEditingId(client._id || client.id);
    setFormData({
      logo: client.logo || "",
      name: client.name || "",
    });
    setIsAdding(true);
  };

  // Reset Form
  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      logo: "",
      name: "",
    });
  };

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Build image URL
  const buildImageUrl = (imgPath) => {
    if (!imgPath) return '/images/placeholder.png';
    if (imgPath.startsWith('http')) return imgPath;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${imgPath}`;
  };

  return (
    <div className="client-manager">
      <div className="admin-page-header">
        <h2>Client Management</h2>
        <p>   .   </p>
      </div>

      <button
        onClick={() => {
          resetForm();
          setIsAdding(true);
        }}
        className="btn btn-primary"
        style={{ marginBottom: "20px" }}
      >
        Add New Client
      </button>

      {isAdding && (
        <div className="admin-content-card">
          <h3 className="form-title">{editingId ? "Edit Client" : "Add New Client"}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Client Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter client name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="logo">Logo URL *</label>
              <div className="input-with-preview">
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  required
                  placeholder="/images/client-logo.png"
                />
                <div className="image-preview">
                  <img 
                    src={buildImageUrl(formData.logo)} 
                    alt="Preview" 
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                </div>
              </div>
              <p className="input-hint">Enter a relative path like "/images/logo.png" or a full URL</p>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : (editingId ? "Update Client" : "Add Client")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-content-card">
        <div className="card-header">
          <h3>Existing Clients</h3>
          <span className="items-count">{clients.length} {clients.length === 1 ? 'client' : 'clients'}</span>
        </div>
        
        {clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏢</div>
            <h4>No clients yet</h4>
            <p>Add your first client to showcase your partnerships</p>
          </div>
        ) : (
          <div className="clients-grid">
            {clients.map((client) => (
              <div key={client._id || client.id} className="client-card">
                <div className="client-image-container">
                  <img
                    src={buildImageUrl(client.logo)}
                    alt={client.name || `Client ${client._id || client.id}`}
                    className="client-logo"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                </div>
                <div className="client-info">
                  <h4 className="client-name">{client.name || `Client #${client._id || client.id}`}</h4>
                </div>
                <div className="client-actions">
                  <button 
                    onClick={() => handleEdit(client)}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client._id || client.id)}
                    className="btn btn-sm btn-outline btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManager;