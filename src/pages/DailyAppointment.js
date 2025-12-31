import React, { useEffect, useState } from 'react';
import { getDoctors, getAppointments, getPatients, updateAppointment, getMedications } from '../services/api';

function AppointmentRow({ appointment, patient }) {
  const [remark, setRemark] = useState(appointment.remark || '');
  const [charges, setCharges] = useState(appointment.charges || '');
  const [status, setStatus] = useState(appointment.status);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [medications, setMedications] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([
    { medicationId: '' }
  ]);
  const [days, setDays] = useState(1);

  useEffect(() => {
    getMedications().then(data => {
      if (Array.isArray(data)) {
        setMedications(data);
      } else if (data && Array.isArray(data.medications)) {
        setMedications(data.medications);
      } else {
        setMedications([]);
      }
    });
  }, []);

  // Calculate total medication charges
  // Total charges = consultation charges × days
  const totalCharges = (Number(charges) || 0) * (Number(days) || 1);

  const handleConduct = async () => {
    setSaving(true);
    await updateAppointment(appointment.id, {
      ...appointment,
      remark,
      charges: totalCharges,
      status: 'Conducted',
      medications: selectedMedications,
      days,
    });
    setStatus('Conducted');
    setSaving(false);
  };

  const handleMedChange = (idx, value) => {
    setSelectedMedications(meds =>
      meds.map((m, i) => (i === idx ? { ...m, medicationId: value } : m))
    );
  };

  const addMedicationRow = () => {
    setSelectedMedications(meds => [...meds, { medicationId: '' }]);
  };

  const removeMedicationRow = (idx) => {
    setSelectedMedications(meds => meds.filter((_, i) => i !== idx));
  };

  return (
    <>
      <tr>
        <td>{appointment.time}</td>
        <td>{patient ? patient.name : appointment.patientId}</td>
        <td>{appointment.notes}</td>
        <td>{status}</td>
        <td>
          <input
            type="number"
            value={charges}
            onChange={e => setCharges(e.target.value)}
            placeholder="Consultation Charges"
            min="0"
            disabled={status === 'Conducted'}
          />
        </td>
        <td>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={() => setExpanded(e => !e)}
            disabled={status === 'Conducted'}
          >
            {expanded ? 'Hide Details' : 'Add Details'}
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={handleConduct}
            disabled={status === 'Conducted' || saving}
          >
            {saving ? 'Saving...' : 'Conduct'}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan="6">
            <div className="p-2 bg-light border rounded">
              <div className="mb-2">
                <label className="form-label fw-bold">Consultation Remark:</label>
                <textarea
                  className="form-control"
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  placeholder="Enter consultation remark"
                  disabled={status === 'Conducted'}
                />
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold">Days:</label>
                <input
                  type="number"
                  className="form-control w-auto d-inline-block ms-2"
                  min="1"
                  value={days}
                  onChange={e => setDays(Number(e.target.value))}
                  placeholder="Days"
                  disabled={status === 'Conducted'}
                  style={{ width: 80 }}
                />
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold">Medications:</label>
                {selectedMedications.map((med, idx) => (
                  <div className="row align-items-end mb-2" key={idx}>
                    <div className="col-md-7">
                      <select
                        className="form-select"
                        value={med.medicationId}
                        onChange={e => handleMedChange(idx, e.target.value)}
                        disabled={status === 'Conducted'}
                      >
                        <option value="">Select Medication</option>
                        {medications.map(m => (
                          <option key={m.id} value={m.id}>{m.name} (₹{m.price})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      {selectedMedications.length > 1 && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeMedicationRow(idx)}
                          disabled={status === 'Conducted'}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={addMedicationRow}
                  disabled={status === 'Conducted'}
                >
                  + Add Another Medication
                </button>
              </div>
              <div className="mt-2">
                <strong>Total Charges (Consultation × Days): ₹{totalCharges}</strong>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const DailyAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // Get today's date in YYYY-MM-DD format
  // (already declared below)

  useEffect(() => {
    getDoctors().then(data => {
      console.log('getDoctors API response:', data);
      // Support both {doctors: [...]} and [...] response
      if (Array.isArray(data)) {
        setDoctors(data);
      } else if (data && Array.isArray(data.doctors)) {
        setDoctors(data.doctors);
      } else {
        setDoctors([]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      getAppointments().then(data => {
        setAppointments(data.appointments || data || []);
      });
      getPatients().then(data => {
		setPatients(data.patients || data || []);
      });
    } else {
      setAppointments([]);
      setPatients([]);
    }
	}, [selectedDoctor]);

  // Get today's appointments for selected doctor
  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter(
    appt => String(appt.doctorId) === String(selectedDoctor) && appt.date === today
  );

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title mb-4 text-primary">Daily Appointments</h2>
          <div className="mb-3 row align-items-center">
            <label htmlFor="doctor-select" className="col-sm-2 col-form-label fw-bold">Select Doctor:</label>
            <div className="col-sm-6">
              <select
                id="doctor-select"
                className="form-select"
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {selectedDoctor && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3 text-success">Today's Appointments</h4>
            {todaysAppointments.length === 0 ? (
              <div className="alert alert-info">No appointments for today.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th>Charges</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysAppointments.map(appt => {
                      const patient = patients.find(p => p.id === appt.patientId);
                      return (
                        <AppointmentRow key={appt.id} appointment={appt} patient={patient} />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyAppointment;
