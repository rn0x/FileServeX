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
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fileMetadataRoutes from './routes/fileMetadataRoutes.js';
import fileServeRoutes from './routes/fileServeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
const root = path.resolve(process.cwd());

app.use(cors());

// Serve static files from the 'files' directory
app.use('/files', fileServeRoutes);

// Serve metadata for files
app.use('/api/files', fileMetadataRoutes);

// Serve the main HTML file at the root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

// Catch-all route for undefined routes
app.use((req, res) => {
  const errorMessage = 'Route not found';
  const statusCode = 404;
  const requestUrl = req.originalUrl;
  const method = req.method;

  console.warn(`${errorMessage}: ${method} ${requestUrl}`);

  res.status(statusCode).json({
    status: statusCode,
    error: errorMessage,
    message: `The requested route '${requestUrl}' using method '${method}' does not exist.`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});