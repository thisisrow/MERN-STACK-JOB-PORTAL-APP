import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../config/axios";

const JobsRecruiter = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`/api/jobs/recruiter/${user._id}`);
        setJobs(response.data);
      } catch (err) {
        setError("Failed to load jobs");
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, [user]);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`/api/jobs/recruiter/${jobId}`, {
        data: { userId: user._id },
        headers: { "Content-Type": "application/json" }
      });

      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      setError("Failed to delete job");
      console.error("Error deleting job:", err);
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/update-job/${jobId}`);
  };

  const fetchRecommendedUsers = async (jobId) => {
    try {
      const response = await axios.get(`/api/recommendations/recruiter/${jobId}`);
      setRecommendedUsers(response.data.suitableUsers);
      setSelectedJobId(jobId);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching recommended users:", err);
    }
  };


  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Your Posted Jobs</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {jobs.length === 0 ? (
        <div className="text-center text-muted">No jobs posted yet.</div>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div key={job._id} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-lg border-0 rounded-lg p-3 h-100">
                <div className="card-body">
                  <h4 className="card-title text-primary">{job.title}</h4>
                  <p className="text-muted mb-2"><strong>Company:</strong> {job.company}</p>
                  <p className="mb-2"><strong>Location:</strong> {job.location}</p>
                  <p className="mb-2"><strong>Experience:</strong> {job.experienceRequired} years</p>
                  <p className="mb-2"><strong>Salary:</strong> {job.salaryRange}</p>
                </div>
                <div className="card-footer bg-white d-flex justify-content-between">
                  <button className="btn btn-outline-primary" onClick={() => handleEdit(job._id)}>Edit</button>
                  <button className="btn btn-outline-danger" onClick={() => handleDelete(job._id)}>Delete</button>
                </div>
                <button className="btn btn-success mt-2" onClick={() => fetchRecommendedUsers(job._id)}>
                  Recommend Users
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

{showModal && (
  <div
    className="modal fade show d-block"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    onClick={() => setShowModal(false)}
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Recommended Users for Job</h5>
          <button className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          {recommendedUsers.length === 0 ? (
            <p>No users found for this job.</p>
          ) : (
            <ul className="list-group">
              {recommendedUsers.map(user => (
                <li key={user._id} className="list-group-item">
                  <strong>{user.name}</strong>  
                  <br />
                  <strong>Skills:</strong> {user.skills.length > 0 ? user.skills.join(", ") : "No skills listed"}
                  <br />
                  <strong>Email:</strong> {user.email}
                  <br />
                  <strong>Contact:</strong> {user.phone || "N/A"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default JobsRecruiter;
