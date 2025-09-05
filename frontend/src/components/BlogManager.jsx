import React, { useState, useEffect } from 'react';

const BlogDetailsManager = ({ setMessage }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      content: blog.content || ''   // ✅ Prevent undefined crash
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
    <div className="admin-content-section">
      <h2>Manage Blog Details</h2>

      {/* Form */}
      <div className="admin-form">
        <h3>{editingBlog ? 'Edit Blog Details' : 'Add New Blog Details'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required />
          </div>
          <div className="form-group">
            <label>Image Path:</label>
            <input type="text" name="image" value={formData.image} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input type="text" name="date" value={formData.date} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Read Time:</label>
            <input type="text" name="read_time" value={formData.read_time} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Full Content:</label>
            <textarea name="content" value={formData.content} onChange={handleInputChange} rows="6" />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : editingBlog ? 'Update Blog' : 'Add Blog'}</button>
            {editingBlog && <button type="button" onClick={cancelEdit} className="remove-btn">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Blog List */}
      <div className="admin-list">
        <h3>Blog Details List</h3>
        <div className="items-grid">
          {blogs.map(blog => (
            <div key={blog.id} className="item-card">
              <div className="item-header">
                <h4>{blog.title}</h4>
                <span className="badge">{blog.category}</span>
              </div>
              <p>{blog.description ? blog.description.substring(0, 100) : ''}...</p> {/* ✅ Safe substring */}
              <div className="item-actions">
                <button onClick={() => handleEdit(blog)}>Edit</button>
                <button onClick={() => handleDelete(blog.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsManager;
