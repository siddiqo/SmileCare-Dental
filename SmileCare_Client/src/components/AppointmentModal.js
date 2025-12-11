import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const AppointmentModal = ({ isOpen, toggle, appointment, onSave, patients, dentists }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    dentistName: '',
    dentistId: '',
    date: '',
    time: '',
    service: '',
    status: 'Pending',
    notes: ''
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientName: appointment.patientName || '',
        patientId: appointment.patientId || '',
        dentistName: appointment.dentistName || '',
        dentistId: appointment.dentistId || '',
        date: appointment.date || '',
        time: appointment.time || '',
        service: appointment.service || '',
        status: appointment.status || 'Pending',
        notes: appointment.notes || ''
      });
    } else {
      setFormData({
        patientName: '',
        patientId: '',
        dentistName: '',
        dentistId: '',
        date: '',
        time: '',
        service: '',
        status: 'Pending',
        notes: ''
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'patientId') {
      const selectedPatient = patients?.find(p => p._id === value);
      setFormData({
        ...formData,
        patientId: value,
        patientName: selectedPatient ? selectedPatient.name : ''
      });
    } else if (name === 'dentistId') {
      const selectedDentist = dentists?.find(d => d._id === value);
      setFormData({
        ...formData,
        dentistId: value,
        dentistName: selectedDentist ? selectedDentist.name : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const services = [
    'General Checkup',
    'Teeth Whitening',
    'Dental Crown',
    'Root Canal',
    'Dental Implant',
    'Filling',
    'Teeth Cleaning',
    'Orthodontics',
    'Veneers',
    'Extraction'
  ];

  const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {appointment ? 'Edit Appointment' : 'New Appointment'}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="patientId">Patient *</Label>
            <Input
              type="select"
              name="patientId"
              id="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Select Patient</option>
              {patients?.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="dentistId">Dentist *</Label>
            <Input
              type="select"
              name="dentistId"
              id="dentistId"
              value={formData.dentistId}
              onChange={handleChange}
              required
            >
              <option value="">Select Dentist</option>
              {dentists?.map(dentist => (
                <option key={dentist._id} value={dentist._id}>
                  {dentist.name} - {dentist.specialty}
                </option>
              ))}
            </Input>
          </FormGroup>
          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label for="date">Date *</Label>
                <Input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="time">Time *</Label>
                <Input
                  type="time"
                  name="time"
                  id="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>
          </div>
          <FormGroup>
            <Label for="service">Service *</Label>
            <Input
              type="select"
              name="service"
              id="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="status">Status *</Label>
            <Input
              type="select"
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="notes">Notes</Label>
            <Input
              type="textarea"
              name="notes"
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes or instructions"
              rows="3"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <Button color="primary" type="submit">
            {appointment ? 'Update' : 'Create'} Appointment
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AppointmentModal;
