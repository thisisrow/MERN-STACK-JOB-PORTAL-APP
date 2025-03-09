const axios = require('axios');

// API details
const API_KEY = "ddc-LuoBpT0yB7CdsZKlPJTVlPrB17cCBdG5ezAsOyxYviGfMCarq6";
const BASE_URL = "https://api.sree.shop/v1";

// Function to make the API request
async function getGptResponse() {
  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: "gpt-4o",
        messages: [
          { role: "user", content: "can you rank resume" }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("\n--- GPT-4o Response ---");
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the function
getGptResponse();
