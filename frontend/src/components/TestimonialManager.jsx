import React, { useState, useEffect } from "react";

const TestimonialManager = ({ setMessage }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    desc: "",
    name: "",
    role: "",
    img: "/images/Ellipse 2.png"
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/testimonials`);
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setMessage({ text: "Failed to fetch testimonials", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/testimonials`;
      const method = editingTestimonial ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTestimonial ? {...formData, id: editingTestimonial.id} : formData),
      });

      if (response.ok) {
        setMessage({ text: `Testimonial ${editingTestimonial ? 'updated' : 'added'} successfully`, type: "success" });
        resetForm();
        fetchTestimonials();
      } else {
        setMessage({ text: "Failed to save testimonial", type: "error" });
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
      setMessage({ text: "Failed to save testimonial", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ text: "Testimonial deleted successfully", type: "success" });
        fetchTestimonials();
      } else {
        setMessage({ text: "Failed to delete testimonial", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      setMessage({ text: "Failed to delete testimonial", type: "error" });
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      desc: testimonial.desc,
      name: testimonial.name,
      role: testimonial.role,
      img: testimonial.img
    });
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setIsAdding(false);
    setFormData({
      desc: "",
      name: "",
      role: "",
      img: "/images/Ellipse 2.png"
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
      <h2>Testimonial Manager</h2>
      
      <button 
        onClick={() => setIsAdding(true)} 
        className="add-btn"
        style={{marginBottom: '20px'}}
      >
        Add New Testimonial
      </button>

      {(isAdding || editingTestimonial) && (
        <div className="form-container" style={{marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px'}}>
          <h3>{editingTestimonial ? 'Edit' : 'Add'} Testimonial</h3>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '10px'}}>
              <label>Description: </label>
              <textarea 
                name="desc" 
                value={formData.desc} 
                onChange={handleChange} 
                required 
                style={{width: '100%', minHeight: '100px'}}
              />
            </div>
            <div style={{marginBottom: '10px'}}>
              <label>Name: </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={{marginBottom: '10px'}}>
              <label>Role: </label>
              <input 
                type="text" 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={{marginBottom: '10px'}}>
              <label>Image URL: </label>
              <input 
                type="text" 
                name="img" 
                value={formData.img} 
                onChange={handleChange} 
              />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={resetForm} style={{marginLeft: '10px'}}>Cancel</button>
          </form>
        </div>
      )}

      <div className="testimonials-list">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} style={{marginBottom: "20px", padding: "15px", border: "1px solid #eee", borderRadius: "5px"}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
              <img src={testimonial.img} alt={testimonial.name} width={50} height={50} style={{borderRadius: '50%'}} />
              <div style={{marginLeft: '10px'}}>
                <strong>{testimonial.name}</strong> ({testimonial.role})
              </div>
            </div>
            <p>{testimonial.desc}</p>
            <div>
              <button onClick={() => handleEdit(testimonial)} style={{marginRight: '10px'}}>Edit</button>
              <button onClick={() => handleDelete(testimonial.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialManager;