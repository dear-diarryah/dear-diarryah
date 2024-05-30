// Import the express module
const express = require('express');

// Create an Express application
const app = express();

// Define a port for the server to listen on
const port = 3000;

app.use(express.static('public'))

// Define a simple route handler for the root URL ('/')
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server and listen on the defined port
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${port}`);
});
