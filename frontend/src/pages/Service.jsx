import React, { useState, useEffect } from "react";

const Service = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionEmail, setQuestionEmail] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const getImageUrl = (path) => {
    if (!path) return "";
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  const fallbackShape = `${import.meta.env.VITE_API_BASE_URL}/images/shape.png`;

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/submit-question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: questionText,
            email: questionEmail,
          }),
        }
      );

      if (response.ok) {
        setQuestionSubmitted(true);
        setQuestionText("");
        setQuestionEmail("");
        setTimeout(() => {
          setShowQuestionForm(false);
          setQuestionSubmitted(false);
        }, 3000);
      } else {
        console.error("Failed to submit question");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  useEffect(() => {
    // Fetch services
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services`)
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Error fetching services:", err));

    // Fetch testimonials
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => setTestimonials(data))
      .catch((err) => console.error("Error fetching testimonials:", err));

    // Fetch FAQs
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/faqs`)
      .then((res) => res.json())
      .then((data) => setFaqs(data))
      .catch((err) => console.error("Error fetching FAQs:", err));
  }, []);

  return (
    <>
      {/* Services Section with Shape */}
      <section className="services-section">
        {/* Shape Image */}
        <div className="shape">
          <img
            src={fallbackShape}
            alt="shape"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackShape;
            }}
          />
        </div>

        {/* Services Banner */}
        <div className="services-banner">
          <h2>
            Services
            <br />
            We Provide
          </h2>
        </div>

        {/* Services Detail */}
        <div className="services-detail-section">
          {services.map((service, index) => (
            <div className="service-box" key={index}>
              <div className="service-text">
                <div className="icon-title">
                  { <img src={getImageUrl(service.icon)} alt={service.title} /> }
                  <h2>{service.title}</h2>
                </div>
                <p>{service.desc}</p>
                <div className="brand-right">
                  <ul>
                    {service.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="service-image">
                <img src={getImageUrl(service.image)} alt={service.title} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="testimonial-content">
          <h2>
            Hear it from <br /> our clients
          </h2>
        </div>
        <div className="arrows">
          <button className="arrow-btn">&larr;</button>
          <button className="arrow-btn">&rarr;</button>
        </div>
        <div className="testimonial-container">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <p className="testimonial-desc">{t.desc}</p>
              <div className="user">
                <div className="info">
                  <h3>{t.name}</h3>
                  <h6>{t.role}</h6>
                </div>
                <img src={getImageUrl(t.img)} alt={t.name} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="faq-title">
          <h1>
            Frequently
            <br />
            Asked
            <br /> Question
          </h1>
        </div>
        <div className="faq-container">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`faq-item ${openFaqId === faq.id ? "open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFaq(faq.id)}
              >
                {faq.question}
                <span className="icon">{openFaqId === faq.id ? "-" : "+"}</span>
              </button>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}

          {/* Question Submission Form */}
          <div className="question-submission">
            {!showQuestionForm ? (
              <button
                className="ask-question-btn"
                onClick={() => setShowQuestionForm(true)}
              >
                Can't find your question? Ask us!
              </button>
            ) : (
              <form className="question-form" onSubmit={handleQuestionSubmit}>
                <h3>Ask Your Question</h3>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Type your question here..."
                  required
                  rows="4"
                />
                <input
                  type="email"
                  value={questionEmail}
                  onChange={(e) => setQuestionEmail(e.target.value)}
                  placeholder="Your email (optional)"
                />
                <div className="question-form-buttons">
                  <button type="submit">Submit Question</button>
                  <button
                    type="button"
                    onClick={() => setShowQuestionForm(false)}
                  >
                    Cancel
                  </button>
                </div>
                {questionSubmitted && (
                  <p className="success-message">
                    Thank you! Your question has been submitted.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Service;
