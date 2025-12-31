import React from 'react';

function AdminDashboard() {
  return (
    <div>
      <h2>Manage Doctors</h2>
      <p>Add, edit, and manage doctor profiles here.</p>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Add New Doctor</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Doctor Name</label>
                  <input type="text" className="form-control" placeholder="Enter doctor name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Specialization</label>
                  <input type="text" className="form-control" placeholder="Enter specialization" />
                </div>
                <button type="submit" className="btn btn-primary">Add Doctor</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Current Doctors</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Dr. Smith - Cardiology</span>
                  <button className="btn btn-sm btn-outline-danger">Remove</button>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Dr. Johnson - Neurology</span>
                  <button className="btn btn-sm btn-outline-danger">Remove</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
