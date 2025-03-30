require("dotenv").config();
const express = require('express');
const path = require('path');
const fs = require('fs'); // Import the 'fs' module for file existence checks
const bcrypt = require('bcryptjs');
const axios = require('axios');

// Create an instance of Express
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the port to listen on
const PORT = 3050;

// Serve static files from the "public" directory and Set EJS as the view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Simulated user credentials (password is hashed using bcrypt)
const validUser = {
  username: 'jackpine',
  password: bcrypt.hashSync(process.env.PASSWORD, 10), // Hashed password
};

// Track server status globally
let serverStatus = {
  'control-panel': 'online', // Default status for control-panel
  'website': 'online',       // Default status for website
  'snacktrack': 'online',    // Default status for snacktrack
};

// Handle clean URLs for HTML pages
app.get('/about', (req, res) => {
    if (redirectToMaintenanceIfNeeded('website', res)) return; // Stop execution if redirected
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
    if (redirectToMaintenanceIfNeeded('website', res)) return; // Stop execution if redirected
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Default route for the home page
app.get('/', (req, res) => {
    if (redirectToMaintenanceIfNeeded('website', res)) return; // Stop execution if redirected
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dynamic route for other pages
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, 'public', `${page}.html`);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    if (redirectToMaintenanceIfNeeded('website', res)) return; // Stop execution if redirected
     // Redirect if needed
    res.sendFile(filePath); // Send the requested file
  } else {
    if (redirectToMaintenanceIfNeeded('website', res)) return; // Stop execution if redirected
    // Send the 404 error page
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

app.get('/api/server-login', (req, res) => {
  res.render('serverLogin');
});

app.post('/api/server-dash', (req, res) => {
    const { username, password } = req.body;
  
    // Validate username and password
    if (username === validUser.username && bcrypt.compareSync(password, validUser.password)) {
      // Define allowed statuses for each server
      const allowedStatuses = {
        'control-panel': ['online', 'maintenance'],
        'website': ['online', 'maintenance', 'construction'],
        'snacktrack': ['online', 'offline']
      };
  
      // Render the "server-status" page with serverStatus and allowedStatuses
      res.render('serverStatus', { serverStatus, allowedStatuses });
    } else {
      // If login fails, send an error message
      res.status(401).send('Invalid username or password');
    }
});

// API endpoint for server update
app.post('/api/server-update', async (req, res) => {
  const { server, status } = req.body;

  // Validate input
  if (!server || !status) {
    return res.status(400).send('Both server and status are required');
  }

  // Update server status
  serverStatus[server] = status;

  // Handle server updates based on the server name
  if (server === 'control-panel') {
    try {
      // Forward the POST request to http://localhost:3000
      const response = await axios.post('http://localhost:3000', {
        server,
        status,
      });

      // Combine your custom message with the response from the forwarded request
      const combinedResponse = {
        message: `${server.charAt(0).toUpperCase() + server.slice(1)} updated successfully to ${status}`,
        forwardedResponse: response.data,
      };

      // Send the combined response back to the client
      res.status(200).json(combinedResponse);
    } catch (error) {
      // Handle errors (e.g., if http://localhost:3000 is unreachable)
      console.error('Error forwarding request:', error.message);
      res.status(500).send('Failed to forward the request to http://localhost:3000');
    }
  } else if (server === 'website') {
    console.log("Server loaded with mode: ", status);
    return res.status(200).json({
      message: `Website updated successfully to ${status}`,
    });
  } else if (server === 'snacktrack') {
    try {
        // Forward the POST request to http://localhost:3035
        const response = await axios.post('http://localhost:3035/api/update-server-status', { status });
  
        // Combine your custom message with the response from the forwarded request
        const combinedResponse = {
          message: `${server.charAt(0).toUpperCase() + server.slice(1)} updated successfully to ${status}`,
          forwardedResponse: response.data,
        };
  
        // Send the combined response back to the client
        res.status(200).json(combinedResponse);
      } catch (error) {
        // Handle errors (e.g., if http://localhost:3035 is unreachable)
        console.error('Error forwarding request:', error.message);
        res.status(500).send('Failed to forward the request to http://localhost:3035');
      }
  } else {
    res.status(400).send('Invalid server name');
  }
});

// Helper function to check server status and redirect if necessary
function redirectToMaintenanceIfNeeded(serverName, res) {
  if (serverStatus[serverName] === 'construction') {
    res.sendFile(path.join(__dirname, 'public', 'construction.html'));
    return true; // Indicates redirection occurred
  } else if(serverStatus[serverName] === 'maintenance') {
    res.sendFile(path.join(__dirname, 'public', 'maintenance.html'));
    return true; // Indicates redirection occurred
  }
  return false; // No redirection
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});