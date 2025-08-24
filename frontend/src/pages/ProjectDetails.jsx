import React from "react";

const ProjectDetails = () => {
  return (
    <>
      {/* Banner section start */}
      <section className="project-section">
        <h1>Boldstream</h1>

        <div className="project-image">
          <img src="/images/Rectangle 63 (8).png" alt="" />
        </div>

        <div className="project-info">
          <div className="info-card">
            <p className="label">Project Name</p>
            <p className="value">Boldstream</p>
          </div>
          <div className="info-card">
            <p className="label">Headquarters</p>
            <p className="value">New York, US</p>
          </div>
          <div className="info-card">
            <p className="label">Industry</p>
            <p className="value">Software</p>
          </div>
          <div className="info-card">
            <p className="label">Company Size</p>
            <p className="value">200 employees</p>
          </div>
          <div className="info-card">
            <p className="label">Timeline</p>
            <p className="value">Jan 15 - Dec 20</p>
          </div>
        </div>
      </section>
      {/* Banner section end */}

      {/* Overview section start */}
      <section className="project-overview">
        <div className="content">
          <h2>Project overview</h2>
          <p className="view-text">
            Discharge of stitching even the fully which be to not rome; Alone,
            the of go. Of years, mental as shown down stiff copy of he countries
            are emphasis called attribute head because of understand sight as it
            long labour, would anyone paint, approach thoroughly, to example.
          </p>
          <p className="view-text">
            Period, to his millions she to the vices the ed you bread at the
            satisfaction dressing irregular harmonic years human my lie looked
            from aged was by which plot however up that while person, week the
            star different fur I to for it whose aside, right his honour; Have
            arduous would films so at power decisions, 8 and each dense, the it
            secure dissolute you a elucidates gradually and the then, and
            employed hand. Was a seemed for far only an links by checks, writer
            of, even that a peacefully absolutely was abandon gradually it his
            into to be that.
          </p>
        </div>

        <div className="image-box">
          <img src="/images/Frame0.png" alt="" />
        </div>

        <p className="view-text">
          We track performance post-launch, analyzing data and user feedback to
          find opportunities for improvement. Our goal is to keep your digital
          strategy dynamic, optimizing it to ensure long-term success and
          continued growth. With everything polished and perfected, we launch
          your project with confidence. But our work doesn't stop there—we offer
          ongoing support and are always available to make updates,
          improvements, and ensure your digital presence.
        </p>
      </section>
      {/* Overview section end */}

      {/* Work section start */}
      <div className="work-container">
        <section className="text-section">
          <h1>Scope of work</h1>
          <p>
            Outline the services provided, such as strategy, design,
            development, branding, or marketing. Example:
          </p>
          <ul>
            <li>Website design and development</li>
            <li>UX/UI optimization</li>
            <li>E-commerce integration</li>
            <li>Content creation and branding</li>
          </ul>
        </section>

        <section className="images-grid">
          <div className="image-card">
            <img src="/images/Frame (1).png" alt="" />
          </div>
          <div className="image-card">
            <img src="/images/Frame (2).png" alt="" />
          </div>
          <div className="image-card wide">
            <img src="/images/Frame (3).png" alt="" />
          </div>
        </section>

        <div className="button-wrapper">
          <a
            href=""
            className="visit-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.hoststream.com →
          </a>
        </div>
      </div>
      {/* Work section end */}

      {/* Check project section start */}
      <section className="service-section">
        <h2 className="section-title">
          Check related <br />
          projects
        </h2>
      </section>

      <div className="blog-post">
        <div className="blog-title">
          <div className="project-about">
            <img src="/images/Rectangle 63 (8).png" alt="" />
          </div>
          <div className="blog-content">
            <button className="pro-btn">
              <a href="#">Website Design</a>
            </button>
            <h2 className="blog-sub">InnovateX</h2>
            <p>
              <strong>Design</strong> . <strong>Development</strong>
            </p>
            <p className="blog-desc">
              Truculenter caterva tamquam cilicium admoveo consequuntur aufero.
              Derelinquo ceno amet molestiae crustulum tubineus.
            </p>
            <button className="project-btn">
              <a href="#">View Project →</a>
            </button>
          </div>
        </div>

        <div className="blog-title">
          <div className="project-about">
            <img src="/images/Rectangle 63 (9).png" alt="" />
          </div>
          <div className="blog-content">
            <button className="pro-btn">
              <a href="#">Dashboard</a>
            </button>
            <h2 className="blog-sub">PixelForge</h2>
            <p>
              <strong>Design</strong> . <strong>Development</strong>
            </p>
            <p className="blog-desc">
              Sit sol solium magnam damnatio sed vox. Assentat vicissitudo
              apparatus comitatus attero is suffoco. Asperiores adnuo victoria
              volaticus templum.
            </p>
            <button className="project-btn">
              <a href="#">View Project →</a>
            </button>
          </div>
        </div>
      </div>
      {/* Check project section end */}
    </>
  );
};

export default ProjectDetails;
