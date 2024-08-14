/*!
 * FileServeX
 * A file server API built with Node.js and Express.
 * 
 * @license MIT
 * @author Rayan Almalki (rn0x)
 * 
 * Copyright (c) 2024 Rayan Almalki (rn0x). All rights reserved.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get a file by filename
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const getFile = (req, res, next) => {
  // Access the full path after /api/files/ using wildcard parameter
  const filename = req.params[0];

  // Check if filename is provided
  if (!filename) {
    return res.status(400).send({ error: 'Filename is required' });
  }

  // Normalize the path to prevent directory traversal attacks
  const safeFilename = path.normalize(filename);

  // Resolve the full path to the file
  const filesDir = path.join(__dirname, '../../files');

  // Check if the 'files' directory exists, if not, create it
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
  }

  const filepath = path.join(filesDir, safeFilename);

  console.log('Requested filename:', filename); // Debug line
  console.log('Resolved filepath:', filepath); // Debug line

  // Get the file extension
  const extname = path.extname(safeFilename).toLowerCase();

  // Function to handle sending file response
  const sendFile = (filePath) => {
    res.sendFile(filePath, (err) => {
      if (err) {
        if (!res.headersSent) {
          next(err);
        }
      }
    });
  };

  // Function to handle sending JSON response
  const sendJson = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (!res.headersSent) {
          return next(err);
        }
      }
      try {
        const jsonData = JSON.parse(data);
        if (!res.headersSent) {
          res.json(jsonData);
        }
      } catch (parseError) {
        if (!res.headersSent) {
          next(parseError);
        }
      }
    });
  };

  // Handle based on file extension
  if (extname === '.json') {
    sendJson(filepath);
  } else {
    sendFile(filepath);
  }
};