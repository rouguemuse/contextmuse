import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        
        {/* Left Column: Logo */}
        <div className="footer-col footer-logo-col">
          {/* A large, subtle SSF typographic logo */}
          <div className="ssf-huge-logo">SSF</div>
        </div>

        {/* Center Columns: Links and Mission */}
        <div className="footer-col footer-links-col">
          <p className="footer-mission">
            Southern Smoke takes care of our own by putting dollars directly into the pockets of food and beverage workers when it's needed most.
          </p>
          
          <div className="footer-nav-buttons">
            <Link to="/get-help" className="btn-outline">GET HELP</Link>
            <Link to="/donate" className="btn-outline">DONATE</Link>
          </div>

          <div className="footer-nav-grid">
            <ul className="footer-menu">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/news">News + Views</Link></li>
              <li><Link to="/people-partners">People + Partners</Link></li>
              <li><Link to="/impact">Our Impact</Link></li>
              <li><Link to="/programs">Programs</Link></li>
            </ul>
            <ul className="footer-menu">
              <li><Link to="/how-to-help">How to Help</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/festival">Festival</Link></li>
              <li><Link to="/bottle-club">Southern Smoke Bottle Club</Link></li>
            </ul>
          </div>
        </div>

        {/* Right Column: Newsletter and Socials */}
        <div className="footer-col footer-newsletter-col">
          <h3 className="newsletter-title">SPICE UP YOUR INBOX.</h3>
          <form className="newsletter-form">
            <input type="email" placeholder="" className="newsletter-input" />
            <button type="submit" className="newsletter-submit">SIGN UP &rarr;</button>
          </form>

          <div className="footer-socials">
            <span className="social-label">FOLLOW US:</span>
            <div className="social-links">
              <a href="#">Instagram</a> / <a href="#">Facebook</a> / <a href="#">YouTube</a> / <a href="#">LinkedIn</a>
            </div>
          </div>
          
          <div className="footer-contact">
            <span className="social-label">REACH OUT:</span>
            <a href="mailto:info@southernsmoke.org" className="contact-email">info@southernsmoke.org</a>
          </div>

          <div className="footer-bottom">
            <p className="copyright">&copy; 2026 Southern Smoke Foundation.<br/>Site by Principle + Kudos NYC.</p>
            <div className="charity-badges">
              {/* Placeholders for charity badges */}
              <div className="badge-placeholder">CHARITY NAVIGATOR</div>
              <div className="badge-placeholder round">SEAL</div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
