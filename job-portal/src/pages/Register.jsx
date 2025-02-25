import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8081/api/auth/register", formData);
    navigate("/login");
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <FaUser className="me-2" /> Name
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <FaEnvelope className="me-2" /> Email
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <FaLock className="me-2" /> Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <FaUserTag className="me-2" /> Role
            </label>
            <select className="form-select" name="role" onChange={handleChange}>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
