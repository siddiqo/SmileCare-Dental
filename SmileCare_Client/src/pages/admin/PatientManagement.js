import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert, Input } from 'reactstrap';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import PatientModal from '../../components/PatientModal';
import API_URL from '../../config/api';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/patients`);
      const data = await response.json();
      if (data.flag) {
        setPatients(data.patients);
        setFilteredPatients(data.patients);
      }
    } catch (error) {
      showAlert('Failed to fetch patients', 'danger');
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    );
    setFilteredPatients(filtered);
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
      setSelectedPatient(null);
    }
  };

  const handleAddNew = () => {
    setSelectedPatient(null);
    setModalOpen(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`${API_URL}/patients/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.flag) {
          showAlert(data.serverMsg, 'success');
          fetchPatients();
        } else {
          showAlert(data.serverMsg, 'danger');
        }
      } catch (error) {
        showAlert('Failed to delete patient', 'danger');
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      const url = selectedPatient
        ? `${API_URL}/patients/${selectedPatient._id}`
        : `${API_URL}/patients`;

      const method = selectedPatient ? 'PUT' : 'POST';

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
        fetchPatients();
      } else {
        showAlert(data.serverMsg, 'danger');
      }
    } catch (error) {
      showAlert('Operation failed', 'danger');
      console.error('Error saving patient:', error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h2>Patient Management</h2>
            <p className="text-muted">Manage registered patients and their information</p>
          </div>
          <Button color="primary" onClick={handleAddNew}>
            <FaUserPlus /> Add New Patient
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
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-3">Loading patients...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No patients found
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((patient, index) => (
                      <tr key={patient._id}>
                        <td>#{indexOfFirstItem + index + 1}</td>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                        <td>{patient.phone}</td>
                        <td>
                          <span style={{ textTransform: 'capitalize' }}>
                            {patient.gender || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-icon view-icon" title="View">
                              <FaEye />
                            </button>
                            <button
                              className="action-icon edit-icon"
                              onClick={() => handleEdit(patient)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-icon delete-icon"
                              onClick={() => handleDelete(patient._id)}
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
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPatients.length)} of {filteredPatients.length} patients
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

        <PatientModal
          isOpen={modalOpen}
          toggle={toggleModal}
          patient={selectedPatient}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
};

export default PatientManagement;
