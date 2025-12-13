import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
  const contactMethods = [
    {
      icon: <FaPhone />,
      title: 'Phone',
      subtitle: 'Call us during business hours',
      info: '+968-91234567',
      link: 'tel:+96891234567',
      color: '#00d4ff'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      subtitle: 'Send us an email anytime',
      info: 'info@smilecare.om',
      link: 'mailto:info@smilecare.om',
      color: '#00d4ff'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      subtitle: 'Visit our office',
      info: 'Al Khuwair, Muscat',
      info2: 'Sultanate of Oman 🇴🇲',
      link: '#location',
      color: '#00d4ff'
    }
  ];

  const officeHours = [
    { day: 'Saturday', hours: '8:00 AM - 7:00 PM', highlight: false },
    { day: 'Sunday', hours: '8:00 AM - 7:00 PM', highlight: false },
    { day: 'Monday', hours: '8:00 AM - 7:00 PM', highlight: false },
    { day: 'Tuesday', hours: '8:00 AM - 7:00 PM', highlight: false },
    { day: 'Wednesday', hours: '8:00 AM - 7:00 PM', highlight: false },
    { day: 'Thursday', hours: '8:00 AM - 7:00 PM', highlight: false },
    { day: 'Friday', hours: '4:00 PM - 8:00 PM', highlight: true }
  ];

  return (
    <div className="contact-page">
      {/* Contact Header */}
      <div className="contact-header">
        <Container>
          <div className="text-center">
            <h1 className="contact-page-title">Contact Us</h1>
            <p className="contact-page-subtitle">
              Have questions or need assistance? We're here to help. Reach out to us through any of the methods below.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        {/* Contact Methods Cards */}
        <Row className="mb-5">
          {contactMethods.map((method, index) => (
            <Col lg={4} md={6} key={index} className="mb-4">
              <Card className="contact-method-card h-100 text-center border-0 shadow-sm">
                <CardBody>
                  <div className="contact-icon-wrapper mb-3" style={{ backgroundColor: `${method.color}15` }}>
                    <div className="contact-icon" style={{ color: method.color }}>
                      {method.icon}
                    </div>
                  </div>
                  <h5 className="contact-method-title">{method.title}</h5>
                  <p className="contact-method-subtitle text-muted">{method.subtitle}</p>
                  <a href={method.link} className="contact-method-info">
                    {method.info}
                    {method.info2 && (
                      <>
                        <br />
                        <span className="contact-country">{method.info2}</span>
                      </>
                    )}
                  </a>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Office Hours Section */}
        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <Card className="office-hours-card border-0 shadow-sm">
              <CardBody>
                <div className="office-hours-header mb-4">
                  <FaClock className="office-hours-icon me-2" />
                  <h4 className="office-hours-title mb-0">Office Hours</h4>
                </div>
                <div className="office-hours-list">
                  {officeHours.map((schedule, index) => (
                    <div
                      key={index}
                      className={`office-hours-row ${schedule.highlight ? 'highlight' : ''}`}
                    >
                      <span className="day-name">{schedule.day}</span>
                      <span className={`hours-time ${schedule.highlight ? 'text-info' : ''}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="office-hours-timezone text-center mt-3 mb-0">
                  Gulf Standard Time (GMT+4)
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Location Map Section */}
        <Row className="mb-5" id="location">
          <Col>
            <Card className="location-card border-0 shadow-sm">
              <CardBody className="p-4">
                <div className="text-center mb-4">
                  <div className="location-icon-wrapper mb-3">
                    <FaMapMarkerAlt className="location-icon" />
                  </div>
                  <h5 className="location-title mb-2">Our Clinic Location</h5>
                  <p className="location-subtitle mb-0">Al Khuwair, Muscat, Sultanate of Oman 🇴🇲</p>
                </div>

                {/* Embedded Google Map - Following utas-post pattern */}
                <div className="map-container mb-4">
                  <iframe
                    src="https://maps.google.com/maps?q=23.5880,58.3829&hl=es;&output=embed"
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SmileCare Dental Clinic Location"
                  />
                </div>

                <div className="text-center">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=23.5880,58.3829"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-info get-directions-btn"
                  >
                    <FaMapMarkerAlt className="me-2" />
                    Get Directions
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Emergency Contact Section */}
        <Row>
          <Col>
            <Card className="emergency-card border-0">
              <CardBody className="text-center p-4">
                <h5 className="emergency-title mb-3">Dental Emergency?</h5>
                <p className="emergency-text mb-3">
                  If you're experiencing a dental emergency, please call us immediately at{' '}
                  <a href="tel:+96891234567" className="emergency-phone">
                    OM +968-91234567
                  </a>
                </p>
                <p className="emergency-subtext mb-0">
                  We offer same-day emergency appointments during business hours.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
