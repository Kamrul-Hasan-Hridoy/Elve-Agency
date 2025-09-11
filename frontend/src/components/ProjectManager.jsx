import React, { useState, useEffect } from 'react';
import './ProjectManager.css';

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
    return (
      <div className="project-manager-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-manager-container">
      <h2 className="section-title animate-fade-in">Manage Projects</h2>
      
      <form onSubmit={handleSubmit} className="project-form animate-slide-in">
        <div className="form-header">
          <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
          <div className="accent-line"></div>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="input-label">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              required
              placeholder="Enter project title"
            />
          </div>
          
          <div className="form-group">
            <label className="input-label">Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-input"
              required
              placeholder="Enter project category"
            />
          </div>
          
          <div className="form-group full-width">
            <label className="input-label">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              required
              rows="4"
              placeholder="Enter project description"
            />
          </div>
          
          <div className="form-group full-width">
            <label className="input-label">Image URL:</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter image URL"
            />
          </div>
          
          <div className="form-group full-width">
            <label className="input-label">Tags (comma separated):</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter tags separated by commas"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">
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
              className="btn-secondary"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      
      <div className="projects-section animate-fade-in">
        <div className="section-header">
          <h3>Existing Projects</h3>
          <div className="accent-line"></div>
        </div>
        
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <p>No projects found. Add your first project to get started!</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id || project._id} className="project-card">
                <div className="card-image">
                  {project.image ? (
                    <img 
                      src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/images/${project.image}`} 
                      alt={project.title}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>📷</span>
                    </div>
                  )}
                  <div className="card-overlay">
                    <button 
                      onClick={() => handleEdit(project)}
                      className="icon-btn edit-btn"
                      title="Edit project"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id || project._id)}
                      className="icon-btn delete-btn"
                      title="Delete project"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <h4 className="card-title">{project.title}</h4>
                  <span className="category-tag">{project.category}</span>
                  <p className="card-description">{project.description}</p>
                  <div className="tags-container">
                    {project.tags && project.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
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