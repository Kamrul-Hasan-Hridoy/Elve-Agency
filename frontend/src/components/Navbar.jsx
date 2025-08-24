import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="navbar-container">
      <nav className="navbar">
        <Link to='/' className="logo">
          <span className="logo-icon">::</span>
          <span className="logo-text">ElveAgency</span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/project">Projects</Link>
          </li>
          <li>
            <Link to="/service">Services</Link>
          </li>
          <li>
            <Link to="/about">About us</Link>
          </li>
          <li>
            <Link to="/pricing">Pricing</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
        </ul>
        <Link to="/contact" className="contact-btn">
          Contact →
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
