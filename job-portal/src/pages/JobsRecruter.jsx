import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../config/axios";

const JobsRecruiter = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsRecruiter;