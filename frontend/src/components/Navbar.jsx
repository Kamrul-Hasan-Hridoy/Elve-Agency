import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="navbar-container">
      <nav className="navbar">
        <Link to='/' className="logo">
          
            <img src="/images/logo2.png" />
         
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/project">Project</Link>
          </li>
          <li>
            <Link to="/service">Service</Link>
          </li>
          <li>
            <Link to="/about">About us</Link>
          </li>
          <li>
            <Link to="/pricing">Pricing</Link>
          </li>
          <li>
            <Link to="/blogs">Blog</Link>
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
