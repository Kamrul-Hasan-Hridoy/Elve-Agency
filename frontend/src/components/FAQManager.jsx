import React, { useState, useEffect } from "react";
import './FAQManager.css'; 

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
  }, [activeTab]);

  useEffect(() => {
    // Update stats whenever data changes
    setStats({
      answered: faqs.length,
      pending: submittedQuestions.length,
      total: faqs.length + submittedQuestions.length
    });
  }, [faqs, submittedQuestions]);

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

  const fetchSubmittedQuestions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/submitted-questions`);
      const data = await response.json();
      setSubmittedQuestions(data);
    } catch (error) {
      console.error("Error fetching submitted questions:", error);
      setMessage({ text: "Failed to fetch submitted questions", type: "error" });
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

  const handleAnswerSubmit = async (questionId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/admin/answer-question/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: answerText }),
      });

      if (response.ok) {
        setMessage({ text: "Question answered successfully", type: "success" });
        setAnsweringQuestion(null);
        setAnswerText("");
        fetchSubmittedQuestions();
        fetchFaqs();
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
    <div className="faq-admin-container">
      <div className="faq-admin-header">
        <h1><i className="fas fa-question-circle"></i> FAQ Management</h1>
      </div>
      
      <div className="faq-stats-container">
        <div className="faq-stat-card answered">
          <div className="faq-stat-icon"><i className="fas fa-check-circle"></i></div>
          <div className="faq-stat-value">{stats.answered}</div>
          <div className="faq-stat-label">Answered Questions</div>
        </div>
        
        <div className="faq-stat-card pending">
          <div className="faq-stat-icon"><i className="fas fa-clock"></i></div>
          <div className="faq-stat-value">{stats.pending}</div>
          <div className="faq-stat-label">Pending Questions</div>
        </div>
        
        <div className="faq-stat-card total">
          <div className="faq-stat-icon"><i className="fas fa-question-circle"></i></div>
          <div className="faq-stat-value">{stats.total}</div>
          <div className="faq-stat-label">Total Questions</div>
        </div>
      </div>
      
      <div className="faq-tabs-container">
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
          <i className="fas fa-clock"></i> Submitted Questions
        </button>
      </div>
      
      <div className="faq-content-area">
        {activeTab === "answered" && (
          <>
            <button 
              onClick={() => setIsAdding(true)} 
              className="faq-add-btn"
            >
              <i className="fas fa-plus-circle"></i> Add New FAQ
            </button>

            {(isAdding || editingFaq) && (
              <div className="faq-form-container">
                <h3><i className="fas fa-plus-circle"></i> {editingFaq ? 'Edit' : 'Add'} FAQ</h3>
                <form onSubmit={handleSubmit} className="faq-form">
                  <div className="form-group">
                    <label>Question:</label>
                    <input 
                      type="text" 
                      name="question" 
                      value={formData.question} 
                      onChange={handleChange} 
                      required 
                      placeholder="Enter the question"
                    />
                  </div>
                  <div className="form-group">
                    <label>Answer:</label>
                    <textarea 
                      name="answer" 
                      value={formData.answer} 
                      onChange={handleChange} 
                      required 
                      placeholder="Enter the answer"
                      rows="5"
                    />
                  </div>
                  <div className="checkbox-group">
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
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      <i className="fas fa-save"></i> Save FAQ
                    </button>
                    <button type="button" onClick={resetForm} className="cancel-btn">
                      <i className="fas fa-times"></i> Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="faq-list">
              {faqs.length === 0 ? (
                <div className="faq-empty-state">
                  <i className="fas fa-inbox"></i>
                  <h3>No FAQs Yet</h3>
                  <p>Get started by adding your first frequently asked question.</p>
                </div>
              ) : (
                faqs.map(faq => (
                  <div key={faq.id} className="faq-item">
                    <div className="faq-question">
                      <i className="fas fa-question"></i> {faq.question}
                    </div>
                    <div className="faq-answer">{faq.answer}</div>
                    <div className="faq-meta">
                      <span>Status: {faq.open ? 'Open by default' : 'Closed by default'}</span>
                      <div className="faq-actions">
                        <button onClick={() => handleEdit(faq)} className="faq-btn edit">
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button onClick={() => handleDelete(faq.id)} className="faq-btn delete">
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        
        {activeTab === "submitted" && (
          <div className="submitted-questions">
            <h3><i className="fas fa-clock"></i> Submitted Questions</h3>
            {submittedQuestions.length === 0 ? (
              <div className="faq-empty-state">
                <i className="fas fa-check-circle"></i>
                <h3>No Pending Questions</h3>
                <p>All submitted questions have been answered.</p>
              </div>
            ) : (
              submittedQuestions.map(question => (
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
                    <span>Submitted: {new Date(question.created_at).toLocaleString()}</span>
                    
                    {answeringQuestion === question.id ? (
                      <div className="answer-form">
                        <textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Type your answer here..."
                          rows="4"
                        />
                        <div className="answer-form-buttons">
                          <button 
                            onClick={() => handleAnswerSubmit(question.id)} 
                            className="answer-form-btn submit"
                          >
                            <i className="fas fa-check"></i> Submit Answer
                          </button>
                          <button 
                            onClick={() => {
                              setAnsweringQuestion(null);
                              setAnswerText("");
                            }}
                            className="answer-form-btn cancel"
                          >
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setAnsweringQuestion(question.id);
                          setAnswerText("");
                        }}
                        className="faq-btn edit"
                      >
                        <i className="fas fa-reply"></i> Answer
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQManager;