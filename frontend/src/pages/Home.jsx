// import React, { useState, useEffect } from "react";
// import "./Home.css";

// const Home = () => {
//   const [homeData, setHomeData] = useState(null);
//   const [services, setServices] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [pricing, setPricing] = useState([]);
//   const [testimonials, setTestimonials] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [faqs, setFaqs] = useState([]);
//   const [openFaqId, setOpenFaqId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // FAQ - question submission
//   const [showQuestionForm, setShowQuestionForm] = useState(false);
//   const [questionText, setQuestionText] = useState("");
//   const [questionEmail, setQuestionEmail] = useState("");
//   const [questionSubmitted, setQuestionSubmitted] = useState(false);

//   // 🎬 Video popup states
//   const [showVideo, setShowVideo] = useState(false);
//   const [currentVideoUrl, setCurrentVideoUrl] = useState("");

//   // 🔗 Utility: build full URL for backend images
//   const getImageUrl = (path) => {
//     if (!path) return null;
//     if (path.startsWith("http") || path.startsWith("//")) {
//       return path;
//     }
//     return `${import.meta.env.VITE_API_BASE_URL}/images/${path}`;
//   };

//   // 🎬 Video helpers
//   const extractYouTubeID = (url) => {
//     if (!url) return null;
//     const match = url.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]*)/);
//     return match ? match[1] : null;
//   };

//   const getEmbedSrc = (url) => {
//   if (!url) return "";

//   // Handle YouTube full links or IDs
//   const ytId = extractYouTubeID(url) || (url.length === 11 ? url : null);
//   if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1`;

//   // Handle .mp4 file
//   if (url.endsWith(".mp4")) {
//     return url.startsWith("http")
//       ? url
//       : `${import.meta.env.VITE_API_BASE_URL}${url}`;
//   }

//   // Fallback: return as-is
//   return url;
// };


//   const isMp4 = (url) => url && url.endsWith(".mp4");

//   const openVideoPopup = (url) => {
//     setCurrentVideoUrl(url);
//     setShowVideo(true);
//   };

//   const closeVideoPopup = () => {
//     setShowVideo(false);
//     setCurrentVideoUrl("");
//   };

//   const toggleFaq = (id) => {
//     setOpenFaqId((prev) => (prev === id ? null : id));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch home data
//         const homeRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/home`);
//         const homeData = await homeRes.json();
//         setHomeData(homeData);

//         // Fetch all other data in parallel
//         const [servicesRes, projectsRes, testimonialsRes, clientsRes, faqsRes, pricingRes] =
//           await Promise.all([
//             fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services`),
//             fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`),
//             fetch(`${import.meta.env.VITE_API_BASE_URL}/api/testimonials`),
//             fetch(`${import.meta.env.VITE_API_BASE_URL}/api/clients`),
//             fetch(`${import.meta.env.VITE_API_BASE_URL}/api/faqs`),
//             fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pricing`),
//           ]);

//         setServices(await servicesRes.json());
//         setProjects(await projectsRes.json());
//         setTestimonials(await testimonialsRes.json());
//         setClients(await clientsRes.json());
//         setFaqs(await faqsRes.json());
//         setPricing(await pricingRes.json());
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleQuestionSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submit-question`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           question: questionText,
//           email: questionEmail,
//         }),
//       });

//       if (response.ok) {
//         setQuestionSubmitted(true);
//         setQuestionText("");
//         setQuestionEmail("");
//         setTimeout(() => {
//           setShowQuestionForm(false);
//           setQuestionSubmitted(false);
//         }, 3000);
//       } else {
//         console.error("Failed to submit question");
//       }
//     } catch (error) {
//       console.error("Error submitting question:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (!homeData) {
//     return (
//       <div className="error-container">
//         <h2>Failed to load data</h2>
//         <p>Please check your connection and try again.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero-section">
//         <div className="container">
//           {/* Shape Image */}
//           <div className="shape">
//             <img
//               src={getImageUrl(homeData.header?.shapeImage || "shape.png")}
//               alt="shape"
//             />
//           </div>

//           {/* Header Content */}
//           <div className="header-content">
//             <h1
//               dangerouslySetInnerHTML={{ __html: homeData.header?.title || "" }}
//             />
//             <p>{homeData.header?.description || ""}</p>
//           </div>

//           {/* Banner Section */}
//           <div className="banner-container">
//             <div
//               className="video-box"
//               onClick={() =>
//                 openVideoPopup(homeData.banner?.videoUrl || homeData.banner?.videoId)
//               }
//               style={{ cursor: "pointer" }}
//             >
//               <img
//                 src={getImageUrl(homeData.banner?.videoThumb)}
//                 alt="video-thumb"
//                 className="video-thumb"
//               />
//               <div className="play-button">▶</div>
//             </div>
//             <div className="banners">
//               {homeData.banner?.statistics?.map((stat, index) => (
//                 <div className="banner" key={index}>
//                   <h3>{stat.value}</h3>
//                   <p>{stat.label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Banner Image */}
//       <div className="banner-img">
//         <img
//           src={getImageUrl(homeData.bannerImage)}
//           alt="Banner"
//           className="main-banner"
//         />
//       </div>

//       {/* Services Section Title */}
//       <section className="service-section">
//         <h2
//           className="sections-titles"
//           dangerouslySetInnerHTML={{
//             __html: homeData.serviceSection?.title || "",
//           }}
//         />
//       </section>

//       {/* Projects Section */}
//       <div className="blog-post container">
//         {projects.map((project) => (
//           <div className="blog-title" key={project.id || project._id}>
//             <div className="project-about">
//               <img
//                 src={getImageUrl(project.image)}
//                 alt={project.title}
//                 className="project-image"
//               />
//             </div>
//             <div className="blog-content">
//               <button className="pro-btn">
//                 <a href="#">{project.category}</a>
//               </button>
//               <h2 className="blog-sub">{project.title}</h2>
//               <p className="tags">
//                 {project.tags?.map((tag, i) => (
//                   <React.Fragment key={i}>
//                     {i > 0 && " • "}
//                     <strong>{tag}</strong>
//                   </React.Fragment>
//                 ))}
//               </p>
//               <p className="blog-desc">{project.description}</p>
//               <button className="project-btn">
//                 <a href="#">View Project →</a>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* About Section */}
//       <div className="about-container">
//         <div className="about-logo">
//           <img
//             src={getImageUrl(homeData.about?.logo)}
//             alt="About Logo"
//             className="logo-img"
//           />
//         </div>
//         <h1 className="about-content">{homeData.about?.title || ""}</h1>
//         <p className="about-desc">{homeData.about?.description || ""}</p>
//         <div className="buttons">
//           {homeData.about?.buttons?.map((button, index) => (
//             <button className="project-btn" key={index}>
//               <a href={button.link}>{button.text}</a>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Services Section */}
//       <section className="service-sections">
//         <div className="container">
//           <h2 className="section-heading">
//             What services <br /> we provide?
//           </h2>
//           <div className="service-grid">
//             {services.map((service, index) => (
//               <div className="service-card" key={service.id || service._id || index}>
//                 <div className="icon-box">
//                   <img
//                     src={getImageUrl(service.icon)}
//                     alt={service.title}
//                     className="service-icon"
//                   />
//                 </div>
//                 <h3 className="service-heading">{service.title}</h3>
//                 <p className="service-desc">{service.desc || service.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="testimonial-section">
//         <div className="testimonial-contents">
//           <h2>
//             Hear it from <br /> our clients
//           </h2>
//         </div>
//         <div className="arrows">
//           <button className="arrow-btn">&larr;</button>
//           <button className="arrow-btn">&rarr;</button>
//         </div>

//         <div className="testimonial-container">
//           {testimonials.map((testimonial) => (
//             <div className="testimonial-card" key={testimonial.id || testimonial._id}>
//               <p className="testimonial-desc">
//                 {testimonial.desc || testimonial.description}
//               </p>
//               <div className="user">
//                 <div className="info">
//                   <h3>{testimonial.name}</h3>
//                   <h6>{testimonial.role}</h6>
//                 </div>
//                 <img
//                   src={getImageUrl(testimonial.img || testimonial.image)}
//                   alt={testimonial.name}
//                   className="user-avatar"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section className="pricing-section">
//         <div className="container">
//           <h1
//             className="title"
//             dangerouslySetInnerHTML={{
//               __html:
//                 homeData.pricing?.title || "Flexible pricing <br /> for every need",
//             }}
//           />

//           <div className="pricing-cards">
//             {pricing.map((plan) => (
//               <div className="card" key={plan.id || plan._id}>
//                 <div className="card-header">
//                   <h3>{plan.name}</h3>
//                   <span className="badge">{plan.badge}</span>
//                 </div>
//                 <p className="pricing-desc">{plan.description}</p>
//                 <div className="price">
//                   {plan.price}
//                   <span>{plan.price_period || plan.period}</span>
//                 </div>
//                 <button className="price-btn">Get Started →</button>
//                 <ul>
//                   {plan.features.map((feature, index) => (
//                     <li key={index}>✓ {feature}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           <div className="cta-box">
//             <p>
//               {homeData.pricing?.cta?.text ||
//                 "Want a unique solution to meet your needs?"}
//             </p>
//             <div className="cta-btn">
//               {homeData.pricing?.cta?.buttons ? (
//                 homeData.pricing.cta.buttons.map((button, index) => (
//                   <button className="price-btns" key={index}>
//                     {button.text}
//                   </button>
//                 ))
//               ) : (
//                 <>
//                   <button className="price-btns">Book a call →</button>
//                   <button className="price-btns">Contact us →</button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Clients Section */}
//       <section className="clients-section">
//         <div className="container">
//           <h2 className="clients-heading">Our latest Clients</h2>
//           <div className="clients-grid">
//             {clients.map((client) => (
//               <div className="client-card" key={client.id || client._id}>
//                 <img
//                   src={getImageUrl(client.logo)}
//                   alt={client.name || `Client ${client.id}`}
//                   className="client-logo"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <div className="faq-section">
//         <div className="container">
//           <div className="faq-title">
//             <h1>
//               Frequently
//               <br />
//               Asked
//               <br /> Question
//             </h1>
//           </div>
//           <div className="faq-container">
//             {faqs.map((faq) => (
//               <div
//                 key={faq.id || faq._id}
//                 className={`faq-item ${
//                   openFaqId === (faq.id || faq._id) ? "open" : ""
//                 }`}
//               >
//                 <button
//                   className="faq-question"
//                   onClick={() => toggleFaq(faq.id || faq._id)}
//                 >
//                   {faq.question}
//                   <span className="icon">
//                     {openFaqId === (faq.id || faq._id) ? "-" : "+"}
//                   </span>
//                 </button>
//                 {openFaqId === (faq.id || faq._id) && (
//                   <div className="faq-answer">{faq.answer}</div>
//                 )}
//               </div>
//             ))}

//             {/* Question Submission Form */}
//             <div className="question-submission">
//               {!showQuestionForm ? (
//                 <button
//                   className="ask-question-btn"
//                   onClick={() => setShowQuestionForm(true)}
//                 >
//                   Can't find your question? Ask us!
//                 </button>
//               ) : (
//                 <form className="question-form" onSubmit={handleQuestionSubmit}>
//                   <h3>Ask Your Question</h3>
//                   <textarea
//                     value={questionText}
//                     onChange={(e) => setQuestionText(e.target.value)}
//                     placeholder="Type your question here..."
//                     required
//                     rows="4"
//                   />
//                   <input
//                     type="email"
//                     value={questionEmail}
//                     onChange={(e) => setQuestionEmail(e.target.value)}
//                     placeholder="Your email (optional)"
//                   />
//                   <div className="question-form-buttons">
//                     <button type="submit">Submit Question</button>
//                     <button
//                       type="button"
//                       onClick={() => setShowQuestionForm(false)}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                   {questionSubmitted && (
//                     <p className="success-message">
//                       Thank you! Your question has been submitted.
//                     </p>
//                   )}
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🎬 Video Popup */}
//       {showVideo && (
//         <div
//           className="video-popup-overlay"
//           onClick={(e) => {
//             if (e.target.classList.contains("video-popup-overlay")) closeVideoPopup();
//           }}
//         >
//           <div className="video-popup" role="dialog" aria-modal="true">
//             <button className="video-close-btn" onClick={closeVideoPopup}>
//               &times;
//             </button>

//             <div className="video-container">
//   {isMp4(currentVideoUrl) ? (
//     <video
//       key={currentVideoUrl} // 👈 important so React reloads video
//       controls
//       autoPlay
//       playsInline
//       style={{ width: "100%", height: "100%" }}
//     >
//       <source src={getEmbedSrc(currentVideoUrl)} type="video/mp4" />
//       Your browser does not support video.
//     </video>
//   ) : (
//     <iframe
//       key={currentVideoUrl} // 👈 forces refresh
//       title="Video player"
//       src={getEmbedSrc(currentVideoUrl)}
//       frameBorder="0"
//       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//       allowFullScreen
//       style={{ width: "100%", height: "100%" }}
//     />
//   )}
// </div>


//             <div className="video-fallback">
//               {(() => {
//                 const id = extractYouTubeID(
//                   currentVideoUrl || homeData?.banner?.videoUrl || homeData?.banner?.videoId
//                 );
//                 if (id) {
//                   return (
//                     <a
//                       href={`https://www.youtube.com/watch?v=${id}`}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       Open on YouTube
//                     </a>
//                   );
//                 }
//                 if (currentVideoUrl && currentVideoUrl.startsWith("http")) {
//                   return (
//                     <a href={currentVideoUrl} target="_blank" rel="noreferrer">
//                       Open video in new tab
//                     </a>
//                   );
//                 }
//                 return null;
//               })()}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;


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

  // FAQ - question submission
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionEmail, setQuestionEmail] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Video popup state
  const [showVideo, setShowVideo] = useState(false);

  // 🔗 Utility: build full URL for backend images
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("//")) {
      return path;
    }
    return `${import.meta.env.VITE_API_BASE_URL}/images/${path}`;
  };

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // Function to open video popup
  const openVideoPopup = () => {
    setShowVideo(true);
  };

  // Function to close video popup
  const closeVideoPopup = () => {
    setShowVideo(false);
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
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pricing`),
          ]);

        setServices(await servicesRes.json());
        setProjects(await projectsRes.json());
        setTestimonials(await testimonialsRes.json());
        setClients(await clientsRes.json());
        setFaqs(await faqsRes.json());
        setPricing(await pricingRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submit-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questionText,
          email: questionEmail,
        }),
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
      {/* Video Popup */}
      {showVideo && (
        <div className="video-popup-overlay" onClick={closeVideoPopup}>
          <div className="video-popup" onClick={(e) => e.stopPropagation()}>
            <button className="video-close-btn" onClick={closeVideoPopup}>
              &times;
            </button>
            <div className="video-container">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/q0wCFUH7WXU?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-fallback">
              <p>If the video doesn't load, you can watch it directly on 
                <a href="https://www.youtube.com/watch?v=q0wCFUH7WXU" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          {/* Shape Image from static/images backend folder */}
          <div className="shape">
            <img
              src={getImageUrl(homeData.header?.shapeImage || "shape.png")}
              alt="shape"
            />
          </div>

          {/* Header Content */}
          <div className="header-content">
            <h1
              dangerouslySetInnerHTML={{ __html: homeData.header?.title || "" }}
            />
            <p>{homeData.header?.description || ""}</p>
          </div>

          {/* Banner Section */}
          <div className="banner-container">
            <div className="video-box" onClick={openVideoPopup}>
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

      {/* Rest of your code remains exactly the same */}
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
          <h2
            className="sections-titles"
            dangerouslySetInnerHTML={{
              __html: homeData.serviceSection?.title || "",
            }}
          />
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
          <div className="testimonial-contents">
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
                <p className="testimonial-desc">
                  {testimonial.desc || testimonial.description}
                </p>
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
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <h1
            className="title"
            dangerouslySetInnerHTML={{
              __html:
                homeData.pricing?.title || "Flexible pricing <br /> for every need",
            }}
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
                  {plan.price}
                  <span>{plan.price_period || plan.period}</span>
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
            <p>
              {homeData.pricing?.cta?.text ||
                "Want a unique solution to meet your needs?"}
            </p>
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
            {faqs.map((faq) => (
              <div
                key={faq.id || faq._id}
                className={`faq-item ${
                  openFaqId === (faq.id || faq._id) ? "open" : ""
                }`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(faq.id || faq._id)}
                >
                  {faq.question}
                  <span className="icon">
                    {openFaqId === (faq.id || faq._id) ? "-" : "+"}
                  </span>
                </button>
                {openFaqId === (faq.id || faq._id) && (
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
                    <button
                      type="button"
                      onClick={() => setShowQuestionForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                  {questionSubmitted && (
                    <p className="success-message">
                      Thank you! Your question has been submitted.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;