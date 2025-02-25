import React from "react";
import Job from "./Jobs";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaUsers, FaSearch, FaRocket } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
        <div class="bg-dark text-white py-5">
  <div class="container text-center">
    <h1 class="display-4 font-weight-bold mb-4">Welcome to JobPortal</h1>
    <p class="lead">Your next career opportunity is just a search away</p>
  </div>
</div>

      {/* Hero Section */}
      <section className="hero text-center text-white d-flex align-items-center justify-content-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Find Your Dream Job</h1>
          <p className="lead">Connect with top recruiters and land your next opportunity.</p>
          <button className="btn btn-primary me-3" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-5">
        <div className="container">
          <h2 className="text-center mb-4">Why Choose Us?</h2>
          <div className="row text-center">
            <div className="col-md-3">
              <FaBriefcase size={40} className="text-primary mb-3" />
              <h4>Top Jobs</h4>
              <p>Access thousands of job opportunities from leading companies.</p>
            </div>
            <div className="col-md-3">
              <FaUsers size={40} className="text-primary mb-3" />
              <h4>Trusted Recruiters</h4>
              <p>We connect you with verified employers and recruiters.</p>
            </div>
            <div className="col-md-3">
              <FaSearch size={40} className="text-primary mb-3" />
              <h4>Easy Search</h4>
              <p>Find jobs that match your skills with our smart search.</p>
            </div>
            <div className="col-md-3">
              <FaRocket size={40} className="text-primary mb-3" />
              <h4>Fast Hiring</h4>
              <p>Get hired faster with our streamlined job application process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-dark text-white text-center py-3">
        <p>© {new Date().getFullYear()} JobPortal. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
