
import React, { useState, useEffect } from "react";


const Pricing = () => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [clients, setClients] = useState([]);
  const [faqs, setFaqs] = useState([]);
const [openFaqId, setOpenFaqId] = useState(null);

const toggleFaq = (id) => {
  setOpenFaqId(prev => (prev === id ? null : id));
};

  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return "";
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricingRes, testimonialsRes, clientsRes, faqsRes] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pricing`),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/testimonials`),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/clients`),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/faqs`),
          ]);

        const pricingData = await pricingRes.json();
        const testimonialsData = await testimonialsRes.json();
        const clientsData = await clientsRes.json();
        const faqsData = await faqsRes.json();

        setPricingPlans(pricingData);
        setTestimonials(testimonialsData);
        setClients(clientsData);
        setFaqs(faqsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Pricing section starts */}
      <section className="pricing-section">
        <h1 className="title">
          Flexible pricing <br />
          for every need
        </h1>

        <div className="pricing-cards">
          {pricingPlans.map((plan) => (
            <div className="card" key={plan.id}>
              <div className="card-header">
                <h3>{plan.name}</h3>
                <span className="badge">{plan.badge}</span>
              </div>
              <p className="pricing-desc">{plan.description}</p>
              <div className="price">
                {plan.price}
                <span>{plan.price_period}</span>
              </div>
              <button className="price-btn">Get Started →</button>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="cta-box">
          <p>Want a unique solution to meet your needs?</p>
          <div className="cta-btn">
            <button className="price-btns">Book a call →</button>
    <button
      className="price-btns"
      onClick={() => window.location.href = "/contact"} // Redirect to contact page
    >
      Contact us →
    </button>
  </div>
</div>

      </section>
      {/* Pricing section ends */}

      {/* Testimonial section starts */}
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
          {testimonials.map((testimonial) => (
            <div className="testimonial-card" key={testimonial.id}>
              <p className="testimonial-desc">{testimonial.desc}</p>
              <div className="user">
                <div className="info">
                  <h3>{testimonial.name}</h3>
                  <h6>{testimonial.role}</h6>
                </div>
                {}
                <img src={getImageUrl(testimonial.img)} alt={testimonial.name} />
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Testimonial section ends */}

      {/* Latest client section starts */}
      <section className="clients-section">
        <h2 className="clients-heading">Our latest Clients</h2>
        <div className="clients-grid">
          {clients.map((client) => (
            <div className="client-card" key={client.id}>
              {}
              <img src={getImageUrl(client.logo)} alt={client.name || "Client"} />
            </div>
          ))}
        </div>
      </section>
      {/* Latest client section ends */}

      {/* FAQ section starts */}
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
      {/* FAQ section ends */}
    </>
  );
};

export default Pricing;
