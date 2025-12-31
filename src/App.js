import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import PatientRegistration from './pages/PatientRegistration';
import DoctorDashboard from './pages/DoctorDashboard';
import DailyAppointment from './pages/DailyAppointment';
import AdminDashboard from './pages/AdminDashboard';
import ManageDoctors from './pages/ManageDoctors';
import ManagePatients from './pages/ManagePatients';
import ScheduleAppointment from './pages/ScheduleAppointment';
import ManageMedications from './pages/ManageMedications';
import './App.css';

function App() {
  return (
    <Router>
      <AdminPanel>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<PatientRegistration />} />
          <Route path="/patient-appointments" element={<div><h2>Patient Appointments</h2><p>Manage patient appointments here.</p></div>} />
          <Route path="/patient-history" element={<div><h2>Patient Visit History</h2><p>View patient visit history here.</p></div>} />
          <Route path="/doctor" element={<DailyAppointment />} />
          <Route path="/doctor-notes" element={<div><h2>Consultation Notes</h2><p>Add and view consultation notes here.</p></div>} />
          <Route path="/doctor-review" element={<div><h2>Review Patient History</h2><p>Review patient medical history here.</p></div>} />
          <Route path="/admin" element={<ManageDoctors />} />
          <Route path="/admin-patients" element={<ManagePatients />} />
          <Route path="/admin-schedule" element={<ScheduleAppointment />} />
          <Route path="/admin-medications" element={<ManageMedications />} />
        </Routes>
      </AdminPanel>
    </Router>
  );
}

export default App;
