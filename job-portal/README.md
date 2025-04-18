The current project is a MERN Stack Job Portal Application with the following features:

General Features
User Authentication:

Users can register and log in.
Role-based access for "students" and "recruiters."
Responsive Design:

The application is designed to work seamlessly across devices.
Role-Based Dashboards:

Separate dashboards for students and recruiters.
Student Features
Profile Management:

Students can update their profile, including skills, education, and resume upload.
Job Search:

Students can search for jobs using filters like title, company, location, skills, experience, and education.
Job Application:

Students can apply for jobs with a cover letter.
View the status of their applications.
Saved Jobs:

Students can save jobs for later reference.
Job Recommendations:

AI-powered job recommendations based on their profile (skills, experience, and education).
Recruiter Features
Profile Management:

Recruiters can update their profile.
Job Posting:

Recruiters can create, edit, and delete job postings.
View Applications:

Recruiters can view applications for their posted jobs.
Application Ranking:

AI-powered ranking of job applications based on job requirements and candidate profiles.
Application Status Management:

Recruiters can update the status of applications (e.g., pending, reviewed, interview, hired, rejected).
Admin Features (Optional)
Not explicitly implemented but can be extended to include admin features like managing users, jobs, and applications.
Backend Features
RESTful API:

Built with Express.js and MongoDB for handling user, job, and application data.
AI Integration:

Uses OpenAI API for ranking resumes and providing job recommendations.
Cloudinary Integration:

For storing resumes uploaded by students.
Secure Authentication:

JWT-based authentication for secure API access.
Error Handling:

Comprehensive error handling for API endpoints.
Frontend Features
React-Based UI:

Built with React and Vite for fast and efficient rendering.
State Management:

Context API for managing authentication and job data.
Real-Time Feedback:

Password strength checker, progress bars for uploads, and toast notifications for actions.
Third-Party Libraries:

Bootstrap for styling.
React Icons for UI enhancements.
React Toastify for notifications.
Deployment
Frontend and backend are configured for deployment on platforms like Vercel and Render.