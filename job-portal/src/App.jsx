import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JobList from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Navbar from "./components/NavBar";
import Profile from "./pages/Profile";
import Applied from "./pages/Applied";
import Saved from "./pages/Saved";
import UpdateProfile from "./pages/UpdateProfile";
import CreateJob from "./pages/CreateJob";
import JobsRecruiter from "./pages/JobsRecruter";
import RecruiterApplications from "./pages/RecruiterApplications";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/applied" element={<Applied />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/jobs-recruiter" element={<JobsRecruiter />} />
        <Route path="/applications" element={<RecruiterApplications />} />
      </Routes>
    </Router>
  );
}

export default App;
