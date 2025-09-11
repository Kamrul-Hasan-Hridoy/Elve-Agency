import React, { useState, useEffect } from "react";
import "./FAQManager.css";

const FAQManager = ({ setMessage }) => {
  const [faqs, setFaqs] = useState([]);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("answered");
  const [editingFaq, setEditingFaq] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [answeringQuestion, setAnsweringQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    open: false
  });
  const [stats, setStats] = useState({
    answered: 0,
    pending: 0,
    total: 0
  });

  useEffect(() => {
    if (activeTab === "answered") {
      fetchFaqs();
    } else {
      fetchSubmittedQuestions();
    }
    fetchStats();
  }, [activeTab]);

  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/faqs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setMessage({ text: "Failed to fetch FAQs", type: "error" });
    }
  };

  const fetchSubmittedQuestions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/submitted-questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSubmittedQuestions(data);
    } catch (error) {
      console.error("Error fetching submitted questions:", error);
      setMessage({ text: "Failed to fetch submitted questions", type: "error" });
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [faqsRes, questionsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/faqs`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/submitted-questions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);
      
      const faqsData = await faqsRes.json();
      const questionsData = await questionsRes.json();
      
      setStats({
        answered: faqsData.length,
        pending: questionsData.filter(q => !q.answered).length,
        total: faqsData.length + questionsData.length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/faqs`;
      const method = editingFaq ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingFaq ? {...formData, id: editingFaq.id} : formData),
      });

      if (response.ok) {
        setMessage({ text: `FAQ ${editingFaq ? 'updated' : 'added'} successfully`, type: "success" });
        resetForm();
        fetchFaqs();
        fetchStats();
      } else {
        setMessage({ text: "Failed to save FAQ", type: "error" });
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      setMessage({ text: "Failed to save FAQ", type: "error" });
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/answer-question/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ answer: answerText }),
      });

      if (response.ok) {
        setMessage({ text: "Question answered successfully", type: "success" });
        setAnsweringQuestion(null);
        setAnswerText("");
        fetchSubmittedQuestions();
        fetchFaqs();
        fetchStats();
      } else {
        setMessage({ text: "Failed to answer question", type: "error" });
      }
    } catch (error) {
      console.error("Error answering question:", error);
      setMessage({ text: "Failed to answer question", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/faqs?id=${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage({ text: "FAQ deleted successfully", type: "success" });
        fetchFaqs();
        fetchStats();
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1><i className="fas fa-question-circle"></i> FAQ Admin Panel</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
      
      <div className="admin-tabs">
        <button><i className="fas fa-home"></i> Dashboard</button>
        <button><i className="fas fa-services"></i> Services</button>
        <button><i className="fas fa-project-diagram"></i> Projects</button>
        <button className="active"><i className="fas fa-question-circle"></i> FAQs</button>
        <button><i className="fas fa-comment-alt"></i> Testimonials</button>
        <button><i className="fas fa-users"></i> Clients</button>
        <button><i className="fas fa-cog"></i> Settings</button>
        <button><i className="fas fa-envelope"></i> Messages <span className="unread-badge">3</span></button>
      </div>
      <Link to="/admin/faqs" className="admin-tabs-button">
  <i className="fas fa-question-circle"></i> FAQs
</Link>
      <div className="admin-content">
        <div className="faq-manager">
          <h2><i className="fas fa-cogs"></i> FAQ Management</h2>
          
          <div className="faq-stats">
            <div className="stat-card answered">
              <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
              <div className="stat-value">{stats.answered}</div>
              <div className="stat-label">Answered Questions</div>
            </div>
            
            <div className="stat-card pending">
              <div className="stat-icon"><i className="fas fa-clock"></i></div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending Questions</div>
            </div>
            
            <div className="stat-card total">
              <div className="stat-icon"><i className="fas fa-question-circle"></i></div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Questions</div>
            </div>
          </div>
          
          <div className="faq-tabs">
            <button 
              className={`faq-tab ${activeTab === "answered" ? "active" : ""}`}
              onClick={() => setActiveTab("answered")}
            >
              <i className="fas fa-list"></i> Answered FAQs
            </button>
            <button 
              className={`faq-tab ${activeTab === "submitted" ? "active" : ""}`}
              onClick={() => setActiveTab("submitted")}
            >
              <i className="fas fa-clock"></i> Pending Questions
            </button>
            <button 
              className={`faq-tab ${isAdding ? "active" : ""}`}
              onClick={() => {
                setActiveTab("add");
                setIsAdding(true);
              }}
            >
              <i className="fas fa-plus-circle"></i> Add New FAQ
            </button>
          </div>
          
          {activeTab === "answered" && (
            <div className="faq-content">
              <div className="faq-list">
                {faqs.map(faq => (
                  <div key={faq.id} className="faq-item">
                    <div className="faq-question">
                      <i className="fas fa-question"></i> {faq.question}
                    </div>
                    <div className="faq-answer">{faq.answer}</div>
                    <div className="faq-meta">
                      <span>Last updated: {new Date().toLocaleDateString()}</span>
                      <div className="faq-actions">
                        <button className="faq-btn edit" onClick={() => handleEdit(faq)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="faq-btn delete" onClick={() => handleDelete(faq.id)}>
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "submitted" && (
            <div className="faq-content">
              <div className="faq-list">
                {submittedQuestions.map(question => (
                  <div key={question.id} className="faq-item">
                    <div className="faq-question">
                      <i className="fas fa-question"></i> {question.question}
                    </div>
                    {question.email && (
                      <div className="faq-answer">
                        <strong>From:</strong> {question.email}
                      </div>
                    )}
                    <div className="faq-meta">
                      <span>Submitted: {new Date(question.created_at).toLocaleDateString()}</span>
                      <div className="faq-actions">
                        {answeringQuestion === question.id ? (
                          <div className="answer-form">
                            <textarea
                              value={answerText}
                              onChange={(e) => setAnswerText(e.target.value)}
                              placeholder="Type your answer here..."
                              rows="4"
                            />
                            <div className="form-actions">
                              <button 
                                className="submit-btn"
                                onClick={() => handleAnswerSubmit(question.id)}
                              >
                                <i className="fas fa-check"></i> Submit Answer
                              </button>
                              <button 
                                className="cancel-btn"
                                onClick={() => {
                                  setAnsweringQuestion(null);
                                  setAnswerText("");
                                }}
                              >
                                <i className="fas fa-times"></i> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            className="faq-btn edit"
                            onClick={() => {
                              setAnsweringQuestion(question.id);
                              setAnswerText("");
                            }}
                          >
                            <i className="fas fa-reply"></i> Answer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(activeTab === "add" || editingFaq) && (
            <div className="faq-form">
              <h3>
                <i className="fas fa-plus-circle"></i> 
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              
              <div className="form-group">
                <label htmlFor="faq-question">Question</label>
                <input 
                  type="text" 
                  id="faq-question" 
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="Enter the question" 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="faq-answer">Answer</label>
                <textarea 
                  id="faq-answer" 
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  placeholder="Enter the answer" 
                  rows="6"
                ></textarea>
              </div>
              
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="faq-status" 
                  name="open"
                  checked={formData.open}
                  onChange={handleChange}
                />
                <label htmlFor="faq-status">Open by default</label>
              </div>
              
              <div className="form-actions">
                <button className="submit-btn" onClick={handleSubmit}>
                  <i className="fas fa-save"></i> 
                  {editingFaq ? "Update FAQ" : "Save FAQ"}
                </button>
                <button className="cancel-btn" onClick={resetForm}>
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQManager;