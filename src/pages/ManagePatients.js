import React, { useState, useEffect } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../services/api';

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [currentPatient, setCurrentPatient] = useState({
    id: null,
    name: '',
    age: '',
    address: '',
    mobile: '',
    history: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const results = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mobile.includes(searchTerm) ||
      patient.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  const fetchPatients = () => {
    getPatients().then(data => {
      setPatients(data);
      setFilteredPatients(data);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleShowModal = (patient) => {
    if (patient) {
      setIsEditMode(true);
      setCurrentPatient(patient);
    } else {
      setIsEditMode(false);
      setCurrentPatient({ id: null, name: '', age: '', address: '', mobile: '', history: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updatePatient(currentPatient.id, currentPatient).then(() => {
        fetchPatients();
        handleCloseModal();
      });
    } else {
      createPatient(currentPatient).then(() => {
        fetchPatients();
        handleCloseModal();
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient(id).then(() => {
        fetchPatients();
      });
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Manage Patients</h2>
          <button className="btn btn-primary" onClick={() => handleShowModal(null)}>
            <i className="bi bi-plus-lg me-2"></i>Add New Patient
          </button>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, mobile, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Address</th>
                  <th>Mobile</th>
                  <th>History</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.address}</td>
                    <td>{patient.mobile}</td>
                    <td>{patient.history}</td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleShowModal(patient)}>
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(patient.id)}>
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
                <h5 className="modal-title">{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Patient Name</label>
                    <input type="text" className="form-control" name="name" value={currentPatient.name} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-control" name="age" value={currentPatient.age} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" name="address" value={currentPatient.address} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input type="tel" className="form-control" name="mobile" value={currentPatient.mobile} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Medical History</label>
                    <textarea className="form-control" rows="3" name="history" value={currentPatient.history} onChange={handleInputChange} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    {isEditMode ? 'Update Patient' : 'Save Patient'}
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

export default ManagePatients;
