import React, { useState, useEffect } from 'react';

const ProjectManager = ({ setMessage }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    tags: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/projects`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setMessage({ text: 'Failed to fetch projects', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error fetching projects', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingProject 
        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/projects/${editingProject.id || editingProject._id}`
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/projects`;
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        }),
      });
      
      if (response.ok) {
        setMessage({ 
          text: editingProject ? 'Project updated successfully' : 'Project added successfully', 
          type: 'success' 
        });
        setFormData({
          title: '',
          category: '',
          description: '',
          image: '',
          tags: ''
        });
        setEditingProject(null);
        fetchProjects();
      } else {
        setMessage({ text: 'Failed to save project', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error saving project', type: 'error' });
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      image: project.image,
      tags: project.tags.join(', ')
    });
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/projects/${projectId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        setMessage({ text: 'Project deleted successfully', type: 'success' });
        fetchProjects();
      } else {
        setMessage({ text: 'Failed to delete project', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error deleting project', type: 'error' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="admin-section">
      <h2>Manage Projects</h2>
      
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
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label>Tags (comma separated):</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
          />
        </div>
        
        <button type="submit" className="submit-btn">
          {editingProject ? 'Update Project' : 'Add Project'}
        </button>
        
        {editingProject && (
          <button 
            type="button" 
            onClick={() => {
              setEditingProject(null);
              setFormData({
                title: '',
                category: '',
                description: '',
                image: '',
                tags: ''
              });
            }}
            className="cancel-btn"
          >
            Cancel Edit
          </button>
        )}
      </form>
      
      <div className="admin-list">
        <h3>Existing Projects</h3>
        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          <div className="items-grid">
            {projects.map(project => (
              <div key={project.id || project._id} className="item-card">
                <div className="item-image">
                  {project.image && (
                    <img 
                      src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/images/${project.image}`} 
                      alt={project.title}
                    />
                  )}
                </div>
                <div className="item-details">
                  <h4>{project.title}</h4>
                  <p className="category">{project.category}</p>
                  <p className="description">{project.description}</p>
                  <div className="tags">
                    {project.tags && project.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="item-actions">
                  <button 
                    onClick={() => handleEdit(project)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id || project._id)}
                    className="delete-btn"
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

export default ProjectManager;