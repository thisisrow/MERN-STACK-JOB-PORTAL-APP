import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

const CreateJob = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    experienceRequired: "",
    educationRequired: "",
    salaryRange: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "recruiter") {
      setError("Only recruiters can post jobs.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/jobs",
        {
          ...jobData,
          requirements: jobData.requirements.split(","),
          educationRequired: { degree: jobData.educationRequired },
          userId: user._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Job posted successfully!");
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      setError("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Create Job Posting</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 bg-white rounded">
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input type="text" name="title" className="form-control" placeholder="e.g., Software Engineer" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input type="text" name="company" className="form-control" placeholder="e.g., Google" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" name="location" className="form-control" placeholder="e.g., Remote, New York" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Job Description</label>
          <textarea name="description" className="form-control" rows="3" placeholder="Describe the job role..." onChange={handleChange} required></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Requirements</label>
          <input type="text" name="requirements" className="form-control" placeholder="e.g., React, Node.js (comma-separated)" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Experience Required (Years)</label>
          <input type="number" name="experienceRequired" className="form-control" placeholder="e.g., 2" min="0" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Education Required</label>
          <input type="text" name="educationRequired" className="form-control" placeholder="e.g., Bachelor's in Computer Science" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Salary Range</label>
          <input type="text" name="salaryRange" className="form-control" placeholder="e.g., $50,000 - $70,000 per year" onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Posting Job..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
