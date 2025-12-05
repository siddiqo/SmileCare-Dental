import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Collapse,
  NavbarToggler,
  Container
} from 'reactstrap';
import { FaTooth } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

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
            <NavItem className="ms-md-3">
              <Button color="info" className="login-btn" tag={Link} to="/login">
                <i className="bi bi-person-circle me-1"></i> Login / Register
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
