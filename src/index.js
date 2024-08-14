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

// Routes Files
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(root, '/index.html'));
});

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).send({ error: 'Something went wrong!' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
