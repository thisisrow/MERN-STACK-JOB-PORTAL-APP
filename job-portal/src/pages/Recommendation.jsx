import React, { useEffect, useState, useContext } from "react";
import axios from "../config/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase } from "react-icons/fa";

const Recommendation = () => {
  const { user, token } = useContext(AuthContext);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(
          `/api/recommendations/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecommendedJobs(res.data.recommendedJobs);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, token]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">🔍 Recommended Jobs</h2>

      {/* Loading Animation */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Fetching recommendations...</p>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* No Recommendations */}
      {!loading && recommendedJobs.length === 0 && (
        <div className="alert alert-warning text-center">
          No job recommendations available at the moment.
        </div>
      )}

      {/* Recommended Job Listings */}
      <div className="row">
        {recommendedJobs.map((job) => (
          <div key={job._id} className="col-md-6 col-lg-4 mb-4">
            <Link to={`/jobs/${job._id}`} className="text-decoration-none">
              <div className="card shadow-sm p-3 job-card">
                <h5 className="card-title text-primary">{job.title}</h5>
                <p><FaBuilding className="text-secondary" /> <strong>Company:</strong> {job.company}</p>
                <p><FaMapMarkerAlt className="text-secondary" /> <strong>Location:</strong> {job.location}</p>
                <p><FaBriefcase className="text-secondary" /> <strong>Experience:</strong> {job.experienceRequired} years</p>
                <p><FaMoneyBillWave className="text-secondary" /> <strong>Salary:</strong> {job.salaryRange}</p>
                <button className="btn btn-outline-primary w-100">View Details</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;
