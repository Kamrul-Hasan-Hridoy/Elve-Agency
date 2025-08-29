import React, { useState, useEffect } from "react";
import { getImageUrl } from "../utils/imageLoader";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/about`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle the case where data might be an array
        let aboutData = Array.isArray(data) ? data[0] : data;
        
        // Ensure all expected properties exist
        const defaultData = {
          learnContainer: {
            heading: "Learn More\nAbout Us",
            videoImage: "/images/default-video.png"
          },
          storySection: {
            mainHeading: "Our Story",
            paragraphs: [],
            images: []
          },
          coreValues: [],
          team: [],
          services: [],
          testimonials: [],
          awards: [],
          faqs: []
        };
        
        // Merge with default data to ensure all properties exist
        aboutData = {...defaultData, ...aboutData};
        
        setAboutData(aboutData);
      } catch (err) {
        console.error("Error fetching about data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error loading about data: {error}</div>;
  }

  if (!aboutData) {
    return <div className="error">No about data found</div>;
  }

  return (
    <>
      <div className="learn-container">
        <div className="learn-heading">
          <h1>
            {aboutData.learnContainer.heading.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < aboutData.learnContainer.heading.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
        </div>

        <div className="video-section">
          <div className="video-wrapper">
            <img src={getImageUrl(aboutData.learnContainer.videoImage)} alt="About Us Video" />
          </div>
        </div>
      </div>

      <section className="story-section">
        <div className="content-wrapper">
          <h1 className="main-heading">
            {aboutData.storySection.mainHeading.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < aboutData.storySection.mainHeading.split("\n").length - 1 && <br />}
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
              <img key={i} src={getImageUrl(image)} alt={`Story image ${i+1}`} />
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
                <img src={getImageUrl(value.icon)} alt={value.title} />
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
              <img src={getImageUrl(member.image)} alt={member.name} />
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
          {aboutData.testimonials.map((testimonial, i) => (
            <div className="testimonial-card" key={i}>
              <p className="testimonial-desc">"{testimonial.description}"</p>
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

      <section className="awards-section">
        <h2 className="section-title">
          Awards &<br />
          recognition
        </h2>
        <div className="awards-grid">
          {aboutData.awards.map((award, i) => (
            <div className="award-card" key={i}>
              <img src={getImageUrl(award.image)} alt={award.title} />
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