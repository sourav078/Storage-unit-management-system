import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__grid">
          <div className="site-footer__brand-block">
            <h3 className="site-footer__brand">MR. Bunker</h3>
            <p className="site-footer__text">
              MR. Bunker provides secure, flexible, and affordable storage unit
              booking for personal and business needs. Compare options, choose
              the right unit size, and reserve your storage space online with
              confidence.
            </p>
          </div>

          <div className="site-footer__column">
            <h4 className="site-footer__heading">Company</h4>
            <ul className="site-footer__links">
              <li>About Us</li>
              <li>Our Units</li>
              <li>Pricing</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="site-footer__column">
            <h4 className="site-footer__heading">Support</h4>
            <ul className="site-footer__links">
              <li>Help Center</li>
              <li>Booking Guide</li>
              <li>Security Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          <div className="site-footer__column">
            <h4 className="site-footer__heading">Contact</h4>
            <ul className="site-footer__contact">
              <li>Spring Hill, Brisbane QLD 4000</li>
              <li>hello@mrbunker.com</li>
              <li>+61 413 359 593</li>
            </ul>

            <div className="site-footer__socials">
              <span>f</span>
              <span>in</span>
              <span>x</span>
              <span>▶</span>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>Copyright © 2026 MR. Bunker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;