const express = require('express');
const cors = require('cors');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const patientDbPath = path.join(__dirname, '..', 'database', 'PatientRegister.json');
const doctorDbPath = path.join(__dirname, '..', 'database', 'doctors.json');
const appointmentDbPath = path.join(__dirname, '..', 'database', 'appointments.json');
const medicationDbPath = path.join(__dirname, '..', 'database', 'medications.json');

// Helper functions to read/write databases
const readDB = (filePath) => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeDB = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.get('/copilot/context', (req, res) => {
  //... existing code...
  });

// API endpoints for Patients
app.get('/api/patients', (req, res) => {
  const db = readDB(patientDbPath);
  res.json(db.patients);
});

app.post('/api/patients', (req, res) => {
  const db = readDB(patientDbPath);
  const newPatient = { id: Date.now(), ...req.body };
  db.patients.push(newPatient);
  writeDB(patientDbPath, db);
  res.status(201).json(newPatient);
});

app.delete('/api/patients/:id', (req, res) => {
  const db = readDB(patientDbPath);
  const patientId = parseInt(req.params.id, 10);
  db.patients = db.patients.filter(p => p.id !== patientId);
  writeDB(patientDbPath, db);
  res.status(204).send();
});

app.put('/api/patients/:id', (req, res) => {
  const db = readDB(patientDbPath);
  const patientId = parseInt(req.params.id, 10);
  const patientIndex = db.patients.findIndex(p => p.id === patientId);

  if (patientIndex === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  db.patients[patientIndex] = { ...db.patients[patientIndex], ...req.body };
  writeDB(patientDbPath, db);
  res.json(db.patients[patientIndex]);
});

// API endpoints for Doctors
app.get('/api/doctors', (req, res) => {
  const db = readDB(doctorDbPath);
  res.json(db.doctors);
});

app.post('/api/doctors', (req, res) => {
  const db = readDB(doctorDbPath);
  const newDoctor = { id: Date.now(), ...req.body };
  db.doctors.push(newDoctor);
  writeDB(doctorDbPath, db);
  res.status(201).json(newDoctor);
});

app.put('/api/doctors/:id', (req, res) => {
  const db = readDB(doctorDbPath);
  const doctorId = parseInt(req.params.id, 10);
  const doctorIndex = db.doctors.findIndex(d => d.id === doctorId);

  if (doctorIndex === -1) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  db.doctors[doctorIndex] = { ...db.doctors[doctorIndex], ...req.body };
  writeDB(doctorDbPath, db);
  res.json(db.doctors[doctorIndex]);
});

app.delete('/api/doctors/:id', (req, res) => {
  const db = readDB(doctorDbPath);
  const doctorId = parseInt(req.params.id, 10);
  db.doctors = db.doctors.filter(d => d.id !== doctorId);
  writeDB(doctorDbPath, db);
  res.status(204).send();
});


app.get('/api/appointments', (req, res) => {
  const db = readDB(appointmentDbPath);
  res.json(db.appointments || []);
});

app.post('/api/appointments', (req, res) => {
  const db = readDB(appointmentDbPath);
  const newAppointment = { id: Date.now(), ...req.body };
  if (!db.appointments) {
    db.appointments = [];
  }
  db.appointments.push(newAppointment);
  writeDB(appointmentDbPath, db);
  res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id', (req, res) => {
  const db = readDB(appointmentDbPath);
  const appointmentId = parseInt(req.params.id, 10);
  const appointmentIndex = db.appointments.findIndex(a => a.id === appointmentId);

  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  db.appointments[appointmentIndex] = { ...db.appointments[appointmentIndex], ...req.body };
  writeDB(appointmentDbPath, db);
  res.json(db.appointments[appointmentIndex]);
});

app.delete('/api/appointments/:id', (req, res) => {
  const db = readDB(appointmentDbPath);
  const appointmentId = parseInt(req.params.id, 10);
  db.appointments = db.appointments.filter(a => a.id !== appointmentId);
  writeDB(appointmentDbPath, db);
  res.status(204).send();
});

// API endpoints for Medications
app.get('/api/medications', (req, res) => {
  const db = readDB(medicationDbPath);
  res.json(db.medications);
});

app.post('/api/medications', (req, res) => {
  const db = readDB(medicationDbPath);
  const newMedication = { id: Date.now(), ...req.body };
  db.medications.push(newMedication);
  writeDB(medicationDbPath, db);
  res.status(201).json(newMedication);
});

app.put('/api/medications/:id', (req, res) => {
  const db = readDB(medicationDbPath);
  const medicationId = parseInt(req.params.id, 10);
  const medicationIndex = db.medications.findIndex(m => m.id === medicationId);

  if (medicationIndex === -1) {
    return res.status(404).json({ message: 'Medication not found' });
  }

  db.medications[medicationIndex] = { ...db.medications[medicationIndex], ...req.body };
  writeDB(medicationDbPath, db);
  res.json(db.medications[medicationIndex]);
});

app.delete('/api/medications/:id', (req, res) => {
  const db = readDB(medicationDbPath);
  const medicationId = parseInt(req.params.id, 10);
  db.medications = db.medications.filter(m => m.id !== medicationId);
  writeDB(medicationDbPath, db);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`MCP server listening at http://localhost:${port}`);
});
