import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import StudentDashboard from "../components/StudentDashboard";
import RecruiterDashboard from "../components/RecruiterDashboard";
import Home from "./Home";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="container mt-5"><h3>Loading...</h3></div>;

  return (
    <div className="container mt-5">
      {user?.role === "student" ? <StudentDashboard /> :user?.role === "recruiter"? <RecruiterDashboard />:<Home/>}
    </div>
  );
};

export default Dashboard;
