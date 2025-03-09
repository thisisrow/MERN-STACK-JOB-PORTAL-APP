import { createContext, useState, useEffect } from "react";
import axios from "../config/axios";

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("/api/jobs");
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch recommendations for logged-in user
  const fetchRecommendations = async (userId) => {
    try {
      const { data } = await axios.get(`/api/recommendations/${userId}`);
      setRecommendations(data.recommendedJobs || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, recommendations, fetchRecommendations, loading }}>
      {children}
    </JobContext.Provider>
  );
};
