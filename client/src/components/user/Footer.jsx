import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <h2>Fragranzia</h2>
      </div>

      <div className="footer-links">
        <div>
          <h4>Pages</h4>
          <p>Home</p>
          <p>Products</p>
          <p>Gifting</p>
          <p>About</p>
          <p>Profile</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>
          <p>FAQs</p>
          <p>Customer Service</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;