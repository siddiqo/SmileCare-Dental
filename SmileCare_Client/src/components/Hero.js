import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero-section">
      <Container>
        <Row className="align-items-center min-vh-75">
          <Col md={6} className="hero-content">
            <h1 className="hero-title">Your Smile is Our Priority</h1>
            <p className="hero-description">
              Experience exceptional dental care in Muscat, Oman.
              We're committed to helping you achieve and maintain a
              healthy, beautiful smile with world-class dental services.
            </p>
            <div className="hero-buttons">
              <Button
                color="light"
                size="lg"
                className="me-3 hero-btn-primary"
                tag={Link}
                to="/appointments"
              >
                Book Appointment
              </Button>
              <Button
                color="light"
                outline
                size="lg"
                className="hero-btn-secondary"
                tag={Link}
                to="/services"
              >
                Our Services
              </Button>
            </div>
          </Col>
          <Col md={6} className="hero-image-col">
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80"
                alt="Modern Dental Office"
                className="hero-image"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;
