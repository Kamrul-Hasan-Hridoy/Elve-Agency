import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [gridBlogs, setGridBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Blog");

  // Helper function for images
  const getImageUrl = (path) => {
    if (!path) return "";
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => {
        setAllBlogs(data);
        
        // Prioritize "The importance of ADA compliance in web design" as featured blog
        const adaBlogIndex = data.findIndex(blog => 
          blog.title === "The importance of ADA compliance in web design"
        );
        
        if (adaBlogIndex !== -1) {
          // If ADA blog exists, set it as featured
          setFeaturedBlog(data[adaBlogIndex]);
          // Remove it from the grid blogs
          const remainingBlogs = [...data];
          remainingBlogs.splice(adaBlogIndex, 1);
          setGridBlogs(remainingBlogs);
        } else if (data.length > 0) {
          // Fallback to first blog as featured
          setFeaturedBlog(data[0]);
          setGridBlogs(data.slice(1));
        }
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  // Filter blogs by category
  const filterBlogs = (category) => {
    setActiveFilter(category);
    
    if (category === "All Blog") {
      // For "All Blog", use the original prioritization
      const adaBlogIndex = allBlogs.findIndex(blog => 
        blog.title === "The importance of ADA compliance in web design"
      );
      
      if (adaBlogIndex !== -1) {
        setFeaturedBlog(allBlogs[adaBlogIndex]);
        const remainingBlogs = [...allBlogs];
        remainingBlogs.splice(adaBlogIndex, 1);
        setGridBlogs(remainingBlogs);
      } else if (allBlogs.length > 0) {
        setFeaturedBlog(allBlogs[0]);
        setGridBlogs(allBlogs.slice(1));
      }
    } else {
      // For category filters, just filter without special prioritization
      const filtered = allBlogs.filter(blog => blog.category === category);
      if (filtered.length > 0) {
        setFeaturedBlog(filtered[0]);
        setGridBlogs(filtered.slice(1));
      } else {
        setFeaturedBlog(null);
        setGridBlogs([]);
      }
    }
  };

  return (
    <>
      <section className="recent-work">
        <h1>Latest Blogs</h1>
        <div className="filters">
          <button 
            className={activeFilter === "All Blog" ? "active" : ""}
            onClick={() => filterBlogs("All Blog")}
          >
            All Blog
          </button>
          <button 
            className={activeFilter === "Buisness" ? "active" : ""}
            onClick={() => filterBlogs("Buisness")}
          >
            Buisness
          </button>
          <button 
            className={activeFilter === "Startups" ? "active" : ""}
            onClick={() => filterBlogs("Startups")}
          >
            Startups
          </button>
          <button 
            className={activeFilter === "Marketing" ? "active" : ""}
            onClick={() => filterBlogs("Marketing")}
          >
            Marketing
          </button>
          <button 
            className={activeFilter === "Design" ? "active" : ""}
            onClick={() => filterBlogs("Design")}
          >
            Design
          </button>
          <button 
            className={activeFilter === "News & Events" ? "active" : ""}
            onClick={() => filterBlogs("News & Events")}
          >
            News & Events
          </button>
        </div>
      </section>

      {/* Featured Blog Card */}
      {featuredBlog && (
        <div className="blog-post">
          <div className="blog-title">
            <div className="project-about">
              <img
                src={getImageUrl(featuredBlog.image)}
                alt={featuredBlog.title}
              />
            </div>
            <div className="blog-content">
              <button className="pro-btn">
                <a href="#">{featuredBlog.category}</a>
              </button>
              <h2 className="blog-sub">{featuredBlog.title}</h2>
              <p className="blog-desc">{featuredBlog.description}</p>
              <div className="meta">
                <button className="project-btn">
                  <a href="#">📅 {featuredBlog.date}</a>
                </button>
                <button className="project-btn">
                  <a href="#">⏱ {featuredBlog.read_time}</a>
                </button>
              </div>
              {/* Use numeric ID if available, otherwise use _id */}
              <Link to={`/blogs/${featuredBlog.id || featuredBlog._id}`} className="read-more">
                Read More
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="card-grids">
        {gridBlogs.map((blog, index) => (
          <div className="cardd" key={index}>
            <img src={getImageUrl(blog.image)} alt={blog.title} />
            <div className="cardd-body">
              <span className="category">{blog.category}</span>
              <h3 className="titles">{blog.title}</h3>
              <div className="meta">
                <span>📅 {blog.date}</span>
                <span>⏱ {blog.read_time}</span>
              </div>
              {/* Use numeric ID if available, otherwise use _id */}
              <Link to={`/blogs/${blog.id || blog._id}`} className="read-more">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Blogs;