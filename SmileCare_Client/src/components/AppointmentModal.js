import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { FaClock } from 'react-icons/fa';

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

  const [bookedSlots, setBookedSlots] = useState([]);
  const API_URL = 'http://localhost:5000';

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const fetchBookedSlots = async (dentistId, date, excludeAppointmentId = null) => {
    if (!dentistId || !date) {
      setBookedSlots([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/appointments`);
      const data = await response.json();
      if (data.flag && data.appointments) {
        // Filter appointments for selected dentist and date
        const booked = data.appointments
          .filter(apt =>
            apt.dentistId === dentistId &&
            apt.date === date &&
            apt.status !== 'Cancelled' &&
            apt._id !== excludeAppointmentId // Exclude current appointment when editing
          )
          .map(apt => apt.time);
        setBookedSlots(booked);
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

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
      // Fetch booked slots for the current appointment's dentist and date
      if (appointment.dentistId && appointment.date) {
        fetchBookedSlots(appointment.dentistId, appointment.date, appointment._id);
      }
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
      setBookedSlots([]);
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'patientId') {
      const selectedPatient = patients?.find(p => p._id === value);
      setFormData(prev => ({
        ...prev,
        patientId: value,
        patientName: selectedPatient ? selectedPatient.name : ''
      }));
    } else if (name === 'dentistId') {
      const selectedDentist = dentists?.find(d => d._id === value);
      setFormData(prev => {
        const updated = {
          ...prev,
          dentistId: value,
          dentistName: selectedDentist ? selectedDentist.name : ''
        };
        // Fetch booked slots if date is already selected
        if (prev.date) {
          fetchBookedSlots(value, prev.date, appointment?._id);
        }
        return updated;
      });
    } else if (name === 'date') {
      setFormData(prev => {
        // Fetch booked slots if dentist is already selected
        if (prev.dentistId) {
          fetchBookedSlots(prev.dentistId, value, appointment?._id);
        }
        return {
          ...prev,
          [name]: value
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
                <Label for="time">
                  <FaClock className="me-2" />
                  Time *
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
