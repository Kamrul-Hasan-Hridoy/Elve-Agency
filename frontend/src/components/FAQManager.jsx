import React, { useState, useEffect } from "react";

const FAQManager = ({ setMessage }) => {
  const [faqs, setFaqs] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    open: false
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/faqs`);
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setMessage({ text: "Failed to fetch FAQs", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/faqs`;
      const method = editingFaq ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingFaq ? {...formData, id: editingFaq.id} : formData),
      });

      if (response.ok) {
        setMessage({ text: `FAQ ${editingFaq ? 'updated' : 'added'} successfully`, type: "success" });
        resetForm();
        fetchFaqs();
      } else {
        setMessage({ text: "Failed to save FAQ", type: "error" });
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      setMessage({ text: "Failed to save FAQ", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/faqs?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ text: "FAQ deleted successfully", type: "success" });
        fetchFaqs();
      } else {
        setMessage({ text: "Failed to delete FAQ", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      setMessage({ text: "Failed to delete FAQ", type: "error" });
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      open: faq.open
    });
  };

  const resetForm = () => {
    setEditingFaq(null);
    setIsAdding(false);
    setFormData({
      question: "",
      answer: "",
      open: false
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div>
      <h2>FAQ Manager</h2>
      
      <button 
        onClick={() => setIsAdding(true)} 
        className="add-btn"
        style={{marginBottom: '20px'}}
      >
        Add New FAQ
      </button>

      {(isAdding || editingFaq) && (
        <div className="form-container" style={{marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px'}}>
          <h3>{editingFaq ? 'Edit' : 'Add'} FAQ</h3>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '10px'}}>
              <label>Question: </label>
              <input 
                type="text" 
                name="question" 
                value={formData.question} 
                onChange={handleChange} 
                required 
                style={{width: '100%'}}
              />
            </div>
            <div style={{marginBottom: '10px'}}>
              <label>Answer: </label>
              <textarea 
                name="answer" 
                value={formData.answer} 
                onChange={handleChange} 
                required 
                style={{width: '100%', minHeight: '100px'}}
              />
            </div>
            <div style={{marginBottom: '10px'}}>
              <label>
                <input 
                  type="checkbox" 
                  name="open" 
                  checked={formData.open} 
                  onChange={handleChange} 
                />
                Open by default
              </label>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={resetForm} style={{marginLeft: '10px'}}>Cancel</button>
          </form>
        </div>
      )}

      <div className="faqs-list">
        {faqs.map(faq => (
          <div key={faq.id} style={{marginBottom: "20px", padding: "15px", border: "1px solid #eee", borderRadius: "5px"}}>
            <div style={{marginBottom: '10px'}}>
              <strong>Q: {faq.question}</strong>
            </div>
            <div style={{marginBottom: '10px'}}>
              <strong>A:</strong> {faq.answer}
            </div>
            <div>
              <span>Open by default: {faq.open ? 'Yes' : 'No'}</span>
            </div>
            <div style={{marginTop: '10px'}}>
              <button onClick={() => handleEdit(faq)} style={{marginRight: '10px'}}>Edit</button>
              <button onClick={() => handleDelete(faq.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQManager;