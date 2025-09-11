
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-left">
            <h1>
              Have any
              <br />
              project idea in
              <br />
              your mind
            </h1>
            <Link to="/contact" className="cta-button">
              Contact us →
            </Link>
          </div>

          <div className="footer-links">
            <div>
              <ul>
                <li>
                  <Link to="/service">Services</Link>
                </li>
                <li>
                  <Link to="/project">Projects</Link>
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
            </div>
            <div>
              <ul>
                <li>
  <Link to="https://twitter.com/" target="_blank" rel="noopener noreferrer">
    Twitter/X
  </Link>
</li>
<li>
  <Link to="https://instagram.com/" target="_blank" rel="noopener noreferrer">
    Instagram
  </Link>
</li>
<li>
  <Link to="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
    LinkedIn
  </Link>
</li>
<li>
  <Link to="https://facebook.com/" target="_blank" rel="noopener noreferrer">
    Facebook
  </Link>
</li>
<li>
  <Link to="https://youtube.com/" target="_blank" rel="noopener noreferrer">
    YouTube
  </Link>
</li>

              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright ©ElveAgency Studio. All rights reserved</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
