import React from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import {
  FaTooth,
  FaTeethOpen,
  FaCrown,
  FaUserMd,
  FaHeartbeat,
  FaSyringe,
  FaChild,
  FaShieldAlt,
  FaCheckCircle,
  FaDollarSign,
  FaPercentage
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: <FaTooth />,
      title: 'General Checkup',
      description: 'Comprehensive oral examination and professional cleaning',
      price: '35 OMR',
      duration: '45 min',
      color: '#00d4ff'
    },
    {
      icon: <FaTeethOpen />,
      title: 'Teeth Whitening',
      description: 'Professional whitening treatment for a brighter smile',
      price: '115 OMR',
      duration: '60 min',
      color: '#00d4ff'
    },
    {
      icon: <FaCrown />,
      title: 'Dental Crowns',
      description: 'Custom-made crowns to restore damaged teeth',
      price: '345 OMR',
      duration: '2 visits',
      color: '#00d4ff'
    },
    {
      icon: <FaUserMd />,
      title: 'Dental Implants',
      description: 'Permanent solution for missing teeth',
      price: '960 OMR',
      duration: 'Multiple visits',
      color: '#00d4ff'
    },
    {
      icon: <FaHeartbeat />,
      title: 'Root Canal',
      description: 'Save infected teeth with gentle root canal therapy',
      price: '305 OMR',
      duration: '90 min',
      color: '#00d4ff'
    },
    {
      icon: <FaSyringe />,
      title: 'Fillings',
      description: 'Tooth-colored fillings for cavities',
      price: '72 OMR',
      duration: '30 min',
      color: '#00d4ff'
    },
    {
      icon: <FaChild />,
      title: 'Pediatric Dentistry',
      description: 'Specialized dental care for children',
      price: '30 OMR',
      duration: '30 min',
      color: '#00d4ff'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Emergency Care',
      description: 'Same-day appointments for dental emergencies',
      price: '57 OMR',
      duration: 'Variable',
      color: '#00d4ff'
    }
  ];

  const insuranceOptions = [
    {
      icon: <FaCheckCircle />,
      title: 'Insurance Accepted',
      description: 'We work with most major insurance providers',
      color: '#00d4ff'
    },
    {
      icon: <FaDollarSign />,
      title: 'Flexible Payment',
      description: 'Payment plans available for major procedures',
      color: '#10b981'
    },
    {
      icon: <FaPercentage />,
      title: 'Special Offers',
      description: 'New patient discounts and family packages',
      color: '#00d4ff'
    }
  ];

  return (
    <div className="services-page">
      {/* Services Header */}
      <div className="services-header">
        <Container>
          <div className="text-center">
            <h1 className="services-page-title">Our Services</h1>
            <p className="services-page-subtitle">
              We offer a comprehensive range of dental services to meet all your oral health needs.
              <br />
              All treatments are performed by experienced professionals using state-of-the-art equipment.
            </p>
          </div>
        </Container>
      </div>

      {/* Services Grid */}
      <Container className="py-5">
        <Row>
          {services.map((service, index) => (
            <Col lg={3} md={6} sm={12} key={index} className="mb-4">
              <Card className="service-card h-100">
                <CardBody className="text-center">
                  <div className="service-icon-box" style={{ backgroundColor: `${service.color}15` }}>
                    <div className="service-icon" style={{ color: service.color }}>
                      {service.icon}
                    </div>
                  </div>
                  <h5 className="service-card-title">{service.title}</h5>
                  <p className="service-card-description">{service.description}</p>
                  <div className="service-pricing">
                    <span className="service-price">{service.price}</span>
                    <span className="service-duration">{service.duration}</span>
                  </div>
                  <Button
                    color="info"
                    className="service-book-btn w-100"
                    tag={Link}
                    to="/appointments"
                  >
                    Book Now
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Insurance & Payment Options */}
      <div className="insurance-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Insurance & Payment Options</h2>
          </div>
          <Row className="justify-content-center">
            {insuranceOptions.map((option, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <Card className="insurance-card text-center h-100 border-0">
                  <CardBody>
                    <div className="insurance-icon-wrapper mb-3" style={{ backgroundColor: `${option.color}15` }}>
                      <div className="insurance-icon" style={{ color: option.color }}>
                        {option.icon}
                      </div>
                    </div>
                    <h5 className="insurance-title">{option.title}</h5>
                    <p className="insurance-description">{option.description}</p>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <p className="consultation-text">Not sure which service you need?</p>
            <Button
              color="info"
              outline
              size="lg"
              className="consultation-btn"
              tag={Link}
              to="/contact"
            >
              Contact Us for Consultation
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Services;
