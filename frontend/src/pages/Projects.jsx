import React, { useState, useEffect } from "react";

// If you have a getImageUrl utility, import it
// import { getImageUrl } from "../utils/getImageUrl";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Blog");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackShape = `${import.meta.env.VITE_API_BASE_URL}/images/shape.png`;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/filters`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch filters");
        return res.json();
      })
      .then(data => setFilters(data))
      .catch(err => setError("Failed to load filters"));

    fetchProjects(activeFilter);
  }, []);

  const fetchProjects = (category) => {
    setLoading(true);
    setError(null);

    const url =
      category === "All Blog"
        ? `${import.meta.env.VITE_API_BASE_URL}/api/projects`
        : `${import.meta.env.VITE_API_BASE_URL}/api/projects?category=${encodeURIComponent(category)}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load projects");
        setLoading(false);
      });
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    fetchProjects(filter);
  };

  if (error) return <div>{error}</div>;
  if (loading) return <div className="loader">Loading...</div>;

  return (
    <>
      {/* Recent Work Section */}
      <section className="recent-work">
        <div className="shape">
          <img
            src={fallbackShape} // Replace with getImageUrl if you have it
            alt="shape"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackShape;
            }}
          />
        </div>

        <h1>Recent Work</h1>

        <div className="filters">
          {Array.isArray(filters) &&
            filters.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
        </div>
      </section>

      {/* Projects List */}
      <div className="blog-post">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div className="blog-title" key={project.id}>
              <div className="project-about">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/images/${project.image}`}
                  alt={project.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className="blog-content">
                <button className="pro-btn">
                  <a href="#">{project.category}</a>
                </button>
                <h2 className="blog-sub">{project.title}</h2>
                <p>
                  {project.tags &&
                    project.tags.map((tag, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && " . "}
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
          ))
        ) : (
          <p>No projects found</p>
        )}
      </div>
    </>
  );
};

export default Projects;
