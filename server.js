import express from 'express';
import fetch from 'node-fetch';  // Using import for node-fetch (ensure you're using version 3.x)
import cors from 'cors';

const app = express();
const port = 3001;

// Enable CORS to allow requests from frontend (port 5173)
app.use(cors());

// Middleware to parse JSON bodies in requests
app.use(express.json());

// POST endpoint to create a session and get authSessionToken
app.post('/getSessionToken', async (req, res) => {
  const { originOrgId, originOrgName, originUserEmail, originUserName } = req.body;

  // Replace with your actual API_KEY
  const API_KEY = "3d974cedbfa79dce0311be0a9a998b25f8eb2cfaa0d63b93ff12a66059bd5891";  

  // Construct the body of the POST request
  const body = {
    originOrgId, 
    originOrgName, 
    originUserEmail, 
    originUserName,
  };

  const headers = {
    Authorization: `Bearer ${API_KEY}`,  // Add API Key for authentication
    'Content-Type': 'application/json',  // Specify JSON content type
  };

  try {
    // Make a POST request to the Knit API
    const response = await fetch('https://api.getknit.dev/v1.0/auth.createSession', {
      method: 'POST',
      body: JSON.stringify(body),  // Pass the request body
      headers: headers,            // Pass the headers
    });

    const data = await response.json(); // Parse the response

    // Check if the response contains the session token
    if (data?.msg?.token) {
      // If successful, send the token back to the frontend
      res.json({ success: true, token: data.msg.token });
    } else {
      // Handle case where token is not found
      res.status(400).json({ success: false, error: 'Token not found' });
    }
  } catch (error) {
    console.error('Error creating session:', error);
    // Handle errors in the request
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Webhook endpoint to receive category data from Knit (HRIS, Directory, Payroll)
app.post('/webhook', (req, res) => {
  // Log the incoming data (You can modify this to store or process it as needed)
  const categoryData = req.body;
  console.log('Received category data:', categoryData);

  // You can now handle this data as needed, such as storing it in a database or triggering other actions.

  // Respond to acknowledge the receipt of the data
  res.status(200).json({ success: true, message: 'Data received successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
