import React, { useState, useEffect, useContext } from "react";
import axios from "../config/axios";
import { AuthContext } from "../context/AuthContext";
import { FaBriefcase, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaTools, FaCalendarAlt, FaRobot, FaStar, FaFilePdf, FaEye } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const RecruiterApplications = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [studentDetails, setStudentDetails] = useState({});
  const [isRanking, setIsRanking] = useState(false);
  const [rankedApplications, setRankedApplications] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`/api/jobs/recruiter/${user._id}`);
        setJobs(response.data);
      } catch (err) {
        setError("Failed to load jobs");
      }
    };

    fetchJobs();
  }, [user]);

  const fetchApplications = async (jobId) => {
    try {
      const response = await axios.get(`/api/applications/job/${jobId}`);
      setApplications(response.data);
      setSelectedJob(jobId);
      setRankedApplications(null); // Reset ranked applications when switching jobs

      response.data.forEach(async (app) => {
        if (app.applicant?._id && !studentDetails[app.applicant._id]) {
          try {
            const userResponse = await axios.get(`/api/users/${app.applicant._id}`);
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

  const rankApplicationsWithAI = async () => {
    if (!selectedJob) return;

    setIsRanking(true);
    setError(null); // Clear previous errors
    
    try {
      const response = await axios.get(`/api/applications/job/${selectedJob}/rank`);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setRankedApplications(response.data);
        toast.success("Applications ranked successfully!");
      } else {
        setError("No ranking data received");
        toast.warning("No ranking data received");
      }
    } catch (err) {
      console.error("Ranking error:", err);
      setError(err.response?.data?.error || "Failed to rank applications");
      toast.error(err.response?.data?.error || "Failed to rank applications");
    } finally {
      setIsRanking(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(`/api/applications/${applicationId}/status`, { status });
      if (rankedApplications) {
        setRankedApplications(prev => prev.map(app => 
          app.applicationId === applicationId ? { ...app, status } : app
        ));
      } else {
        setApplications((prev) => prev.map((app) => (app._id === applicationId ? { ...app, status } : app)));
      }
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleShowResume = (resumeUrl) => {
    setSelectedResume(resumeUrl);
    setShowResumeModal(true);
  };

  const ResumeModal = () => (
    <Modal show={showResumeModal} onHide={() => setShowResumeModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Resume Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: '80vh' }}>
          <iframe
            src={selectedResume}
            title="Resume Preview"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowResumeModal(false)}>
          Close
        </Button>
        <Button variant="primary" href={selectedResume} target="_blank">
          Open in New Tab
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderApplicationCard = (application, isRanked = false) => {
    const student = isRanked ? application.applicant : studentDetails[application.applicant?._id] || {};
    return (
      <div className="col-md-6 mb-4">
        <div className="card shadow border-0">
          {isRanked && (
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaStar className="me-2" />
                  Score: {application.score}/100
                </h5>
              </div>
            </div>
          )}
          <div className="card-body">
            <h5 className="card-title"><FaUser className="me-2" /> {student.name || "N/A"}</h5>
            <p className="card-text"><FaEnvelope className="me-2" />{student.email || "N/A"}</p>
            <p className="card-text"><FaPhone className="me-2" />{student.phone || "N/A"}</p>
            <p className="card-text">
              <FaGraduationCap className="me-2" />
              {student.education ? `${student.education.degree}, ${student.education.institution}` : "N/A"}
            </p>
            <p className="card-text">
              <FaTools className="me-2" />
              {student.skills?.join(", ") || "N/A"}
            </p>
            <p className="card-text">
              <FaBriefcase className="me-2" />
              Experience: {student.experience || "N/A"} years
            </p>
            <p className="card-text">
              <FaCalendarAlt className="me-2" />
              Applied: {new Date(application.appliedAt).toLocaleDateString()}
            </p>

            {/* Resume Section */}
            {student.resume && (
              <div className="mb-3">
                <h6 className="card-subtitle mb-2">
                  <FaFilePdf className="me-2 text-danger" />
                  Resume
                </h6>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleShowResume(student.resume)}
                  >
                    <FaEye className="me-2" />
                    Preview Resume
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    href={student.resume}
                    target="_blank"
                  >
                    <FaFilePdf className="me-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
            
            {isRanked && (
              <div className="alert alert-info">
                <strong>AI Analysis:</strong><br />
                {application.analysis}
              </div>
            )}

            <div className="mt-3">
              <label className="form-label"><strong>Status:</strong></label>
              <select
                className="form-select"
                value={application.status}
                onChange={(e) => updateStatus(isRanked ? application.applicationId : application._id, e.target.value)}
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
      </div>
    );
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
                <FaBriefcase className="me-2" /> {job.title} ({job.company})
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-8">
          {selectedJob && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Applications for {jobs.find((job) => job._id === selectedJob)?.title}</h4>
                <button 
                  className="btn btn-primary" 
                  onClick={rankApplicationsWithAI}
                  disabled={isRanking || !applications.length}
                >
                  <FaRobot className="me-2" />
                  {isRanking ? "Ranking..." : "Rank with AI"}
                </button>
              </div>

              {applications.length === 0 ? (
                <p className="text-muted">No applications found.</p>
              ) : (
                <div className="row">
                  {rankedApplications 
                    ? rankedApplications.map((app) => (
                        <React.Fragment key={app.applicationId || app._id}>
                          {renderApplicationCard(app, true)}
                        </React.Fragment>
                      ))
                    : applications.map((app) => (
                        <React.Fragment key={app._id}>
                          {renderApplicationCard(app)}
                        </React.Fragment>
                      ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ResumeModal />
    </div>
  );
};

export default RecruiterApplications;
