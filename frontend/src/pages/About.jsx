import React, { useState, useEffect } from "react";

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  //prepend backend base URL
  const getImageUrl = (path) => `${import.meta.env.VITE_API_BASE_URL}${path}`;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/about`)
      .then((res) => res.json())
      .then((data) => setAboutData(data))
      .catch((err) => console.error("Error fetching about data:", err));
  }, []);

  if (!aboutData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="learn-container">
        <div className="learn-heading">
          <h1>
            {aboutData.learnContainer.heading.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < aboutData.learnContainer.heading.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
        </div>

        <div className="video-section">
          <div className="video-wrapper">
            {}
            <img src={getImageUrl(aboutData.learnContainer.videoImage)} alt="" />
          </div>
        </div>
      </div>

      <section className="story-section">
        <div className="content-wrapper">
          <h1 className="main-heading">
            {aboutData.storySection.mainHeading.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < aboutData.storySection.mainHeading.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <div className="paragraphs">
            {aboutData.storySection.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="images">
            {aboutData.storySection.images.map((image, i) => (
              <img key={i} src={getImageUrl(image)} alt="" />
            ))}
          </div>
        </div>
      </section>

      <section className="core-values-section">
        <h2 className="section-titles">Our core values</h2>

        <div className="values-container">
          {aboutData.coreValues.map((value, i) => (
            <div className="value-card" key={i}>
              <div className="icon-circle">
                {}
                <img src={getImageUrl(value.icon)} alt="" />
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2 className="section-title">
          The people behind
          <br />
          the progress
        </h2>

        <div className="team-grid">
          {aboutData.team.map((member, i) => (
            <div className="team-member" key={i}>
              {}
              <img src={getImageUrl(member.image)} alt="" />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="service-sections">
        <h2 className="section-heading">
          What services <br /> we provide?
        </h2>
        <div className="service-grid">
          {aboutData.services.map((service, i) => (
            <div className="service-card" key={i}>
              <div className="icon-box">
                {}
                <img src={getImageUrl(service.icon)} alt="" />
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
          {aboutData.testimonials.map((testimonial, i) => (
            <div className="testimonial-card" key={i}>
              <p className="testimonial-desc">"{testimonial.description}"</p>
              <div className="user">
                <div className="info">
                  <h3>{testimonial.name}</h3>
                  <h6>{testimonial.role}</h6>
                </div>
                {}
                <img src={getImageUrl(testimonial.image)} alt="" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="awards-section">
        <h2 className="section-title">
          Awards &<br />
          recognition
        </h2>

        <div className="awards-grid">
          {aboutData.awards.map((award, i) => (
            <div className="award-card" key={i}>
              {}
              <img src={getImageUrl(award.image)} alt="" />
              <p>{award.title}</p>
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
            <br />
            Question
          </h1>
        </div>

        <div className="faq-container">
          {aboutData.faqs.map((faq, i) => (
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

export default About;
