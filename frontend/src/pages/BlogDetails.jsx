import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const getImageUrl = (path) => {
    if (!path) return "";
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  const fallbackShape = `${import.meta.env.VITE_API_BASE_URL}/images/shape.png`;

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setError(null);

        const blogResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/blogs/${id}`
        );

        if (!blogResponse.ok) {
          const errorData = await blogResponse.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Failed to fetch blog: ${blogResponse.status}`
          );
        }

        const blogData = await blogResponse.json();
        if (!blogData || Object.keys(blogData).length === 0) {
          throw new Error("Blog not found");
        }
        setBlog(blogData);

        if (blogData.category) {
          const excludeId = blogData.id || blogData._id;
          const relatedResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/blogs?category=${blogData.category}&limit=3&exclude=${excludeId}`
          );

          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedBlogs(relatedData);
          }
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading blog post...</div>;
  }

  if (error || !blog) {
    return (
      <div className="error">
        <h2>Error loading blog</h2>
        <p>{error || "Blog not found"}</p>
        <Link to="/blogs">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="blog-details-section">
      {/* Shape Background */}
      <div className="shape">
        <img
          src={fallbackShape}
          alt="shape"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackShape;
          }}
        />
      </div>

      {/* Navigation Header */}
      <header className="blog-details-header container">
        <Link to="/blogs" className="back-button">
          ← Back to Blogs
        </Link>
        <h1>Blog Details</h1>
      </header>

      {/* Featured Article */}
      <section className="featured-article container">
        <div className="content">
          <span className="category">{blog.category}</span>
          <h1 className="headline">{blog.title}</h1>
          <div className="meta">
            <span>📅 {blog.date}</span>
            <span>⏱ {blog.read_time}</span>
          </div>
        </div>
        <div className="image-wrapper">
          <img src={getImageUrl(blog.image)} alt={blog.title} />
        </div>
      </section>

      {/* Blog Content */}
      <section className="article-section container">
        <div className="article-container">
          <h2>Insights and Strategies</h2>
          <p>
            {blog.description ||
              "In key moments like these, the answer can join us exactly where headlines held. Entire limits and a mood follow quest to several unlimited moving financial solutions."}
          </p>
        </div>
      </section>

      {/* Related Blogs */}
      <section className="related-articles container">
        <h2>
          More related
          <br />
          articles
        </h2>

        <div className="cards-container">
          {relatedBlogs.map((relatedBlog) => (
            <div className="cardss" key={relatedBlog._id}>
              <img
                src={getImageUrl(relatedBlog.image)}
                alt={relatedBlog.title}
              />
              <div className="cardss-body">
                <span className="tag">{relatedBlog.category}</span>
                <h3>{relatedBlog.title}</h3>
                <div className="meta">
                  <span>📅 {relatedBlog.date}</span>
                  <span>⏱ {relatedBlog.read_time}</span>
                </div>
                <Link
                  to={`/blogs/${relatedBlog.id || relatedBlog._id}`}
                  className="read-more"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
