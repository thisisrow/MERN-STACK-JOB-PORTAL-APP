import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaGraduationCap, FaBriefcase, FaWrench, FaFilePdf } from "react-icons/fa";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Loader until user data is available
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 rounded">
        <div className="text-center mb-4">
          <FaUser size={60} className="text-primary mb-2" />
          <h2 className="mb-1">{user.name}</h2>
          <p className="text-muted">{user.email}</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h4 className="text-primary">Personal Details</h4>
            <p><FaMapMarkerAlt className="text-secondary" /> <strong>Location:</strong> {user.location}</p>
            <p><FaPhone className="text-secondary" /> <strong>Phone:</strong> {user.phone}</p>
          </div>

          <div className="col-md-6">
            <h4 className="text-primary">Education</h4>
            <p><FaGraduationCap className="text-secondary" /> <strong>Degree:</strong> {user.education?.degree || "Not Provided"}</p>
            <p><strong>Institution:</strong> {user.education?.institution || "Not Provided"}</p>
            <p><strong>Year:</strong> {user.education?.yearOfCompletion || "Not Provided"}</p>
          </div>
        </div>

        <hr />

        {/* Resume Section */}
        <div className="row mt-4">
          <div className="col-12">
            <h4 className="text-primary">Resume</h4>
            {user.resume ? (
              <div className="d-flex align-items-center">
                <FaFilePdf className="text-danger me-2" size={24} />
                <a href={user.resume} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                  View Resume
                </a>
              </div>
            ) : (
              <p className="text-muted">No resume uploaded yet</p>
            )}
          </div>
        </div>

        <hr />

        <h4 className="text-primary"><FaWrench className="text-secondary" /> Skills</h4>
        {user.skills?.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span key={index} className="badge bg-primary">{skill}</span>
            ))}
          </div>
        ) : (
          <p>No skills added.</p>
        )}

        <hr />

        <h4 className="text-primary"><FaBriefcase className="text-secondary" /> Experience</h4>
        <p>{user.experience ? `${user.experience} years` : "No experience added."}</p>

        <div className="text-center mt-4">
          <button className="btn btn-outline-primary btn-lg" onClick={() => navigate("/update-profile")}>
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
