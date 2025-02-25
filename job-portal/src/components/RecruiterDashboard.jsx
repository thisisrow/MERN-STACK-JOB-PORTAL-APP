import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
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
      <h2 className="mb-4">Welcome, {user.name}!</h2>

      <div className="row">
        {/* Profile Card */}
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h4> Profile</h4>
            <p>View and update your recruiter profile</p>
            <Link to="/profile" className="btn btn-primary">
              View Profile
            </Link>
          </div>
        </div>

        {/* Create Job Card */}
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h4> Create Jobs</h4>
            <p>Post new job openings for candidates</p>
            <Link to="/create-job" className="btn btn-success">
              Create Job
            </Link>
          </div>
        </div>

        {/* Jobs Posted Card */}
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h4> Jobs Posted</h4>
            <p>Manage jobs posted by you</p>
            <Link to="/jobs-recruiter" className="btn btn-warning">
              View Jobs
            </Link>
          </div>
        </div>

        {/* View Applications Card */}
        <div className="col-md-4 mt-3">
          <div className="card text-center p-3">
            <h4> View Applications</h4>
            <p>Check applications for your jobs</p>
            <Link to="/applications" className="btn btn-info">
              View Applications
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;
