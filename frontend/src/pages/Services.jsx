import React, { useEffect, useState } from "react";

const Service = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    // Fetch services
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Error fetching services:", err));

    // Fetch testimonials
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error("Error fetching testimonials:", err));

    // Fetch FAQs
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/faqs`)
      .then(res => res.json())
      .then(data => setFaqs(data))
      .catch(err => console.error("Error fetching FAQs:", err));
  }, []);

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
                <img src={service.icon} alt={service.title} />
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
              <img src={service.image} alt={service.title} />
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
                <img src={t.img} alt={t.name} />
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

export default Service;