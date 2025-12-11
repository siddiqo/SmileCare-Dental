import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaTooth, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="py-5">
          {/* SmileCare Brand Section */}
          <Col md={4} className="mb-4 mb-md-0">
            <div className="footer-brand mb-3">
              <div className="footer-logo-circle me-2">
                <FaTooth className="footer-logo-icon" />
              </div>
              <h5 className="footer-brand-name">SmileCare</h5>
            </div>
            <p className="footer-description">
              Your trusted partner for comprehensive dental care in Muscat, Oman. We're committed to keeping your smile healthy and bright.
            </p>
          </Col>

          {/* Quick Links Section */}
          <Col md={2} className="mb-4 mb-md-0">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/services">Our Services</Link>
              </li>
              <li>
                <Link to="/appointments">Book Appointment</Link>
              </li>
            </ul>
          </Col>

          {/* Contact Us Section */}
          <Col md={3} className="mb-4 mb-md-0">
            <h6 className="footer-heading">Contact Us</h6>
            <ul className="footer-contact">
              <li>
                <FaPhone className="footer-contact-icon" />
                <a href="tel:+96891234567">+968-91234567</a>
              </li>
              <li>
                <FaEnvelope className="footer-contact-icon" />
                <a href="mailto:info@smilecare.om">info@smilecare.om</a>
              </li>
              <li>
                <FaMapMarkerAlt className="footer-contact-icon" />
                <span>
                  Al Khuwair, Muscat<br />
                  Sultanate of Oman 🇴🇲
                </span>
              </li>
            </ul>
          </Col>

          {/* Office Hours Section */}
          <Col md={3} className="mb-4 mb-md-0">
            <h6 className="footer-heading">Office Hours</h6>
            <div className="footer-hours">
              <div className="hours-row">
                <span className="hours-day">Saturday - Thursday:</span>
                <span className="hours-time">8AM - 7PM</span>
              </div>
              <div className="hours-row">
                <span className="hours-day">Friday:</span>
                <span className="hours-time text-info">4PM - 8PM</span>
              </div>
              <div className="footer-timezone">
                Gulf Standard Time (GMT+4)
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="footer-social mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright Section */}
        <Row className="footer-bottom">
          <Col className="text-center py-3">
            <p className="footer-copyright mb-0">
              © 2025 SmileCare Dental - Muscat, Oman. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
