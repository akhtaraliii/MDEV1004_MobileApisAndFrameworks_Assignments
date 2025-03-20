const routes = require('./routes/routes');
const express = require('express');
const app = express();
const verifyToken = require('./middleware/auth');
require('dotenv').config();
require('./database/db').connect();

app.use(express.json());

// Any route starting with '/api' will be handled by our routes file
app.use('/api', routes);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
