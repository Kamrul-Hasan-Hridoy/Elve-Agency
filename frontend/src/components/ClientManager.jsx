import React, { useState, useEffect } from "react";

const ClientManager = ({ setMessage }) => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    logo: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/clients`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setMessage({ text: "Failed to fetch clients", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/clients`;
      const method = editingClient ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingClient ? {...formData, id: editingClient.id} : formData),
      });

      if (response.ok) {
        setMessage({ text: `Client ${editingClient ? 'updated' : 'added'} successfully`, type: "success" });
        resetForm();
        fetchClients();
      } else {
        setMessage({ text: "Failed to save client", type: "error" });
      }
    } catch (error) {
      console.error("Error saving client:", error);
      setMessage({ text: "Failed to save client", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/clients?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ text: "Client deleted successfully", type: "success" });
        fetchClients();
      } else {
        setMessage({ text: "Failed to delete client", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      setMessage({ text: "Failed to delete client", type: "error" });
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      logo: client.logo
    });
  };

  const resetForm = () => {
    setEditingClient(null);
    setIsAdding(false);
    setFormData({
      logo: ""
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2>Client Manager</h2>
      
      <button 
        onClick={() => setIsAdding(true)} 
        className="add-btn"
        style={{marginBottom: '20px'}}
      >
        Add New Client
      </button>

      {(isAdding || editingClient) && (
        <div className="form-container" style={{marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px'}}>
          <h3>{editingClient ? 'Edit' : 'Add'} Client</h3>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '10px'}}>
              <label>Logo URL: </label>
              <input 
                type="text" 
                name="logo" 
                value={formData.logo} 
                onChange={handleChange} 
                required 
                style={{width: '100%'}}
              />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={resetForm} style={{marginLeft: '10px'}}>Cancel</button>
          </form>
        </div>
      )}

      <div className="clients-list">
        {clients.map(client => (
          <div key={client.id} style={{marginBottom: "20px", padding: "15px", border: "1px solid #eee", borderRadius: "5px", display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <img src={client.logo} alt={`Client ${client.id}`} width={50} height={50} style={{marginRight: '10px'}} />
              <span>Client #{client.id}</span>
            </div>
            <div>
              <button onClick={() => handleEdit(client)} style={{marginRight: '10px'}}>Edit</button>
              <button onClick={() => handleDelete(client.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientManager;