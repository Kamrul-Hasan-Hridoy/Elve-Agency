import React, { useState, useEffect } from "react";

const Blogs = () => {
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [gridBlogs, setGridBlogs] = useState([]);

  const getImageUrl = (path) => {
    if (!path) return "";
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setFeaturedBlog(data[0]);
          setGridBlogs(data.slice(1));
        }
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  return (
    <>
      <section className="recent-work">
        <h1>Latest Blogs</h1>
        <div className="filters">
          <button className="active">All Blog</button>
          <button>Buisness</button>
          <button>Startups</button>
          <button>Marketing</button>
          <button>Design</button>
          <button>News & Events</button>
        </div>
      </section>

      {}
      {featuredBlog && (
        <div className="blog-post">
          <div className="blog-title">
            <div className="project-about">
              {}
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
            </div>
          </div>
        </div>
      )}

      {}
      <div className="card-grids">
        {gridBlogs.map((blog, index) => (
          <div className="cardd" key={index}>
            {}
            <img src={getImageUrl(blog.image)} alt={blog.title} />
            <div className="cardd-body">
              <span className="category">{blog.category}</span>
              <h3 className="titles">{blog.title}</h3>
              <div className="meta">
                <span>📅 {blog.date}</span>
                <span>⏱ {blog.read_time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Blogs;
