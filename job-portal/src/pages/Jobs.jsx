import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../config/axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim() !== "")
    );

    axios
      .get("/api/jobs", { params: filteredParams })
      .then((res) => {
        setJobs(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch jobs. Please try again.");
      });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchJobs();
  };

  return (
    <div className="container mt-5">
      <h2>Job Listings</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search & Filter Inputs */}
      <div className="row mb-4">
        <div className="col-md-2">
          <input type="text" name="title" placeholder="Job Title" className="form-control" value={filters.title} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <input type="text" name="company" placeholder="Company" className="form-control" value={filters.company} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <input type="text" name="location" placeholder="Location" className="form-control" value={filters.location} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <input type="text" name="skills" placeholder="Skills (comma-separated)" className="form-control" value={filters.skills} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <input type="number" name="experience" placeholder="Max Experience" className="form-control" value={filters.experience} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <input type="text" name="education" placeholder="Degree" className="form-control" value={filters.education} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={applyFilters}>Search</button>
        </div>
      </div>

      {/* Job Cards */}
      <div className="row">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text">{job.company} - {job.location}</p>
                  <Link to={`/jobs/${job._id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
