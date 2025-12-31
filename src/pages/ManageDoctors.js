import React, { useState, useEffect } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../services/api';

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const results = doctors.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);

  const fetchDoctors = () => {
    getDoctors().then(data => {
      setDoctors(data);
      setFilteredDoctors(data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const doctorData = { name, specialization };

    if (selectedDoctorId) {
      updateDoctor(selectedDoctorId, doctorData).then(() => {
        fetchDoctors();
        clearForm();
      });
    } else {
      createDoctor(doctorData).then(() => {
        fetchDoctors();
        clearForm();
      });
    }
  };

  const handleEdit = (doctor) => {
    setSelectedDoctorId(doctor.id);
    setName(doctor.name);
    setSpecialization(doctor.specialization);
  };

  const clearForm = () => {
    setSelectedDoctorId(null);
    setName('');
    setSpecialization('');
  };

  const handleDelete = (id) => {
    deleteDoctor(id).then(() => {
      fetchDoctors();
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-primary mb-4">
                {selectedDoctorId ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Doctor Name</label>
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
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    className="form-control"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Enter specialization"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {selectedDoctorId ? 'Update Doctor' : 'Add Doctor'}
                </button>
                {selectedDoctorId && (
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
              <h3 className="card-title text-primary mb-4">Doctor List</h3>
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
                {filteredDoctors.map(doctor => (
                  <li key={doctor.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div onClick={() => handleEdit(doctor)} style={{ cursor: 'pointer' }}>
                      <span className="fw-bold">{doctor.name}</span>
                      <br />
                      <small className="text-muted">{doctor.specialization}</small>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(doctor.id)}>
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

export default ManageDoctors;
