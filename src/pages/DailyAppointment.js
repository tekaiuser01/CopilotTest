import React, { useEffect, useState } from 'react';
import { getDoctors, getAppointments, getPatients, updateAppointment } from '../services/api';

function AppointmentRow({ appointment, patient }) {
  const [remark, setRemark] = useState(appointment.remark || '');
  const [charges, setCharges] = useState(appointment.charges || '');
  const [status, setStatus] = useState(appointment.status);
  const [saving, setSaving] = useState(false);

  const handleConduct = async () => {
    setSaving(true);
    await updateAppointment(appointment.id, {
      ...appointment,
      remark,
      charges,
      status: 'Conducted',
    });
    setStatus('Conducted');
    setSaving(false);
  };

  return (
    <tr>
      <td>{appointment.time}</td>
      <td>{patient ? patient.name : appointment.patientId}</td>
      <td>{appointment.notes}</td>
      <td>{status}</td>
      <td>
        <input
          type="text"
          value={remark}
          onChange={e => setRemark(e.target.value)}
          placeholder="Enter remark"
          disabled={status === 'Conducted'}
        />
      </td>
      <td>
        <input
          type="number"
          value={charges}
          onChange={e => setCharges(e.target.value)}
          placeholder="Charges"
          min="0"
          disabled={status === 'Conducted'}
        />
      </td>
      <td>
        <button
          onClick={handleConduct}
          disabled={status === 'Conducted' || saving}
        >
          {saving ? 'Saving...' : 'Conduct'}
        </button>
      </td>
    </tr>
  );
}

const DailyAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    getDoctors().then(data => {
      setDoctors(data.doctors || []);
    });
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      getAppointments().then(data => {
        setAppointments(data.appointments || []);
      });
      getPatients().then(data => {
        setPatients(data.patients || []);
      });
    } else {
      setAppointments([]);
    }
  }, [selectedDoctor]);

  const todaysAppointments = appointments.filter(
    appt => String(appt.doctorId) === String(selectedDoctor) && appt.date === today
  );

  return (
    <div>
      <h2>Daily Appointments</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="doctor-select">Select Doctor: </label>
        <select
          id="doctor-select"
          value={selectedDoctor}
          onChange={e => setSelectedDoctor(e.target.value)}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
          ))}
        </select>
      </div>
      {selectedDoctor && (
        <div>
          <h3>Today's Appointments</h3>
          {todaysAppointments.length === 0 ? (
            <p>No appointments for today.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Consultation Remark</th>
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
          )}
        </div>
      )}
    </div>
  );
};

export default DailyAppointment;
