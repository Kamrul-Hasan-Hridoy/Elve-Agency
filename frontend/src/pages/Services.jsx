import React, { useEffect, useState } from "react";
import { getImageUrl } from "../utils/imageLoader"; // Make sure this utility exists

const Service = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch services
        const servicesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/services`);
        if (!servicesResponse.ok) {
          throw new Error(`HTTP error! status: ${servicesResponse.status}`);
        }
        const servicesData = await servicesResponse.json();
        setServices(servicesData);

        // Fetch testimonials
        const testimonialsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/testimonials`);
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();
          setTestimonials(testimonialsData);
        }

        // Fetch FAQs
        const faqsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/faqs`);
        if (faqsResponse.ok) {
          const faqsData = await faqsResponse.json();
          setFaqs(faqsData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      {/* Services Banner */}
      <section className="services-banner">
        <h2>
          Services
          <br />
          We Provide
        </h2>
      </section>

      {/* Services Detail */}
      <section className="services-detail-section">
        {services.map((service, index) => (
          <div className="service-box" key={index}>
            <div className="service-text">
              <div className="icon-title">
                <img src={getImageUrl(service.icon)} alt={service.title} />
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
              <img 
                src={getImageUrl(service.image)} 
                alt={service.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getImageUrl('/placeholder.png');
                }}
              />
            </div>
          </div>
        ))}
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
                <img 
                  src={getImageUrl(t.img)} 
                  alt={t.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getImageUrl('/placeholder.png');
                  }}
                />
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
          {faqs.map((faq, i) => (
            <div className={`faq-item ${faq.open ? "open" : ""}`} key={i}>
              <button className="faq-question">
                {faq.question}
                <span className="icon">{faq.open ? "-" : "+"}</span>
              </button>
              {faq.answer && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Service;s