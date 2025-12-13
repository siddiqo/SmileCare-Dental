import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const PatientModal = ({ isOpen, toggle, patient, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    medicalHistory: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
        gender: patient.gender || '',
        address: patient.address || '',
        medicalHistory: patient.medicalHistory || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        medicalHistory: ''
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {patient ? 'Edit Patient' : 'Add New Patient'}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="name">Full Name *</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ahmed Al-Rashid"
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email *</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ahmed.r@email.com"
            />
          </FormGroup>
          <FormGroup>
            <Label for="phone">Phone *</Label>
            <Input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+968-91234567"
            />
          </FormGroup>
          <FormGroup>
            <Label for="dateOfBirth">Date of Birth</Label>
            <Input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Gender</Label>
            <div className="d-flex gap-3 mt-2">
              <div className="form-check">
                <Input
                  type="radio"
                  name="gender"
                  id="genderMale"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <Label className="form-check-label" for="genderMale">
                  Male
                </Label>
              </div>
              <div className="form-check">
                <Input
                  type="radio"
                  name="gender"
                  id="genderFemale"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <Label className="form-check-label" for="genderFemale">
                  Female
                </Label>
              </div>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="address">Address</Label>
            <Input
              type="textarea"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter patient address"
              rows="2"
            />
          </FormGroup>
          <FormGroup>
            <Label for="medicalHistory">Medical History</Label>
            <Input
              type="textarea"
              name="medicalHistory"
              id="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Enter relevant medical history"
              rows="3"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <Button color="primary" type="submit">
            {patient ? 'Update' : 'Add'} Patient
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default PatientModal;
