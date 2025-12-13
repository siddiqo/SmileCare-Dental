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
import { FaCalendarAlt, FaClock, FaLock, FaUserCircle, FaMapMarkerAlt } from 'react-icons/fa';
import API_URL from '../config/api';

const Appointments = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('smileCareUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      fetchPatientData(userData.email);
    }
    // Fetch dentists from database
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    try {
      const response = await fetch(`${API_URL}/dentists`);
      const data = await response.json();
      if (data.flag && data.dentists) {
        setDentists(data.dentists);
      }
    } catch (error) {
      console.error('Error fetching dentists:', error);
    }
  };

  const fetchPatientData = async (email) => {
    try {
      const response = await fetch(`${API_URL}/patients`);
      const data = await response.json();
      if (data.flag && data.patients) {
        const patientData = data.patients.find(p => p.email === email);
        if (patientData) {
          setPatient(patientData);
          // Auto-fill form with patient data
          const nameParts = patientData.name.split(' ');
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: patientData.email,
            phone: patientData.phone || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const fetchBookedSlots = async (dentistId, date) => {
    if (!dentistId || !date) return;

    try {
      const response = await fetch(`${API_URL}/appointments`);
      const data = await response.json();
      if (data.flag && data.appointments) {
        // Filter appointments for selected dentist and date
        const booked = data.appointments
          .filter(apt =>
            apt.dentistId === dentistId &&
            apt.date === date &&
            apt.status !== 'Cancelled'
          )
          .map(apt => apt.time);
        setBookedSlots(booked);
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    dentist: '',
    dentistId: '',
    date: '',
    time: '',
    notes: '',
    agreeToTerms: false
  });

  // Location-based service - Following utas-post pattern
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [locationCaptured, setLocationCaptured] = useState(false);

  const captureLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
      setLocationCaptured(true);
      showAlert('Location captured successfully!', 'success');
    }, (error) => {
      console.error('Error getting location:', error);
      showAlert('Unable to capture location. Please enable location services.', 'danger');
    });
  };

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

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setAuthModalOpen(false); // Explicitly close the modal
    // Fetch and pre-fill patient data
    fetchPatientData(userData.email);
    // Dispatch event to update Navigation
    window.dispatchEvent(new Event('userLoggedIn'));
  };

  const toggleAuthModal = () => {
    setAuthModalOpen(!authModalOpen);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };

      // If dentist is changed, store dentist ID and fetch booked slots
      if (name === 'dentist') {
        const selectedDentist = dentists.find(d => d.name === value);
        if (selectedDentist) {
          updated.dentistId = selectedDentist._id;
          // Fetch booked slots if date is already selected
          if (prev.date) {
            fetchBookedSlots(selectedDentist._id, prev.date);
          }
        }
      }

      // If date is changed, fetch booked slots if dentist is selected
      if (name === 'date' && prev.dentistId) {
        fetchBookedSlots(prev.dentistId, value);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if selected time slot is already booked
    if (bookedSlots.includes(formData.time)) {
      showAlert('This time slot is already booked! Please select another time.', 'danger');
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        patientName: `${formData.firstName} ${formData.lastName}`,
        patientId: patient?._id || null,
        dentistName: formData.dentist,
        dentistId: formData.dentistId,
        date: formData.date,
        time: formData.time,
        service: formData.service,
        status: 'Pending',
        notes: formData.notes,
        lat: lat,
        lon: lon
      };

      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (data.flag) {
        showAlert('Appointment request submitted successfully! We will confirm your appointment shortly.', 'success');
        // Reset form but keep user data
        setFormData({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          service: '',
          dentist: '',
          dentistId: '',
          date: '',
          time: '',
          notes: '',
          agreeToTerms: false
        });
        setBookedSlots([]);
      } else {
        showAlert(data.serverMsg || 'Failed to submit appointment. Please try again.', 'danger');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      showAlert('Failed to submit appointment. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
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
                        onClick={toggleAuthModal}
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
          toggle={toggleAuthModal}
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
                {alert.show && (
                  <Alert color={alert.type} className="mb-4">
                    {alert.message}
                  </Alert>
                )}
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
                          {dentists.map((dentist) => (
                            <option key={dentist._id} value={dentist.name}>
                              {dentist.name} - {dentist.specialty}
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
                          {timeSlots.map((time, index) => {
                            const isBooked = bookedSlots.includes(time);
                            return (
                              <option
                                key={index}
                                value={time}
                                disabled={isBooked}
                                style={{ color: isBooked ? '#999' : 'inherit' }}
                              >
                                {time} {isBooked ? '(Booked)' : ''}
                              </option>
                            );
                          })}
                        </Input>
                        {bookedSlots.length > 0 && (
                          <FormText color="muted">
                            Greyed out slots are already booked
                          </FormText>
                        )}
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

                  {/* Location-Based Service - Following utas-post pattern */}
                  <FormGroup>
                    <Label>Share Your Location (Optional)</Label>
                    <div className="location-section p-3 border rounded">
                      {!locationCaptured ? (
                        <div className="text-center">
                          <p className="text-muted mb-3">
                            Sharing your location helps us provide better directions and service
                          </p>
                          <Button
                            type="button"
                            color="info"
                            outline
                            onClick={captureLocation}
                          >
                            <FaMapMarkerAlt className="me-2" />
                            Capture My Location
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-success">
                              <FaMapMarkerAlt className="me-2" />
                              Location Captured
                            </span>
                            <Button
                              type="button"
                              color="danger"
                              size="sm"
                              outline
                              onClick={() => {
                                setLat(null);
                                setLon(null);
                                setLocationCaptured(false);
                              }}
                            >
                              Remove Location
                            </Button>
                          </div>
                          <div className="map-preview">
                            <iframe
                              src={`https://maps.google.com/maps?q=${lat},${lon}&h1=es;&output=embed`}
                              width="100%"
                              height="250"
                              style={{ border: 0, borderRadius: '8px' }}
                              loading="lazy"
                              title="Your Location"
                            />
                          </div>
                          <p className="text-muted mt-2 mb-0 small">
                            Coordinates: {lat?.toFixed(6)}, {lon?.toFixed(6)}
                          </p>
                        </div>
                      )}
                    </div>
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
                    <Button
                      type="submit"
                      color="info"
                      size="lg"
                      className="flex-fill appointment-submit-btn"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Confirm Appointment'}
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      outline
                      size="lg"
                      className="appointment-cancel-btn"
                      disabled={loading}
                    >
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
