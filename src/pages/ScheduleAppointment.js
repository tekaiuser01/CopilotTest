import React, { useState, useEffect } from 'react';
import { getPatients, getDoctors, getAppointments, createAppointment, deleteAppointment } from '../services/api';

function ScheduleAppointment() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  // Generate time slots (20-minute intervals from 9:00 AM to 5:00 PM)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 20) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const results = appointments.filter(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      const patientName = patient ? patient.name.toLowerCase() : '';
      const doctorName = doctor ? doctor.name.toLowerCase() : '';
      
      return patientName.includes(searchTerm.toLowerCase()) ||
             doctorName.includes(searchTerm.toLowerCase()) ||
             appointment.date.includes(searchTerm);
    });
    setFilteredAppointments(results);
  }, [searchTerm, appointments, patients, doctors]);

  const fetchData = () => {
    Promise.all([getPatients(), getDoctors(), getAppointments()]).then(([patientsData, doctorsData, appointmentsData]) => {
      setPatients(patientsData);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if the time slot is already booked for the doctor on that date
    const isSlotTaken = appointments.some(appointment => 
      appointment.doctorId === parseInt(selectedDoctor) && 
      appointment.date === selectedDate && 
      appointment.time === selectedTime
    );

    if (isSlotTaken) {
      alert('This time slot is already booked for the selected doctor. Please choose a different time.');
      return;
    }

    const appointmentData = {
      patientId: parseInt(selectedPatient),
      doctorId: parseInt(selectedDoctor),
      date: selectedDate,
      time: selectedTime,
      notes: notes,
      status: 'Scheduled'
    };

    createAppointment(appointmentData).then(() => {
      fetchData();
      clearForm();
      alert('Appointment scheduled successfully!');
    });
  };

  const clearForm = () => {
    setSelectedPatient('');
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      deleteAppointment(id).then(() => {
        fetchData();
      });
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown';
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown';
  };

  const isTimeSlotBooked = (doctorId, date, time) => {
    return appointments.some(appointment => 
      appointment.doctorId === doctorId && 
      appointment.date === date && 
      appointment.time === time
    );
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-primary mb-4">Schedule New Appointment</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select Patient</label>
                  <select className="form-select" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} required>
                    <option value="">Choose a patient...</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.mobile}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Select Doctor</label>
                  <select className="form-select" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
                    <option value="">Choose a doctor...</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Appointment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Time Slot</label>
                  <select className="form-select" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required>
                    <option value="">Choose time...</option>
                    {timeSlots.map(time => {
                      const isBooked = selectedDoctor && selectedDate && isTimeSlotBooked(parseInt(selectedDoctor), selectedDate, time);
                      return (
                        <option key={time} value={time} disabled={isBooked}>
                          {time} {isBooked ? '(Booked)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special notes for the appointment..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100">Schedule Appointment</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-primary mb-4">Scheduled Appointments</h3>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by patient name, doctor name, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td>{getPatientName(appointment.patientId)}</td>
                        <td>{getDoctorName(appointment.doctorId)}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>
                          <span className={`badge ${appointment.status === 'Scheduled' ? 'bg-success' : 'bg-secondary'}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>{appointment.notes || '-'}</td>
                        <td>
                          <button 
                            className="btn btn-outline-danger btn-sm" 
                            onClick={() => handleDelete(appointment.id)}
                            title="Cancel Appointment"
                          >
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
        </div>
      </div>
    </div>
  );
}

export default ScheduleAppointment;