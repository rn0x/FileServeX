/*!
 * FileServeX
 * A file server API built with Node.js and Express.
 * 
 * @license MIT
 * @author Rayan Almalki (rn0x)
 * 
 * Copyright (c) 2024 Rayan Almalki (rn0x). All rights reserved.
 */

import express from 'express';
import fileRoutes from './routes/fileRoutes.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
const root = path.resolve(process.cwd());

// Serve static files from the 'files' directory
app.use('/api/files', fileRoutes);

// Serve the main HTML file at the root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error stack to the console
  console.error(err.stack);

  // If headers have already been sent, do not attempt to send a response again
  if (res.headersSent) {
    return next(err);
  }

  // Send a generic error response
  res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
