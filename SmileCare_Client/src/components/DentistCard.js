import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DentistCard = ({ dentist, onEdit, onDelete }) => {
  return (
    <div className="dentist-card">
      <div className="dentist-card-image">
        <img src={dentist.image} alt={dentist.name} />
      </div>
      <div className="dentist-card-content">
        <h4 className="dentist-name">{dentist.name}</h4>
        <p className="dentist-email">{dentist.email}</p>
        <div className="dentist-specialty">
          <span className="specialty-badge">{dentist.specialty}</span>
        </div>
      </div>
      <div className="dentist-card-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(dentist)}
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(dentist._id)}
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default DentistCard;
