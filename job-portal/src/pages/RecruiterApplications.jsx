import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaBriefcase, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaTools, FaCalendarAlt } from "react-icons/fa";

const RecruiterApplications = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [studentDetails, setStudentDetails] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/jobs/recruiter/${user._id}`);
        setJobs(response.data);
      } catch (err) {
        setError("Failed to load jobs");
      }
    };

    fetchJobs();
  }, [user]);

  const fetchApplications = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/applications/job/${jobId}`);
      setApplications(response.data);
      setSelectedJob(jobId);

      response.data.forEach(async (app) => {
        if (app.applicant?._id && !studentDetails[app.applicant._id]) {
          try {
            const userResponse = await axios.get(`http://localhost:8081/api/users/${app.applicant._id}`);
            setStudentDetails((prevDetails) => ({
              ...prevDetails,
              [app.applicant._id]: userResponse.data,
            }));
          } catch (err) {
            console.error("Error fetching student details:", err);
          }
        }
      });
    } catch (err) {
      setError("Failed to load applications");
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(`http://localhost:8081/api/applications/${applicationId}/status`, { status });
      setApplications((prev) => prev.map((app) => (app._id === applicationId ? { ...app, status } : app)));
    } catch (err) {
      setError("Failed to update status");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4"><FaBriefcase /> Recruiter Applications</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row">
        <div className="col-md-4">
          <h4 className="mb-3">Select a Job</h4>
          <div className="list-group">
            {jobs.map((job) => (
              <button
                key={job._id}
                className={`list-group-item list-group-item-action ${selectedJob === job._id ? "active" : ""}`}
                onClick={() => fetchApplications(job._id)}
              >
                <FaBriefcase /> {job.title} ({job.company})
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-8">
          {selectedJob && (
            <>
              <h4 className="mt-4">Applications for {jobs.find((job) => job._id === selectedJob)?.title}</h4>
              {applications.length === 0 ? (
                <p className="text-muted">No applications found.</p>
              ) : (
                <div className="row">
                  {applications.map((app) => {
                    const student = studentDetails[app.applicant?._id] || {};
                    return (
                      <div className="col-md-6" key={app._id}>
                        <div className="card mb-4 shadow border-0">
                          <div className="card-body">
                            <h5 className="card-title"><FaUser /> {student.name || "N/A"}</h5>
                            <p className="card-text text-muted"><FaEnvelope /> {student.email || "N/A"}</p>
                            <p className="card-text"><FaPhone /> <strong>Phone:</strong> {student.phone || "N/A"}</p>
                            <p className="card-text"><FaGraduationCap /> <strong>Education:</strong> {student.education ? `${student.education.degree}, ${student.education.institution}` : "N/A"}</p>
                            <p className="card-text"><FaTools /> <strong>Skills:</strong> {student.skills?.join(", ") || "N/A"}</p>
                            <p className="card-text"><strong>Experience:</strong> {student.experience || "N/A"}</p>
                            <p className="card-text"><FaCalendarAlt /> <strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>

                            <label className="form-label"><strong>Status:</strong></label>
                            <select
                              className="form-select"
                              value={app.status}
                              onChange={(e) => updateStatus(app._id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="interview">Interview</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                              <option value="hired">Hired</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterApplications;
