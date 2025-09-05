import React, { useState, useEffect } from "react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Blog");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch filters
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/filters`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch filters');
        return res.json();
      })
      .then(data => setFilters(data))
      .catch(err => {
        console.error("Error fetching filters:", err);
        setError("Failed to load filters");
      });
    
    // Fetch initial projects
    fetchProjects("All Blog");
  }, []);

  const fetchProjects = (category) => {
    setLoading(true);
    setError(null);
    
    const url = category === "All Blog"
      ? `${import.meta.env.VITE_API_BASE_URL}/api/projects`
      : `${import.meta.env.VITE_API_BASE_URL}/api/projects?category=${encodeURIComponent(category)}`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
        setLoading(false);
      });
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    fetchProjects(filter);
  };

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => fetchProjects(activeFilter)}>Try Again</button>
      </div>
    );
  }

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
        {projects.length > 0 ? (
          projects.map(project => (
            <div className="blog-title" key={project.id}>
              <div className="project-about">
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/images/${project.image}`} 
                  alt={project.title} 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/placeholder.png';
                  }}
                />
              </div>
              <div className="blog-content">
                <button className="pro-btn">
                  <a href="#">{project.category}</a>
                </button>
                <h2 className="blog-sub">{project.title}</h2>
                <p>
                  {project.tags && project.tags.map((tag, index) => (
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