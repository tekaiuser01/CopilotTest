const API_URL = 'http://localhost:3001/api';

export const getPatients = () => {
  return fetch(`${API_URL}/patients`).then(res => res.json());
};

export const getDoctors = () => {
  return fetch(`${API_URL}/doctors`).then(res => res.json());
};

export const getAppointments = () => {
  return fetch(`${API_URL}/appointments`).then(res => res.json());
};

export const createPatient = (patient) => {
  return fetch(`${API_URL}/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  }).then(res => res.json());
};

export const deletePatient = (id) => {
  return fetch(`${API_URL}/patients/${id}`, {
    method: 'DELETE',
  });
};

export const updatePatient = (id, patient) => {
  return fetch(`${API_URL}/patients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  }).then(res => res.json());
};

// Doctor API calls
export const createDoctor = (doctor) => {
  return fetch(`${API_URL}/doctors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(doctor),
  }).then(res => res.json());
};

export const updateDoctor = (id, doctor) => {
  return fetch(`${API_URL}/doctors/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(doctor),
  }).then(res => res.json());
};

export const deleteDoctor = (id) => {
  return fetch(`${API_URL}/doctors/${id}`, {
    method: 'DELETE',
  });
};

// Appointment API calls
export const createAppointment = (appointment) => {
  return fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointment),
  }).then(res => res.json());
};

export const updateAppointment = (id, appointment) => {
  return fetch(`${API_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointment),
  }).then(res => res.json());
};

export const deleteAppointment = (id) => {
  return fetch(`${API_URL}/appointments/${id}`, {
    method: 'DELETE',
  });
};

// Medication API calls
export const getMedications = () => {
  return fetch(`${API_URL}/medications`).then(res => res.json());
};

export const createMedication = (medication) => {
  return fetch(`${API_URL}/medications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(medication),
  }).then(res => res.json());
};

export const updateMedication = (id, medication) => {
  return fetch(`${API_URL}/medications/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(medication),
  }).then(res => res.json());
};

export const deleteMedication = (id) => {
  return fetch(`${API_URL}/medications/${id}`, {
    method: 'DELETE',
  });
};
