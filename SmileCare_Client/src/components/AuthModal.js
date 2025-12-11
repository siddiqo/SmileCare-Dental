import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert
} from 'reactstrap';
import { FaTooth, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const AuthModal = ({ isOpen, toggle, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000';

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
    setAlert({ show: false, message: '', type: '' });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/userLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.loginStatus) {
        // Store user data in localStorage
        localStorage.setItem('smileCareUser', JSON.stringify(data.user));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('userLoggedIn'));

        showAlert(data.serverMsg, 'success');

        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/admin/dashboard');
            toggle();
          } else {
            onLoginSuccess(data.user);
            toggle();
          }
        }, 1000);
      } else {
        showAlert(data.serverMsg, 'danger');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('Login failed. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/userRegister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (data.flag) {
        showAlert(data.serverMsg + ' Please login now.', 'success');
        setTimeout(() => {
          setActiveTab('login');
          setRegisterData({
            fullName: '',
            email: '',
            phone: '',
            password: ''
          });
        }, 2000);
      } else {
        showAlert(data.serverMsg, 'danger');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showAlert('Registration failed. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md" className="auth-modal">
      <button className="auth-modal-close" onClick={toggle}>×</button>
      <ModalBody className="p-0">
        <div className="auth-modal-header">
          <div className="auth-logo-wrapper">
            <FaTooth className="auth-logo-icon" />
          </div>
          <h4 className="auth-modal-title">Welcome to SmileCare</h4>
          <p className="auth-modal-subtitle">Your dental health is our priority</p>
        </div>

        <div className="auth-tabs-wrapper">
          <Nav tabs className="auth-tabs">
            <NavItem className="flex-fill">
              <NavLink
                className={activeTab === 'login' ? 'active' : ''}
                onClick={() => toggleTab('login')}
              >
                Login
              </NavLink>
            </NavItem>
            <NavItem className="flex-fill">
              <NavLink
                className={activeTab === 'register' ? 'active' : ''}
                onClick={() => toggleTab('register')}
              >
                Register
              </NavLink>
            </NavItem>
          </Nav>

          {alert.show && (
            <Alert color={alert.type} className="mx-3 mt-3 mb-0">
              {alert.message}
            </Alert>
          )}

          <TabContent activeTab={activeTab} className="auth-tab-content">
            {/* Login Tab */}
            <TabPane tabId="login">
              <Form onSubmit={handleLoginSubmit} className="auth-form">
                <FormGroup>
                  <Label for="loginEmail">Email Address</Label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <Input
                      type="email"
                      name="email"
                      id="loginEmail"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="loginPassword">Password</Label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <Input
                      type="password"
                      name="password"
                      id="loginPassword"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </FormGroup>
                <Button type="submit" color="info" className="auth-submit-btn w-100" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form>
            </TabPane>

            {/* Register Tab */}
            <TabPane tabId="register">
              <Form onSubmit={handleRegisterSubmit} className="auth-form">
                <FormGroup>
                  <Label for="registerName">Full Name</Label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <Input
                      type="text"
                      name="fullName"
                      id="registerName"
                      placeholder="Ahmed Al-Rashid"
                      value={registerData.fullName}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="registerEmail">Email Address</Label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <Input
                      type="email"
                      name="email"
                      id="registerEmail"
                      placeholder="your.email@example.com"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="registerPhone">Phone Number</Label>
                  <div className="input-with-icon">
                    <FaPhone className="input-icon" />
                    <Input
                      type="tel"
                      name="phone"
                      id="registerPhone"
                      placeholder="OM +968- 9XXXXXXX"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="registerPassword">Password</Label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <Input
                      type="password"
                      name="password"
                      id="registerPassword"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      minLength="6"
                    />
                  </div>
                  <small className="text-muted">At least 6 characters</small>
                </FormGroup>
                <Button type="submit" color="info" className="auth-submit-btn w-100" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Form>
            </TabPane>
          </TabContent>
        </div>

        <div className="auth-modal-footer">
          <FaMapMarkerAlt className="me-1" style={{ color: '#dc3545' }} />
          <small>Based in Muscat, Oman 🇴🇲</small>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AuthModal;
