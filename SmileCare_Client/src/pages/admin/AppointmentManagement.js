import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert, Input } from 'reactstrap';
import { FaSearch, FaEye, FaEdit, FaTrash, FaFilter, FaCalendarPlus } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import AppointmentModal from '../../components/AppointmentModal';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleAddNew = () => {
    setSelectedAppointment(null);
    setModalOpen(true);
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
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
                          <div className="action-buttons">
                            <button className="action-icon view-icon" title="View">
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
      </div>
    </AdminLayout>
  );
};

export default AppointmentManagement;
