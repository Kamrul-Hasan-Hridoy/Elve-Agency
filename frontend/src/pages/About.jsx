import React, { useState, useEffect } from "react";
import { getImageUrl } from "../utils/imageLoader";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionEmail, setQuestionEmail] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [openFaqId, setOpenFaqId] = useState(null);

  // Fetch About + Services + Testimonials + FAQs
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
        };

        aboutJson = { ...defaultData, ...aboutJson };
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

        // Fetch FAQs from the shared API
        const faqsRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/faqs`
        );
        if (faqsRes.ok) {
          const faqsJson = await faqsRes.json();
          setFaqs(Array.isArray(faqsJson) ? faqsJson : []);
        }
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
  const toggleFaq = (id) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submit-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionText,
          email: questionEmail
        })
      });

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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!aboutData) return <div className="error">No about data found</div>;

  return (
    <>
      {/* Learn Section */}
<div className="learn-container">
  <div className="shape">
   <img
  src={getImageUrl(aboutData.learnContainer?.shapeImage || "shape.png")}
  alt="shape"
  onError={(e) => {
    e.target.src = `${import.meta.env.VITE_API_BASE_URL}/images/shape.png`;
  }}
/>

  </div>
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

      {/* FAQs from shared API */}
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
          {faqs.map(faq => (
            <div key={faq.id} className={`faq-item ${openFaqId === faq.id ? "open" : ""}`}>
              <button className="faq-question" onClick={() => toggleFaq(faq.id)}>
                {faq.question}
                <span className="icon">{openFaqId === faq.id ? "-" : "+"}</span>
              </button>
              {openFaqId === faq.id && (
                <div className="faq-answer">{faq.answer}</div>
              )}
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
                  <button type="button" onClick={() => setShowQuestionForm(false)}>Cancel</button>
                </div>
                {questionSubmitted && (
                  <p className="success-message">Thank you! Your question has been submitted.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;