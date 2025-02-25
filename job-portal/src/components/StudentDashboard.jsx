import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Recommendation from "../pages/Recommendation";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <div className="card-body text-center">
          <h2 className="card-title">Welcome, {user.name}!</h2>
          <p className="card-text">Explore your dashboard and manage your career journey.</p>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Profile</h5>
              <p className="card-text">View and update your profile details.</p>
              <Link to="/profile" className="btn btn-primary">View Profile</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Saved Jobs</h5>
              <p className="card-text">Check the jobs you have saved for later.</p>
              <Link to="/saved" className="btn btn-success">Saved Jobs</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Applied Jobs</h5>
              <p className="card-text">Review the jobs you have applied for.</p>
              <Link to="/applied" className="btn btn-info">Applied Jobs</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3>Job Recommendations</h3>
        <Recommendation />
      </div>
    </div>
  );
};

export default StudentDashboard;
