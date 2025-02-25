import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams();
  const { user, refreshUserData } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => setError("Failed to load job details."));
  }, [id]);

  const hasApplied = user?.appliedJobs?.includes(id);
  const hasSaved = user?.savedJobs?.includes(id);

  const applyJob = async () => {
    if (!user) {
      setError("You need to be logged in to apply.");
      return;
    }

    if (hasApplied) {
      setError("You have already applied for this job.");
      return;
    }

    if (!coverLetter.trim()) {
      setError("Cover letter is required to apply.");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/applications", {
        jobId: id,
        userId: user._id,
        coverLetter,
      });

      await refreshUserData();
      setSuccess("Job application submitted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to apply for the job.");
    }
  };

  const saveJob = async () => {
    if (!user) {
      setError("You need to be logged in to save jobs.");
      return;
    }

    if (hasSaved) {
      setError("You have already saved this job.");
      return;
    }

    try {
      await axios.patch(`http://localhost:8081/api/users/${user._id}`, { 
        savedJobs: [...(user.savedJobs || []), id] 
      });

      await refreshUserData();
      setSuccess("Job saved successfully!");
    } catch {
      setError("Failed to save the job.");
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
