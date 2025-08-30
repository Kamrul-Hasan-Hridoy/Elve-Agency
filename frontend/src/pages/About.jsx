import React, { useState, useEffect } from "react";
import { getImageUrl } from "../utils/imageLoader";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Fetch About + Services + Testimonials
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch About Data
        const aboutRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/about`
        );
        if (!aboutRes.ok)
          throw new Error(`About API error: ${aboutRes.status}`);
        let aboutJson = await aboutRes.json();
        aboutJson = Array.isArray(aboutJson) ? aboutJson[0] : aboutJson;

        // Default structure (avoid crashes if API missing fields)
        const defaultData = {
          learnContainer: {
            heading: "Learn More\nAbout Us",
            videoImage: "/images/default-video.png",
          },
          storySection: {
            mainHeading: "Our Story",
            paragraphs: [],
            images: [],
          },
          coreValues: [],
          team: [],
          awards: [],
          faqs: [],
        };

        aboutJson = { ...defaultData, ...aboutJson };
        aboutJson.faqs = aboutJson.faqs.map((f) => ({ ...f, open: false }));

        setAboutData(aboutJson);

        // Fetch Services
        const servicesRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/services`
        );
        if (!servicesRes.ok)
          throw new Error(`Services API error: ${servicesRes.status}`);
        const servicesJson = await servicesRes.json();
        setServices(Array.isArray(servicesJson) ? servicesJson : []);

        // Fetch Testimonials
        const testiRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/testimonials`
        );
        if (!testiRes.ok)
          throw new Error(`Testimonials API error: ${testiRes.status}`);
        const testiJson = await testiRes.json();
        setTestimonials(Array.isArray(testiJson) ? testiJson : []);
      } catch (err) {
        console.error("Error fetching About page data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle FAQ open/close
  const toggleFaq = (index) => {
    setAboutData((prev) => {
      if (!prev) return prev;
      const updatedFaqs = prev.faqs.map((faq, i) =>
        i === index ? { ...faq, open: !faq.open } : faq
      );
      return { ...prev, faqs: updatedFaqs };
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!aboutData) return <div className="error">No about data found</div>;

  return (
    <>
      {/* Learn Section */}
      <div className="learn-container">
        <div className="learn-heading">
          <h1>
            {aboutData.learnContainer.heading.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i <
                  aboutData.learnContainer.heading.split("\n").length - 1 && (
                  <br />
                )}
              </React.Fragment>
            ))}
          </h1>
        </div>
        <div className="video-section">
          <div className="video-wrapper">
            <img
              src={getImageUrl(aboutData.learnContainer.videoImage)}
              alt="About Us Video"
            />
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="story-section">
        <div className="content-wrapper">
          <h1 className="main-heading">
            {aboutData.storySection.mainHeading.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i <
                  aboutData.storySection.mainHeading.split("\n").length - 1 && (
                  <br />
                )}
              </React.Fragment>
            ))}
          </h1>
          <div className="paragraphs">
            {aboutData.storySection.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="images">
            {aboutData.storySection.images.map((img, i) => (
              <img key={i} src={getImageUrl(img)} alt={`Story ${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
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

      {/* Team */}
      <section className="team-section">
        <h2 className="section-title">
          The people behind
          <br /> the progress
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

      {/* Services (from MongoDB API) */}
      <section className="service-sections">
        <h2 className="section-heading">
          What services <br /> we provide?
        </h2>
        <div className="service-grid">
          {services.map((service, i) => (
            <div className="service-card" key={i}>
              <div className="icon-box">
                <img src={getImageUrl(service.icon)} alt={service.title} />
              </div>
              <h3 className="service-heading">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials (from MongoDB API) */}
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
              <p className="testimonial-desc">"{t.desc}"</p>
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

      {/* Awards */}
      <section className="awards-section">
        <h2 className="section-title">
          Awards &
          <br />
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

      {/* FAQs */}
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
              <button className="faq-question" onClick={() => toggleFaq(i)}>
                {faq.question}
                <span className="icon">{faq.open ? "-" : "+"}</span>
              </button>
              {faq.open && faq.answer && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default About;