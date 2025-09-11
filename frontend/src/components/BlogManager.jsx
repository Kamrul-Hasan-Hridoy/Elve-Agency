import React, { useState, useEffect } from 'react';
import './BlogManager.css';

const BlogDetailsManager = ({ setMessage }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    date: '',
    read_time: '',
    content: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/blogs`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        setMessage({ text: 'Failed to fetch blogs', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error fetching blogs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/upload`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: uploadData
        }
      );

      if (response.ok) {
        const data = await response.json();
        // backend should return { imageUrl: "http://.../uploads/filename.jpg" }
        setFormData(prev => ({ ...prev, image: data.imageUrl }));
        setMessage({ text: 'Image uploaded successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Error uploading image', type: 'error' });
      }
    } catch (error) {
      console.error('Upload Error:', error);
      setMessage({ text: 'Error uploading image', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  // Add / Update blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingBlog
        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/blogs/${editingBlog.id}`
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ text: `Blog ${editingBlog ? 'updated' : 'created'} successfully!`, type: 'success' });
        setFormData({ title: '', category: '', description: '', image: '', date: '', read_time: '', content: '' });
        setEditingBlog(null);
        fetchBlogs();
      } else {
        setMessage({ text: `Error ${editingBlog ? 'updating' : 'creating'} blog`, type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: `Error ${editingBlog ? 'updating' : 'creating'} blog`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Edit blog
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      category: blog.category || '',
      description: blog.description || '',
      image: blog.image || '',
      date: blog.date || '',
      read_time: blog.read_time || '',
      content: blog.content || ''
    });
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/blogs/${id}`,
        { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.ok) {
        setMessage({ text: 'Blog deleted successfully!', type: 'success' });
        fetchBlogs();
      } else {
        setMessage({ text: 'Error deleting blog', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error deleting blog', type: 'error' });
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingBlog(null);
    setFormData({ title: '', category: '', description: '', image: '', date: '', read_time: '', content: '' });
  };

  if (loading) return <div className="admin-loading">Loading Blogs...</div>;

  return (
    <div className="blog-manager">
      <h2 className="section-title">Manage Blog Details</h2>

      {/* Form */}
      <div className="form-section">
        <h3 className="form-title">{editingBlog ? 'Edit Blog Details' : 'Add New Blog Details'}</h3>
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input 
                type="text" 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                required 
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows="3" 
              required 
              className="form-textarea"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Image Path</label>
              <input 
                type="text" 
                name="image" 
                value={formData.image} 
                onChange={handleInputChange} 
                required 
                className="form-input"
              />

              {/* Upload Button */}
              <div className="upload-box">
                <label className="upload-label">
                  <span className="upload-btn">📤 Upload</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </label>
                {uploading && <span className="uploading-text">Uploading...</span>}
              </div>

              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input 
                type="text" 
                name="date" 
                value={formData.date} 
                onChange={handleInputChange} 
                required 
                className="form-input"
                placeholder="e.g. September 9, 2023"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Read Time</label>
              <input 
                type="text" 
                name="read_time" 
                value={formData.read_time} 
                onChange={handleInputChange} 
                className="form-input"
                placeholder="e.g. 5 min read"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Full Content</label>
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleInputChange} 
              rows="6" 
              className="form-textarea"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingBlog ? 'Update Blog' : 'Add Blog'}
            </button>
            {editingBlog && (
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Blog List */}
      <div className="blog-list-section">
        <h3 className="section-subtitle">Blog Details List</h3>
        <div className="blog-grid">
          {blogs.map(blog => (
            <div key={blog.id} className="blog-card">
              <div className="card-image">
                {blog.image && (
                  <img src={blog.image} alt={blog.title} onError={(e) => e.target.style.display = 'none'} />
                )}
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h4 className="blog-title">{blog.title}</h4>
                  <span className="blog-category">{blog.category}</span>
                </div>
                <p className="blog-description">
                  {blog.description ? blog.description.substring(0, 100) : ''}...
                </p>
                <div className="blog-meta">
                  <span className="blog-date">{blog.date}</span>
                  {blog.read_time && <span className="blog-read-time">{blog.read_time}</span>}
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(blog)} className="btn btn-outline">Edit</button>
                  <button onClick={() => handleDelete(blog.id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsManager;
