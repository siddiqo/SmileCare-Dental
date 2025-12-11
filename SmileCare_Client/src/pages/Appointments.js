import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormText,
  Alert
} from 'reactstrap';
import AuthModal from '../components/AuthModal';
import { FaCalendarAlt, FaClock, FaLock, FaUserCircle } from 'react-icons/fa';

const Appointments = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('smileCareUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      setFormData(prev => ({ ...prev, email: userData.email }));
    }
  }, []);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    dentist: '',
    date: '',
    time: '',
    notes: '',
    agreeToTerms: false
  });

  const services = [
    'General Checkup',
    'Teeth Whitening',
    'Dental Crowns',
    'Dental Implants',
    'Root Canal',
    'Fillings',
    'Pediatric Dentistry',
    'Emergency Care'
  ];

  const dentists = [
    'Dr. Ahmed Al-Kindi',
    'Dr. Fatima Al-Balushi',
    'Dr. Mohammed Al-Lawati',
    'Dr. Sara Al-Harthy'
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    // Pre-fill email from user data
    setFormData(prev => ({ ...prev, email: userData.email }));
    // Dispatch event to update Navigation
    window.dispatchEvent(new Event('userLoggedIn'));
  };

  const openAuthModal = () => {
    setAuthModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the appointment data to your backend
    console.log('Appointment Data:', formData);
    alert('Appointment request submitted! We will confirm your appointment shortly.');
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      service: '',
      dentist: '',
      date: '',
      time: '',
      notes: '',
      agreeToTerms: false
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="appointments-page">
          {/* Appointments Header */}
          <div className="appointments-header">
            <Container>
              <div className="text-center">
                <h1 className="appointments-page-title">Book an Appointment</h1>
                <p className="appointments-page-subtitle">
                  Schedule your visit with our expert dental team
                </p>
              </div>
            </Container>
          </div>

          <Container className="py-5">
            <Row className="justify-content-center">
              <Col lg={8}>
                <Card className="login-required-card border-0 shadow text-center">
                  <CardBody className="p-5">
                    <div className="login-required-icon mb-4">
                      <FaLock size={60} color="#00d4ff" />
                    </div>
                    <h3 className="mb-3">Login Required</h3>
                    <Alert color="info" className="mb-4">
                      <FaUserCircle className="me-2" size={20} />
                      You need to login to book an appointment
                    </Alert>
                    <p className="text-muted mb-4">
                      Please sign in to your account or create a new one to schedule your dental appointment.
                      Don't worry, it only takes a minute!
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                      <Button
                        color="info"
                        size="lg"
                        onClick={openAuthModal}
                        className="px-5"
                      >
                        Login / Register
                      </Button>
                    </div>

                    <div className="mt-5 pt-4 border-top">
                      <h5 className="mb-3">Why create an account?</h5>
                      <Row className="text-start">
                        <Col md={6}>
                          <ul className="benefits-list">
                            <li>Quick and easy booking</li>
                            <li>View appointment history</li>
                            <li>Manage your profile</li>
                          </ul>
                        </Col>
                        <Col md={6}>
                          <ul className="benefits-list">
                            <li>Receive appointment reminders</li>
                            <li>Access medical records</li>
                            <li>Priority customer support</li>
                          </ul>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          toggle={() => setAuthModalOpen(!authModalOpen)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <div className="appointments-page">
      {/* Appointments Header */}
      <div className="appointments-header">
        <Container>
          <div className="text-center">
            <h1 className="appointments-page-title">Book an Appointment</h1>
            <p className="appointments-page-subtitle">
              Fill out the form below to schedule your visit. We'll confirm your appointment shortly.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="appointment-form-card border-0 shadow">
              <CardBody className="p-4 p-md-5">
                <Form onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <h5 className="section-heading">Personal Information</h5>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="firstName">First Name *</Label>
                        <Input
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="lastName">Last Name *</Label>
                        <Input
                          type="text"
                          name="lastName"
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email">Email *</Label>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="phone">Phone Number *</Label>
                        <Input
                          type="tel"
                          name="phone"
                          id="phone"
                          placeholder="OM +968- 9XXXXXXX"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                        <FormText color="muted">
                          Omani mobile format: 9XXXXXXX
                        </FormText>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Appointment Details Section */}
                  <h5 className="section-heading mt-4">Appointment Details</h5>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="service">Select Service *</Label>
                        <Input
                          type="select"
                          name="service"
                          id="service"
                          value={formData.service}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Choose a service</option>
                          {services.map((service, index) => (
                            <option key={index} value={service}>
                              {service}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="dentist">Select Dentist *</Label>
                        <Input
                          type="select"
                          name="dentist"
                          id="dentist"
                          value={formData.dentist}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Choose a dentist</option>
                          {dentists.map((dentist, index) => (
                            <option key={index} value={dentist}>
                              {dentist}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="date">
                          <FaCalendarAlt className="me-2" />
                          Select Date *
                        </Label>
                        <Input
                          type="date"
                          name="date"
                          id="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="time">
                          <FaClock className="me-2" />
                          Select Time *
                        </Label>
                        <Input
                          type="select"
                          name="time"
                          id="time"
                          value={formData.time}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Choose a time</option>
                          {timeSlots.map((time, index) => (
                            <option key={index} value={time}>
                              {time}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup>
                    <Label for="notes">Additional Notes (Optional)</Label>
                    <Input
                      type="textarea"
                      name="notes"
                      id="notes"
                      rows="3"
                      placeholder="Any specific concerns or requests?"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  {/* Terms and Conditions */}
                  <FormGroup check className="mb-4">
                    <Input
                      type="checkbox"
                      name="agreeToTerms"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                    />
                    <Label check for="agreeToTerms">
                      I agree to the{' '}
                      <a href="#privacy" className="terms-link">
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a href="#terms" className="terms-link">
                        Terms of Service
                      </a>
                      . *
                    </Label>
                  </FormGroup>

                  {/* Submit Buttons */}
                  <div className="d-flex gap-3">
                    <Button type="submit" color="info" size="lg" className="flex-fill appointment-submit-btn">
                      Confirm Appointment
                    </Button>
                    <Button type="button" color="secondary" outline size="lg" className="appointment-cancel-btn">
                      Cancel
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>

            {/* Before Your Appointment Info */}
            <Card className="appointment-info-card border-0 shadow mt-4">
              <CardBody className="p-4">
                <h5 className="info-card-title">Before Your Appointment</h5>
                <ul className="info-list">
                  <li>Please arrive 10 minutes early to complete any necessary paperwork</li>
                  <li>Bring your insurance card and a valid ID (Omani Civil ID or Passport)</li>
                  <li>If you need to cancel or reschedule, please contact us at least 24 hours in advance</li>
                  <li>For emergency appointments, please call us directly at OM +968-91234567</li>
                  <li>Note: Friday hours are 4:00 PM - 8:00 PM (limited slots available)</li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Appointments;
