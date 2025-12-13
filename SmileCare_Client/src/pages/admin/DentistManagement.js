import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert } from 'reactstrap';
import AdminLayout from '../../components/AdminLayout';
import DentistCard from '../../components/DentistCard';
import DentistModal from '../../components/DentistModal';
import API_URL from '../../config/api';

const DentistManagement = () => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/dentists`);
      const data = await response.json();
      if (data.flag) {
        setDentists(data.dentists);
      }
    } catch (error) {
      showAlert('Failed to fetch dentists', 'danger');
      console.error('Error fetching dentists:', error);
    } finally {
      setLoading(false);
    }
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
      setSelectedDentist(null);
    }
  };

  const handleAddNew = () => {
    setSelectedDentist(null);
    setModalOpen(true);
  };

  const handleEdit = (dentist) => {
    setSelectedDentist(dentist);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dentist?')) {
      try {
        const response = await fetch(`${API_URL}/dentists/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.flag) {
          showAlert(data.serverMsg, 'success');
          fetchDentists();
        } else {
          showAlert(data.serverMsg, 'danger');
        }
      } catch (error) {
        showAlert('Failed to delete dentist', 'danger');
        console.error('Error deleting dentist:', error);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      const url = selectedDentist
        ? `${API_URL}/dentists/${selectedDentist._id}`
        : `${API_URL}/dentists`;

      const method = selectedDentist ? 'PUT' : 'POST';

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
        fetchDentists();
      } else {
        showAlert(data.serverMsg, 'danger');
      }
    } catch (error) {
      showAlert('Operation failed', 'danger');
      console.error('Error saving dentist:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h2>Dentist Management</h2>
            <p className="text-muted">Manage and update our dentists</p>
          </div>
          <Button color="primary" onClick={handleAddNew}>
            + Add New Dentist
          </Button>
        </div>

        {alert.show && (
          <Alert color={alert.type} className="mt-3">
            {alert.message}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-3">Loading dentists...</p>
          </div>
        ) : (
          <div className="dentists-grid">
            {dentists.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No dentists found. Add your first dentist!</p>
              </div>
            ) : (
              dentists.map((dentist) => (
                <DentistCard
                  key={dentist._id}
                  dentist={dentist}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}

        <DentistModal
          isOpen={modalOpen}
          toggle={toggleModal}
          dentist={selectedDentist}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
};

export default DentistManagement;
