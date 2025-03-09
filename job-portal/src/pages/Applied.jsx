import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";
import axios from "../config/axios";

const Applied = () => {
  const { user } = useContext(AuthContext);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(`/api/applications/user/${user._id}`);
        setAppliedJobs(response.data);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" role="status" />
        <h4 className="mt-3">Loading applied jobs...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Applied Jobs</h2>
      {appliedJobs.length === 0 ? (
        <div className="alert alert-info text-center">You haven't applied to any jobs yet.</div>
      ) : (
        <div className="row">
          {appliedJobs.map((application) => (
            <div key={application._id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title text-dark">{application.job.title}</h5>
                  <p className="text-muted">
                    <strong>Company:</strong> {application.job.company}
                  </p>
                  <p className="text-muted">
                    <strong>Location:</strong> {application.job.location}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        application.status === "Pending"
                          ? "bg-warning"
                          : application.status === "Accepted"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {application.status}
                    </span>
                  </p>
                  <p className="text-muted">
                    <strong>Applied on:</strong> {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applied;
