import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { FaCalendarAlt, FaClock, FaShieldAlt, FaUserMd } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaCalendarAlt className="feature-icon" />,
      title: 'Easy Booking',
      description: 'Schedule your appointment online in just a few clicks'
    },
    {
      icon: <FaClock className="feature-icon" />,
      title: 'Flexible Hours',
      description: 'Open Sunday-Thursday with convenient appointment times'
    },
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: 'Safe & Sterile',
      description: 'State-of-the-art equipment and sterilization protocols'
    },
    {
      icon: <FaUserMd className="feature-icon" />,
      title: 'Expert Team',
      description: 'Board-certified dentists with years of experience'
    }
  ];

  return (
    <div className="features-section">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Why Choose SmileCare?</h2>
        </div>
        <Row>
          {features.map((feature, index) => (
            <Col md={6} lg={3} key={index} className="mb-4">
              <Card className="feature-card h-100 border-0 shadow-sm">
                <CardBody className="text-center">
                  <div className="feature-icon-wrapper mb-3">
                    {feature.icon}
                  </div>
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-description text-muted">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Features;
