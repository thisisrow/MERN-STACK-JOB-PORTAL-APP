import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("http://localhost:8081/api/jobs");
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  // Fetch recommendations for logged-in user
  const fetchRecommendations = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:8081/api/recommendations/${userId}`);
      setRecommendations(data.recommendedJobs || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, recommendations, fetchRecommendations }}>
      {children}
    </JobContext.Provider>
  );
};
