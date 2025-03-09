import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthProvider } from './context/AuthContext.jsx';
import { JobProvider } from './context/JobContext.jsx';
import App from './App.jsx'
import { Analytics } from "@vercel/analytics/react";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <JobProvider>
      <App />
      <Analytics />
      </JobProvider>
    </AuthProvider>
    
  </StrictMode>,
)
