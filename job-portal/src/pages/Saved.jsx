import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { JobContext } from "../context/JobContext";

const Saved = () => {
  const { user } = useContext(AuthContext);
  const { jobs } = useContext(JobContext);  // Get all jobs from JobContext

  if (!user) {
    return <div className="container mt-5"><h3>Loading saved jobs...</h3></div>;
  }

  // Filter jobs that match saved job IDs
  const savedJobs = jobs.filter(job => user.savedJobs.includes(job._id));

  return (
    <div className="container mt-5">
      <h2>Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <p>No saved jobs yet.</p>
      ) : (
        <ul className="list-group">
          {savedJobs.map((job) => (
            <li key={job._id} className="list-group-item">
              <h5>{job.title}</h5>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Posted on:</strong> {new Date(job.postedAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Saved;
