import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null); // Clear previous errors
    setIsLoading(true); // Start loading state

    const { success, error: loginError } = await login(email, password);

    if (success) {
      navigate("/dashboard"); // Redirect only if login is successful
    } else {
      setLocalError(loginError || "Invalid email or password. Please try again.");
      setIsLoading(false); // Stop loading state
      setTimeout(() => setLocalError(null), 3000); // Auto-hide error
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>

        {/* Bootstrap Alert for Errors */}
        {(localError || error) && (
          <div className="alert alert-danger text-center" role="alert">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control form-control-lg shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-lg shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-100 btn btn-primary btn-lg" disabled={isLoading}>
            {isLoading ? "Validating..." : "Login"} {/* Conditional text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
