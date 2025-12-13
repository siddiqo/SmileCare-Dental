import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FaSearch, FaEye, FaEdit, FaTrash, FaFilter, FaCalendarPlus, FaMapMarkerAlt } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import AppointmentModal from '../../components/AppointmentModal';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDentists();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/appointments`);
      const data = await response.json();
      if (data.flag) {
        setAppointments(data.appointments);
        setFilteredAppointments(data.appointments);
      }
    } catch (error) {
      showAlert('Failed to fetch appointments', 'danger');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_URL}/patients`);
      const data = await response.json();
      if (data.flag) {
        setPatients(data.patients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDentists = async () => {
    try {
      const response = await fetch(`${API_URL}/dentists`);
      const data = await response.json();
      if (data.flag) {
        setDentists(data.dentists);
      }
    } catch (error) {
      console.error('Error fetching dentists:', error);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.dentistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
    setCurrentPage(1);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      setSelectedAppointment(null);
    }
  };

  const toggleViewModal = () => {
    setViewModalOpen(!viewModalOpen);
    if (viewModalOpen) {
      setSelectedAppointment(null);
    }
  };

  const handleAddNew = () => {
    setSelectedAppointment(null);
    setModalOpen(true);
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`${API_URL}/appointments/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.flag) {
          showAlert(data.serverMsg, 'success');
          fetchAppointments();
        } else {
          showAlert(data.serverMsg, 'danger');
        }
      } catch (error) {
        showAlert('Failed to delete appointment', 'danger');
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      const url = selectedAppointment
        ? `${API_URL}/appointments/${selectedAppointment._id}`
        : `${API_URL}/appointments`;

      const method = selectedAppointment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.flag) {
        showAlert(data.serverMsg, 'success');
        toggleModal();
        fetchAppointments();
      } else {
        showAlert(data.serverMsg, 'danger');
      }
    } catch (error) {
      showAlert('Operation failed', 'danger');
      console.error('Error saving appointment:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Confirmed': 'status-confirmed',
      'Pending': 'status-pending',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-default';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h2>Appointment Management</h2>
            <p className="text-muted">View and manage all patient appointments</p>
            <small className="text-muted">All times in Gulf Standard Time (GMT+4) • Date format: DD/MM/YYYY</small>
          </div>
          <Button color="primary" onClick={handleAddNew}>
            <FaCalendarPlus /> New Appointment
          </Button>
        </div>

        {alert.show && (
          <Alert color={alert.type} className="mt-3">
            {alert.message}
          </Alert>
        )}

        <div className="table-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <Input
              type="text"
              placeholder="Search by patient or dentist name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <Input
              type="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </Input>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-3">Loading appointments...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient Name</th>
                    <th>Dentist</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No appointments found
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((appointment, index) => (
                      <tr key={appointment._id}>
                        <td>#{indexOfFirstItem + index + 1}</td>
                        <td>{appointment.patientName}</td>
                        <td>{appointment.dentistName}</td>
                        <td>{appointment.date}</td>
                        <td>{formatTime(appointment.time)}</td>
                        <td>{appointment.service}</td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          {appointment.lat && appointment.lon ? (
                            <span className="text-success" title="Location available">
                              <FaMapMarkerAlt /> Available
                            </span>
                          ) : (
                            <span className="text-muted">Not shared</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-icon view-icon"
                              onClick={() => handleView(appointment)}
                              title="View"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="action-icon edit-icon"
                              onClick={() => handleEdit(appointment)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-icon delete-icon"
                              onClick={() => handleDelete(appointment._id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <span className="pagination-info">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAppointments.length)} of {filteredAppointments.length} appointments
                </span>
                <div className="pagination-buttons">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <AppointmentModal
          isOpen={modalOpen}
          toggle={toggleModal}
          appointment={selectedAppointment}
          onSave={handleSave}
          patients={patients}
          dentists={dentists}
        />

        {/* View Details Modal */}
        <Modal isOpen={viewModalOpen} toggle={toggleViewModal} size="lg">
          <ModalHeader toggle={toggleViewModal}>
            Appointment Details
          </ModalHeader>
          <ModalBody>
            {selectedAppointment && (
              <div className="appointment-details">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Patient Information</h6>
                    <p className="mb-1"><strong>Name:</strong> {selectedAppointment.patientName}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Dentist Information</h6>
                    <p className="mb-1"><strong>Name:</strong> {selectedAppointment.dentistName}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Appointment Schedule</h6>
                    <p className="mb-1"><strong>Date:</strong> {selectedAppointment.date}</p>
                    <p className="mb-1"><strong>Time:</strong> {formatTime(selectedAppointment.time)}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Service & Status</h6>
                    <p className="mb-1"><strong>Service:</strong> {selectedAppointment.service}</p>
                    <p className="mb-1">
                      <strong>Status:</strong>{' '}
                      <span className={`status-badge ${getStatusBadgeClass(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </p>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="row mb-3">
                    <div className="col-12">
                      <h6 className="text-muted mb-2">Notes</h6>
                      <p className="mb-0">{selectedAppointment.notes}</p>
                    </div>
                  </div>
                )}

                {/* Location Map - Following ShowPosts.js pattern */}
                {selectedAppointment.lat && selectedAppointment.lon ? (
                  <div className="row">
                    <div className="col-12">
                      <h6 className="text-muted mb-2">
                        <FaMapMarkerAlt className="me-2" />
                        Patient Location
                      </h6>
                      <div className="border rounded p-2" style={{ backgroundColor: '#f8f9fa' }}>
                        <iframe
                          src={`https://maps.google.com/maps?q=${selectedAppointment.lat},${selectedAppointment.lon}&hl=es;&output=embed`}
                          width="100%"
                          height="300"
                          style={{ border: 0, borderRadius: '8px' }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Patient Location"
                        />
                        <p className="text-muted text-center mt-2 mb-0" style={{ fontSize: '0.9rem' }}>
                          Coordinates: {selectedAppointment.lat.toFixed(6)}, {selectedAppointment.lon.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-info mb-0">
                        <FaMapMarkerAlt className="me-2" />
                        Patient did not share their location for this appointment.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleViewModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AppointmentManagement;
