import React, { useState, useEffect } from 'react';
import { getMedications, createMedication, updateMedication, deleteMedication } from '../services/api';

function ManageMedications() {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [currentMedication, setCurrentMedication] = useState({
    id: null,
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  useEffect(() => {
    const results = medications.filter(medication =>
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedications(results);
  }, [searchTerm, medications]);

  const fetchMedications = () => {
    getMedications().then(data => {
      setMedications(data);
      setFilteredMedications(data);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleShowModal = (medication) => {
    if (medication) {
      setIsEditMode(true);
      setCurrentMedication(medication);
    } else {
      setIsEditMode(false);
      setCurrentMedication({ id: null, name: '', description: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateMedication(currentMedication.id, currentMedication).then(() => {
        fetchMedications();
        handleCloseModal();
      });
    } else {
      createMedication(currentMedication).then(() => {
        fetchMedications();
        handleCloseModal();
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      deleteMedication(id).then(() => {
        fetchMedications();
      });
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Manage Medications</h2>
          <button className="btn btn-primary" onClick={() => handleShowModal(null)}>
            <i className="bi bi-plus-lg me-2"></i>Add New Medication
          </button>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by medicine name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Medicine Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedications.map(medication => (
                  <tr key={medication.id}>
                    <td className="fw-bold">{medication.name}</td>
                    <td>{medication.description}</td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleShowModal(medication)}>
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(medication.id)}>
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditMode ? 'Edit Medication' : 'Add New Medication'}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Medicine Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name" 
                      value={currentMedication.name} 
                      onChange={handleInputChange} 
                      placeholder="Enter medicine name"
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      name="description" 
                      value={currentMedication.description} 
                      onChange={handleInputChange} 
                      placeholder="Enter medicine description, uses, and effects..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    {isEditMode ? 'Update Medication' : 'Save Medication'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMedications;