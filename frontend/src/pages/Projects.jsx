import React, { useState, useEffect } from "react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Blog");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch filters
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/filters`)
      .then(res => res.json())
      .then(data => setFilters(data));
    
    // Fetch initial projects
    fetchProjects("All Blog");
  }, []);

  const fetchProjects = (category) => {
    setLoading(true);
    const url = category === "All Blog"
      ? `${import.meta.env.VITE_API_BASE_URL}/api/projects`
      : `${import.meta.env.VITE_API_BASE_URL}/api/projects?category=${encodeURIComponent(category)}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    fetchProjects(filter);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh'
      }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <section className="recent-work">
        <h1>Recent Work</h1>
        <div className="filters">
          {filters.map(filter => (
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

      <div className="blog-post">
        {projects.map(project => (
          <div className="blog-title" key={project.id}>
            <div className="project-about">
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL}/images/${project.image}`} 
                alt={project.title} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/placeholder.png'; // Fallback image
                }}
              />
            </div>
            <div className="blog-content">
              <button className="pro-btn">
                <a href="#">{project.category}</a>
              </button>
              <h2 className="blog-sub">{project.title}</h2>
              <p>
                {project.tags.map((tag, index) => (
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
        ))}
      </div>
    </>
  );
};

export default Projects;