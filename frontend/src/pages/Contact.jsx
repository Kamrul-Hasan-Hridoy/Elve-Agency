import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to send message.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="contact-container">
        <h1>Connect With Us</h1>

        <div className="contact-card">
          <div className="contact-info">
            <h2>Contact info</h2>
            <p>
              <strong>ADDRESS</strong> 2972 Westheimer Rd. Santa Ana, Illinois
              85486
            </p>
            <p>
              <strong>PHONE</strong> +12 383 343 332 4580
            </p>
            <p>
              <strong>EMAIL</strong> info@evility.com
            </p>
          </div>

          <div className="contact-form">
            <h2>Get in touch</h2>
            {submitStatus && (
              <div className={`submit-status ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Full Name" 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <textarea 
                rows="4" 
                placeholder="Enter your Message..." 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send a message →'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <div className="faq-title">
          <h1>
            Frequently
            <br />
            Asked
            <br />
            Question
          </h1>
        </div>

        <div className="faq-container">
          <div className="faq-item open">
            <button className="faq-question">
              How do I contact you for inquiries or collaborations?
              <span className="icon">-</span>
            </button>
            <div className="faq-answer">
              Best the average blind and that accordingly pointing, out the to
              bold, good my believed the rattling experiments friends couldn't
              scolded unable to many line may their times, propitiously is
              themselves, was discipline the be the seen escape.
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question">
              What services does your digital agency offer?
              <span className="icon">+</span>
            </button>
          </div>

          <div className="faq-item">
            <button className="faq-question">
              How long does it take to build a website?
              <span className="icon">+</span>
            </button>
          </div>

          <div className="faq-item">
            <button className="faq-question">
              What is included in your digital marketing services?
              <span className="icon">+</span>
            </button>
          </div>

          <div className="faq-item">
            <button className="faq-question">
              Can you create content for our social media accounts?
              <span className="icon">+</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;