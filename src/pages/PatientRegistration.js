import React, { useState, useEffect } from 'react';
import { getPatients, createPatient, deletePatient, updatePatient } from '../services/api';

function PatientRegistration() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [history, setHistory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const results = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  const fetchPatients = () => {
    getPatients().then(data => {
      setPatients(data);
      setFilteredPatients(data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const patientData = { name, age, address, mobile, history };

    if (selectedPatientId) {
      updatePatient(selectedPatientId, patientData).then(() => {
        fetchPatients();
        clearForm();
      });
    } else {
      createPatient(patientData).then(() => {
        fetchPatients();
        clearForm();
      });
    }
  };

  const handleEdit = (patient) => {
    setSelectedPatientId(patient.id);
    setName(patient.name);
    setAge(patient.age);
    setAddress(patient.address);
    setMobile(patient.mobile);
    setHistory(patient.history);
  };

  const clearForm = () => {
    setSelectedPatientId(null);
    setName('');
    setAge('');
    setAddress('');
    setMobile('');
    setHistory('');
  };

  const handleDelete = (id) => {
    deletePatient(id).then(() => {
      fetchPatients();
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-primary mb-4">
                {selectedPatientId ? 'Edit Patient' : 'Patient Registration'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Patient Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Medical History</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    placeholder="Brief medical history"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {selectedPatientId ? 'Update Patient' : 'Register Patient'}
                </button>
                {selectedPatientId && (
                  <button type="button" className="btn btn-secondary w-100 mt-2" onClick={clearForm}>
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-primary mb-4">Registered Patients</h3>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ul className="list-group list-group-flush">
                {filteredPatients.map(patient => (
                  <li key={patient.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div onClick={() => handleEdit(patient)} style={{ cursor: 'pointer' }}>
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{patient.name} ({patient.age} years)</span>
                      </div>
                      <small className="text-muted">{patient.address} | {patient.mobile}</small>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(patient.id)}>
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientRegistration;
