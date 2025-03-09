const axios = require('axios');

// API details
  const API_KEY = process.env.AI_API_KEY;
  const BASE_URL = process.env.AI_BASE_URL;

// Function to rank resumes based on job requirements
async function rankResumes(jobDetails, applications) {
  try {
    const prompt = `
      Job Requirements:
      Title: ${jobDetails.title}
      Required Skills: ${jobDetails.requirements.join(', ')}
      Required Experience: ${jobDetails.experienceRequired} years
      Required Education: ${jobDetails.educationRequired || 'Not specified'}

      Please analyze and rank the following candidates based on their match with the job requirements.
      Each candidate should receive a score from 0-100 and a brief explanation.

      Candidates:
      ${applications.map(app => `
        Candidate ID: ${app.applicant._id}
        Skills: ${app.applicant.skills.join(', ')}
        Experience: ${app.applicant.experience} years
        Education: ${app.applicant.education?.degree || 'Not specified'}
        Resume Text: ${app.applicant.description || 'No resume text available'}
      `).join('\n')}
      
      IMPORTANT: Respond with ONLY a valid JSON object in the following format, without any markdown or code block syntax:
      {
        "rankings": [
          {
            "candidateId": "id1",
            "score": 85,
            "explanation": "Explanation for candidate 1"
          }
        ]
      }
    `;

    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are an expert HR AI assistant that evaluates job applications. You must ONLY respond with a valid JSON object containing rankings, without any markdown or additional text."
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Process and format the response
    const content = response.data.choices[0].message.content;
    // console.log("Resume Rankings Generated:", content);
    
    try {
      // Clean the content by removing markdown code block syntax
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsedContent = JSON.parse(cleanContent);
      return parsedContent.rankings || [];
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      // If parsing fails, use fallback
      return applications.map(app => ({
        candidateId: app.applicant._id.toString(),
        score: calculateBasicScore(jobDetails, app.applicant),
        explanation: "Generated using fallback scoring system due to AI response parsing error"
      }));
    }

  } catch (error) {
    console.error("Error in resume ranking:", error);
    // Fallback to basic ranking if API fails
    return applications.map(app => ({
      candidateId: app.applicant._id.toString(),
      score: calculateBasicScore(jobDetails, app.applicant),
      explanation: "Generated using fallback scoring system due to API error"
    }));
  }
}

// Fallback basic scoring function
function calculateBasicScore(job, applicant) {
  let score = 0;
  
  // Skills match (40 points)
  const requirements = job.requirements || [];
  const applicantSkills = applicant.skills || [];
  
  if (requirements.length > 0) {
    const matchedSkills = requirements.filter(req => 
      applicantSkills.some(skill => 
        skill.toLowerCase().includes(req.toLowerCase())
      )
    );
    score += (matchedSkills.length / requirements.length) * 40;
  } else {
    // If no requirements specified, give partial points
    score += 20;
  }

  // Experience match (30 points)
  const requiredExp = job.experienceRequired || 0;
  const applicantExp = applicant.experience || 0;
  
  if (requiredExp > 0) {
    if (applicantExp >= requiredExp) {
      score += 30;
    } else {
      score += (applicantExp / requiredExp) * 30;
    }
  } else {
    // If no experience required, give full points
    score += 30;
  }

  // Education match (30 points)
  const requiredEdu = job.educationRequired || '';
  const applicantEdu = applicant.education?.degree || '';
  
  if (requiredEdu && typeof requiredEdu === 'string' && applicantEdu) {
    if (applicantEdu.toLowerCase().includes(requiredEdu.toLowerCase())) {
      score += 30;
    } else {
      // Give partial points for having any education
      score += 15;
    }
  } else {
    // If no education required or applicant has no education
    score += 15;
  }

  return Math.round(score);
}

// Export the ranking function
module.exports = {
  rankResumes
};
