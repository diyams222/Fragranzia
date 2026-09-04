import "./Footer.css";
import { Link } from "react-router-dom";
import { FiMail, FiPhone } from "react-icons/fi";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Brand Column */}
        <div className="footer-col footer-brand">
          <h2>Fragranzia</h2>
        </div>

        {/* Pages Column */}
        <div className="footer-col">
          <h4>Pages</h4>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/allproducts">Products</Link>
            </li>
            <li>
              <Link to="/">Gifting</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#privacy">Privacy policy</a>
            </li>
            <li>
              <a href="#terms">Terms and conditions</a>
            </li>
            <li>
              <a href="#faqs">FAQs</a>
            </li>
            <li>
              <a href="#customer-service">Customer service</a>
            </li>
          </ul>
        </div>

        {/* Contact & Social Column */}
        <div className="footer-col footer-contact-col">
          <div className="footer-contact-item">
            <FiMail className="contact-icon" />
            <span>ftrafurniture@gmail.com</span>
          </div>

          <div className="footer-contact-item">
            <FiPhone className="contact-icon" />
            <span>+91 9876543210</span>
          </div>

          <h4>Social Media</h4>
          <div className="footer-social-icons">
            <span className="dummy-social-icon" title="Instagram">
              <FaInstagram />
            </span>
            <span className="dummy-social-icon" title="Facebook">
              <FaFacebookF />
            </span>
            <span className="dummy-social-icon" title="X (Twitter)">
              <FaXTwitter />
            </span>
            <span className="dummy-social-icon" title="YouTube">
              <FaYoutube />
            </span>
            <span className="dummy-social-icon" title="LinkedIn">
              <FaLinkedinIn />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Sub-footer */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <div className="footer-legal-links">
            <span>Web Accessiblilty</span>
            <span className="legal-sep">|</span>
            <span>Terms of Use</span>
            <span className="legal-sep">|</span>
            <span>Privacy Statement</span>
            <span className="legal-sep">|</span>
            <span>Contact Us</span>
          </div>

          <div className="footer-copyright">
            <span>© 2024 fragranzia Company. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;