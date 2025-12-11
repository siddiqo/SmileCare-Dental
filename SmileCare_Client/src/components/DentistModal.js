import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const DentistModal = ({ isOpen, toggle, dentist, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    phone: '',
    image: ''
  });

  useEffect(() => {
    if (dentist) {
      setFormData({
        name: dentist.name || '',
        email: dentist.email || '',
        specialty: dentist.specialty || '',
        phone: dentist.phone || '',
        image: dentist.image || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        specialty: '',
        phone: '',
        image: ''
      });
    }
  }, [dentist]);

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

  const specialties = [
    'General Dentistry',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Pediatric Dentistry',
    'Periodontics',
    'Endodontics',
    'Oral Surgery',
    'Prosthodontics'
  ];

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {dentist ? 'Edit Dentist' : 'Add New Dentist'}
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
              placeholder="Dr. John Smith"
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
              placeholder="john.smith@smilecare.com"
            />
          </FormGroup>
          <FormGroup>
            <Label for="specialty">Specialty *</Label>
            <Input
              type="select"
              name="specialty"
              id="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
            >
              <option value="">Select Specialty</option>
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </FormGroup>
          <FormGroup>
            <Label for="image">Image URL</Label>
            <Input
              type="url"
              name="image"
              id="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <small className="form-text text-muted">
              Leave empty for default image
            </small>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <Button color="primary" type="submit">
            {dentist ? 'Update' : 'Add'} Dentist
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default DentistModal;
