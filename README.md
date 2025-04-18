The current project is a MERN Stack Job Portal Application with the following features:

General Features
1 User Authentication:
  -Users can register and log in.
  -Role-based access for "students" and "recruiters."
2 Responsive Design:
  -The application is designed to work seamlessly across devices.
3 Role-Based Dashboards:
  -Separate dashboards for students and recruiters.

Student Features
1 Profile Management:
 -Students can update their profile, including skills, education, and resume upload.

2 Job Search:
  -Students can search for jobs using filters like title, company, location, skills, experience, and education.

3 Job Application:
  -Students can apply for jobs with a cover letter.
  -View the status of their applications.

4 Saved Jobs:
  Students can save jobs for later reference.

5 Job Recommendations:
  -AI-powered job recommendations based on their profile (skills, experience, and education).

Recruiter Features
1 Profile Management:
  -Recruiters can update their profile.

2 Job Posting:
  -Recruiters can create, edit, and delete job postings.

3 View Applications:
  -Recruiters can view applications for their posted jobs.

4 Application Ranking:
  -AI-powered ranking of job applications based on job requirements and candidate profiles.

5 Application Status Management:
  -Recruiters can update the status of applications (e.g., pending, reviewed, interview, hired, rejected).

6 Admin Features 
- Not explicitly implemented but can be extended to include admin features like managing users, jobs, and applications.

Backend Features
1 RESTful API:
-Built with Express.js and MongoDB for handling user, job, and application data.

2 AI Integration:
-Uses OpenAI API for ranking resumes and providing job recommendations.

3 Cloudinary Integration:
-For storing resumes uploaded by students.

4 Secure Authentication:
-JWT-based authentication for secure API access.
-Error Handling:

5 Comprehensive error handling for API endpoints.

Frontend Features
1 React-Based UI:
-Built with React and Vite for fast and efficient rendering.
2 State Management:
-Context API for managing authentication and job data.
3 Real-Time Feedback:
-Password strength checker, progress bars for uploads, and toast notifications for actions.
Third-Party Libraries:

Bootstrap for styling.

React Icons for UI enhancements.
React Toastify for notifications.

Deployment
Frontend and backend are configured for deployment on platforms like Vercel and Render.
