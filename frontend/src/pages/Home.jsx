import React, { useEffect, useState } from "react";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return "";
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/home`)
      .then((res) => res.json())
      .then((data) => {
        setHomeData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching home data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!homeData) {
    return <div className="error">Failed to load data</div>;
  }

  return (
    <>
      <section className="container">
        <div className="header-content">
          <h1 dangerouslySetInnerHTML={{ __html: homeData.header.title }} />
          <p>{homeData.header.description}</p>
        </div>

        <div className="banner-container">
          <div className="video-box">
            <img src={getImageUrl(homeData.banner.videoThumb)} alt="video-thumb" />
            <div className="play-button">▶</div>
          </div>
          <div className="banners">
            {homeData.banner.statistics.map((stat, index) => (
              <div className="banner" key={index}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="banner-img">
        <img src={getImageUrl(homeData.bannerImage)} alt="" />
      </div>

      <section className="service-section">
        <h2 
          className="section-title" 
          dangerouslySetInnerHTML={{ __html: homeData.serviceSection.title }} 
        />
      </section>

      <div className="blog-post">
        {homeData.projects.map((project) => (
          <div className="blog-title" key={project.id}>
            <div className="project-about">
              <img src={getImageUrl(project.image)} alt={project.title} />
            </div>
            <div className="blog-content">
              <button className="pro-btn">
                <a href="#">{project.category}</a>
              </button>
              <h2 className="blog-sub">{project.title}</h2>
              <p>
                {project.tags.map((tag, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && " . "}
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

      <div className="about-container">
        <div className="about-logo">
          <img src={getImageUrl(homeData.about.logo)} alt="About Logo" />
        </div>
        <h1 className="about-content">{homeData.about.title}</h1>
        <p className="about-desc">{homeData.about.description}</p>
        <div className="buttons">
          {homeData.about.buttons.map((button, index) => (
            <button className="project-btn" key={index}>
              <a href={button.link}>{button.text}</a>
            </button>
          ))}
        </div>
      </div>

      <section className="service-sections">
        <h2 className="section-heading">
          What services <br /> we provide?
        </h2>
        <div className="service-grid">
          {homeData.services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="icon-box">
                <img src={getImageUrl(service.icon)} alt={service.title} />
              </div>
              <h3 className="service-heading">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

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
          {homeData.testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <p className="testimonial-desc">{testimonial.description}</p>
              <div className="user">
                <div className="info">
                  <h3>{testimonial.name}</h3>
                  <h6>{testimonial.role}</h6>
                </div>
                <img src={getImageUrl(testimonial.image)} alt={testimonial.name} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-section">
        <h1 
          className="title" 
          dangerouslySetInnerHTML={{ __html: homeData.pricing.title }} 
        />

        <div className="pricing-cards">
          {homeData.pricing.plans.map((plan, index) => (
            <div className="card" key={index}>
              <div className="card-header">
                <h3>{plan.name}</h3>
                <span className="badge">{plan.badge}</span>
              </div>
              <p className="pricing-desc">{plan.description}</p>
              <div className="price">
                {plan.price}<span>{plan.period}</span>
              </div>
              <button className="price-btn">Get Started →</button>
              <ul>
                {plan.features.map((feature, i) => (
                  <li key={i}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="cta-box">
          <p>{homeData.pricing.cta.text}</p>
          <div className="cta-btn">
            {homeData.pricing.cta.buttons.map((button, index) => (
              <button className="price-btns" key={index}>
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="clients-section">
        <h2 className="clients-heading">Our latest Clients</h2>
        <div className="clients-grid">
          {homeData.clients.map((client, index) => (
            <div className="client-card" key={index}>
              <img src={getImageUrl(client.logo)} alt={`Client ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

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
          {homeData.faqs.map((faq, index) => (
            <div className={`faq-item ${faq.open ? "open" : ""}`} key={index}>
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

export default Home;
