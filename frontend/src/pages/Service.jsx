import React, { useState, useEffect } from "react";


const Service = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
const [openFaqId, setOpenFaqId] = useState(null);

const toggleFaq = (id) => {
  setOpenFaqId(prev => (prev === id ? null : id));
};


  const getImageUrl = (path) => {
    if (!path) return "";
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
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
                {}
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
              {}
              <img src={getImageUrl(service.image)} alt={service.title} />
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
                {}
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
  {faqs.map(faq => (
    <div key={faq.id} className={`faq-item ${openFaqId === faq.id ? "open" : ""}`}>
      <button className="faq-question" onClick={() => toggleFaq(faq.id)}>
        {faq.question}
        <span className="icon">{openFaqId === faq.id ? "-" : "+"}</span>
      </button>
      <div className="faq-answer">{faq.answer}</div>
    </div>
  ))}
</div>

      </div>
    </>
  );
};

export default Service;
