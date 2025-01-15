// Import necessary libraries
const express = require('express');
const cors = require('cors');

// Initialize the Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

// Define a single endpoint
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend server!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

