import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Service from "./pages/Service";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import Projects from "./pages/Projects";
import About from "./pages/About";
import BlogDetails from "./pages/BlogDetails";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route path="/project-details" element={<ProjectDetails />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/service" element={<Service />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
