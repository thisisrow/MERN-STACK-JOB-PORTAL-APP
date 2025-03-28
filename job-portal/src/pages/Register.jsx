import React, { useState } from "react";
import axios from "../config/axios";
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
  const [passwordStrength, setPasswordStrength] = useState({
    strength: "Weak",
    color: "danger",
    width: "20%",
    suggestions: [],
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  // Password strength checker
  const evaluatePasswordStrength = (password) => {
    let strength = "Weak";
    let color = "danger";
    let width = "20%";
    let suggestions = [];

    if (password.length >= 6) {
      strength = "Medium";
      color = "warning";
      width = "50%";
    }
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
      strength = "Strong";
      color = "success";
      width = "100%";
    }

    // Provide real-time suggestions
    if (!/[A-Z]/.test(password)) suggestions.push("Add an uppercase letter (A-Z)");
    if (!/\d/.test(password)) suggestions.push("Include at least one number (0-9)");
    if (!/[!@#$%^&*]/.test(password)) suggestions.push("Use a special character (!@#$%^&*)");
    if (password.length < 8) suggestions.push("Make it at least 8 characters long");

    setPasswordStrength({ strength, color, width, suggestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid Gmail or Outlook email.");
      return;
    }
    await axios.post("/api/auth/register", formData);
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
            {formData.password && (
              <>
                <div className="mt-2">
                  <div className="progress">
                    <div
                      className={`progress-bar bg-${passwordStrength.color}`}
                      role="progressbar"
                      style={{ width: passwordStrength.width }}
                    >
                      {passwordStrength.strength}
                    </div>
                  </div>
                </div>
                {passwordStrength.suggestions.length > 0 && (
                  <ul className="text-danger mt-2 small">
                    {passwordStrength.suggestions.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">
              <FaUserTag className="me-2" /> Role
            </label>
            <select className="form-select" name="role" onChange={handleChange}>
              <option value="student">Job seekers</option>
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
