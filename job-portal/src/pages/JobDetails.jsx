import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../config/axios";

const JobDetails = () => {
  const { id } = useParams();
  const { user, refreshUserData } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    axios.get(`/api/jobs/${id}`)
      .then((res) => {
        setJob(res.data);
      })
      .catch((err) => {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details.");
      });
  }, [id]);

  const hasApplied = user?.appliedJobs?.includes(id);
  const hasSaved = user?.savedJobs?.includes(id);

  const applyJob = async () => {
    if (hasApplied) {
      setError("You have already applied for this job.");
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    if (!coverLetter.trim()) {
      setError("Cover letter is required to apply.");
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    const payload = { jobId: id, userId: user._id, coverLetter };
  
    try {
      const response = await axios.post("/api/applications", payload);  
      await refreshUserData();
      setSuccess("Job application submitted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error applying for job:", error);
      setError(error.response?.data?.message || "Failed to apply for the job.");
      setTimeout(() => setError(null), 3000);
    }
  };
  

  const saveJob = async () => {
  
    if (hasSaved) {
      setError("You have already saved this job.");
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    try {
        await axios.put(`/api/users/${user._id}`, { 
          savedJobs: [...user.savedJobs, id] 
        });
  
        await refreshUserData();
        setSuccess("Job saved successfully!");
        setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
        setError("Failed to save the job.");
      setTimeout(() => setError(null), 3000);
    }
  };
  

  if (!job) return <div className="container mt-5"><h3>Loading...</h3></div>;

  return (
    <div className="container mt-5">
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Requirements:</strong> {job.requirements.join(", ")}</p>
      <p><strong>Experience Required:</strong> {job.experienceRequired} years</p>
      <p><strong>Education:</strong> {job.educationRequired.degree}</p>
      <p><strong>Salary:</strong> {job.salaryRange}</p>

      {/* Bootstrap Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {user?.role === "student" && (
        <div>
          <textarea
            className="form-control my-3"
            rows="4"
            placeholder="Write a short cover letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            disabled={hasApplied}
          />

          <button className="btn btn-success me-2" onClick={applyJob} disabled={hasApplied}>
            {hasApplied ? "Already Applied" : "Apply Now"}
          </button>
          <button className="btn btn-warning" onClick={saveJob} disabled={hasSaved}>
            {hasSaved ? "Already Saved" : "Save Job"}
          </button>
        </div>
      )}
    </div>
  );
};

export default JobDetails;