import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { user, token, refreshUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name || "",
    location: user.location || "",
    phone: user.phone || "",
    education: {
      degree: user.education?.degree || "",
      institution: user.education?.institution || "",
      yearOfCompletion: user.education?.yearOfCompletion || "",
    },
    skills: user.skills || [],
    experience: user.experience || 0,
  });

  const [skillInput, setSkillInput] = useState(""); // New skill input
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input changes for profile fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("education.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        education: { ...prev.education, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add Skill
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput(""); // Clear input after adding
    }
  };

  // Remove Skill
  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Submit Updated Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8081/api/users/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refreshUserData();
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess(null);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update profile.");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Profile</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input type="text" name="phone" className="form-control" value={formData.phone} maxLength={10} onChange={handleChange} />
        </div>

        <h4>Education</h4>
        <div className="mb-3">
          <label className="form-label">Degree</label>
          <input type="text" name="education.degree" className="form-control" value={formData.education.degree} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Institution</label>
          <input type="text" name="education.institution" className="form-control" value={formData.education.institution} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Year of Completion</label>
          <input type="number" name="education.yearOfCompletion" className="form-control" value={formData.education.yearOfCompletion} onChange={handleChange} />
        </div>

        {/* Skills Section */}
        <h4>Skills</h4>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Add a skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
          <button type="button" className="btn btn-primary mt-2" onClick={addSkill}>Add Skill</button>
        </div>

        <ul className="list-group mb-3">
          {formData.skills.map((skill, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {skill}
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSkill(index)}>Remove</button>
            </li>
          ))}
        </ul>
        
        <div className="mb-3">
            <label className="form-label">Experience (in years)</label>
            <input type="number" name="experience" className="form-control" value={formData.experience} onChange={handleChange} />
        </div>


        <button type="submit" className="btn btn-success">Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
