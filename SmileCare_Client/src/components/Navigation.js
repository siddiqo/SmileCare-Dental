import React, { useState, useEffect } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Collapse,
  NavbarToggler,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { FaTooth, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkUser = () => {
      const storedUser = localStorage.getItem('smileCareUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for storage changes (login/logout from other tabs/components)
    window.addEventListener('storage', checkUser);

    // Listen for custom login event
    window.addEventListener('userLoggedIn', checkUser);

    // Check for user on window focus
    window.addEventListener('focus', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userLoggedIn', checkUser);
      window.removeEventListener('focus', checkUser);
    };
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const toggleAuthModal = () => setAuthModalOpen(!authModalOpen);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('smileCareUser');
    setUser(null);
    navigate('/');
    window.location.reload(); // Refresh to update all components
  };

  return (
    <Navbar color="light" light expand="md" className="shadow-sm sticky-top">
      <Container>
        <NavbarBrand tag={Link} to="/" className="d-flex align-items-center">
          <div className="logo-circle me-2">
            <FaTooth className="logo-icon" />
          </div>
          <div>
            <div className="brand-name">SmileCare Dental</div>
            <div className="brand-location">Muscat, Oman</div>
          </div>
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto align-items-center" navbar>
            <NavItem>
              <NavLink tag={Link} to="/" className="nav-link-custom">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/services" className="nav-link-custom">
                Services
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/appointments" className="nav-link-custom">
                Book Appointment
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/contact" className="nav-link-custom">
                Contact
              </NavLink>
            </NavItem>

            {user ? (
              <UncontrolledDropdown nav inNavbar className="ms-md-3">
                <DropdownToggle nav caret className="user-dropdown">
                  <FaUser className="me-2" />
                  {user.email}
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem header>
                    <strong>{user.name}</strong>
                  </DropdownItem>
                  <DropdownItem divider />
                  {user.role === 'admin' && (
                    <>
                      <DropdownItem tag={Link} to="/admin/dashboard">
                        Admin Dashboard
                      </DropdownItem>
                      <DropdownItem divider />
                    </>
                  )}
                  <DropdownItem onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            ) : (
              <NavItem className="ms-md-3">
                <Button color="info" className="login-btn" onClick={toggleAuthModal}>
                  <i className="bi bi-person-circle me-1"></i> Login / Register
                </Button>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Container>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        toggle={toggleAuthModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </Navbar>
  );
};

export default Navigation;
