import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [clients, setClients] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('//')) {
      return path;
    }
    return `${import.meta.env.VITE_API_BASE_URL}/images/${path}`;
  };

  const toggleFaq = (id) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch home data
        const homeRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/home`);
        const homeData = await homeRes.json();
        setHomeData(homeData);

        // Fetch all other data in parallel
        const [servicesRes, projectsRes, testimonialsRes, clientsRes, faqsRes, pricingRes] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services`),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/testimonials`),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/clients`),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/faqs`),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pricing`)
          ]);

        const servicesData = await servicesRes.json();
        const projectsData = await projectsRes.json();
        const testimonialsData = await testimonialsRes.json();
        const clientsData = await clientsRes.json();
        const faqsData = await faqsRes.json();
        const pricingData = await pricingRes.json();

        setServices(servicesData);
        setProjects(projectsData);
        setTestimonials(testimonialsData);
        setClients(clientsData);
        setFaqs(faqsData);
        setPricing(pricingData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!homeData) {
    return (
      <div className="error-container">
        <h2>Failed to load data</h2>
        <p>Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header Section */}
      <section className="hero-section">
        <div className="container">
          <div className="header-content">
            <h1 dangerouslySetInnerHTML={{ __html: homeData.header?.title || "" }} />
            <p>{homeData.header?.description || ""}</p>
          </div>

          <div className="banner-container">
            <div className="video-box">
              <img 
                src={getImageUrl(homeData.banner?.videoThumb)} 
                alt="video-thumb" 
                className="video-thumb"
              />
              <div className="play-button">▶</div>
            </div>
            <div className="banners">
              {homeData.banner?.statistics?.map((stat, index) => (
                <div className="banner" key={index}>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Banner Image */}
      <div className="banner-img">
        <img 
          src={getImageUrl(homeData.bannerImage)} 
          alt="Banner" 
          className="main-banner"
        />
      </div>

      {/* Service Section Title */}
      <section className="service-section">
        <div className="container">
          <h2 
            className="section-title" 
            dangerouslySetInnerHTML={{ __html: homeData.serviceSection?.title || "" }} 
          />
        </div>
      </section>

      {/* Projects Section */}
      <div className="blog-post container">
        {projects.map((project) => (
          <div className="blog-title" key={project.id || project._id}>
            <div className="project-about">
              <img 
                src={getImageUrl(project.image)} 
                alt={project.title} 
                className="project-image"
              />
            </div>
            <div className="blog-content">
              <button className="pro-btn">
                <a href="#">{project.category}</a>
              </button>
              <h2 className="blog-sub">{project.title}</h2>
              <p className="tags">
                {project.tags?.map((tag, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && " • "}
                    <strong>{tag}</strong>
                  </React.Fragment>
                ))}
              </p>
              <p className="blog-desc">{project.description}</p>
              <button className="project-btn">
                <a href="#">View Project →</a>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="about-container">
        <div className="about-logo">
          <img 
            src={getImageUrl(homeData.about?.logo)} 
            alt="About Logo" 
            className="logo-img"
          />
        </div>
        <h1 className="about-content">{homeData.about?.title || ""}</h1>
        <p className="about-desc">{homeData.about?.description || ""}</p>
        <div className="buttons">
          {homeData.about?.buttons?.map((button, index) => (
            <button className="project-btn" key={index}>
              <a href={button.link}>{button.text}</a>
            </button>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section className="service-sections">
        <div className="container">
          <h2 className="section-heading">
            What services <br /> we provide?
          </h2>
          <div className="service-grid">
            {services.map((service, index) => (
              <div className="service-card" key={service.id || service._id || index}>
                <div className="icon-box">
                  <img 
                    src={getImageUrl(service.icon)} 
                    alt={service.title} 
                    className="service-icon"
                  />
                </div>
                <h3 className="service-heading">{service.title}</h3>
                <p className="service-desc">{service.desc || service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonial-section">
        <div className="container">
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
              <div className="testimonial-card" key={testimonial.id || testimonial._id}>
                <p className="testimonial-desc">{testimonial.desc || testimonial.description}</p>
                <div className="user">
                  <div className="info">
                    <h3>{testimonial.name}</h3>
                    <h6>{testimonial.role}</h6>
                  </div>
                  <img 
                    src={getImageUrl(testimonial.img || testimonial.image)} 
                    alt={testimonial.name} 
                    className="user-avatar"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <h1 
            className="title" 
            dangerouslySetInnerHTML={{ __html: homeData.pricing?.title || "Flexible pricing <br /> for every need" }} 
          />

          <div className="pricing-cards">
            {pricing.map((plan) => (
              <div className="card" key={plan.id || plan._id}>
                <div className="card-header">
                  <h3>{plan.name}</h3>
                  <span className="badge">{plan.badge}</span>
                </div>
                <p className="pricing-desc">{plan.description}</p>
                <div className="price">
                  {plan.price}<span>{plan.price_period || plan.period}</span>
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
            <p>{homeData.pricing?.cta?.text || "Want a unique solution to meet your needs?"}</p>
            <div className="cta-btn">
              {homeData.pricing?.cta?.buttons ? (
                homeData.pricing.cta.buttons.map((button, index) => (
                  <button className="price-btns" key={index}>
                    {button.text}
                  </button>
                ))
              ) : (
                <>
                  <button className="price-btns">Book a call →</button>
                  <button className="price-btns">Contact us →</button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="clients-section">
        <div className="container">
          <h2 className="clients-heading">Our latest Clients</h2>
          <div className="clients-grid">
            {clients.map((client) => (
              <div className="client-card" key={client.id || client._id}>
                <img 
                  src={getImageUrl(client.logo)} 
                  alt={client.name || `Client ${client.id}`} 
                  className="client-logo"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="container">
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
              <div key={faq.id || faq._id} className={`faq-item ${openFaqId === (faq.id || faq._id) ? "open" : ""}`}>
                <button className="faq-question" onClick={() => toggleFaq(faq.id || faq._id)}>
                  {faq.question}
                  <span className="icon">{openFaqId === (faq.id || faq._id) ? "-" : "+"}</span>
                </button>
                {openFaqId === (faq.id || faq._id) && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;