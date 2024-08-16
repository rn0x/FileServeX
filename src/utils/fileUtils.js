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
  const filename = req.params[0];

  if (!filename) {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: 400,
      errorType: 'Bad Request',
      message: 'Filename is required'
    });
  }

  const safeFilename = path.normalize(filename);
  const filesDir = path.join(__dirname, '../../files');
  const filepath = path.join(filesDir, safeFilename);

  // Ensure 'files' directory exists
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
  }

  const extname = path.extname(safeFilename).toLowerCase();

  // Function to handle sending file response
  const sendFile = (filePath) => {
    res.sendFile(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.status(404).json({
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            statusCode: 404,
            errorType: 'Not Found',
            message: 'File not found'
          });
        } else {
          console.error('Error sending file:', err);
          if (!res.headersSent) {
            res.status(500).json({
              timestamp: new Date().toISOString(),
              method: req.method,
              url: req.originalUrl,
              statusCode: 500,
              errorType: 'Internal Server Error',
              message: 'An unexpected error occurred. Please try again later.'
            });
          }
        }
      }
    });
  };

  // Function to handle sending JSON response
  const sendJson = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.status(404).json({
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            statusCode: 404,
            errorType: 'Not Found',
            message: 'File not found'
          });
        } else {
          console.error('Error reading file:', err);
          if (!res.headersSent) {
            res.status(500).json({
              timestamp: new Date().toISOString(),
              method: req.method,
              url: req.originalUrl,
              statusCode: 500,
              errorType: 'Internal Server Error',
              message: 'An unexpected error occurred. Please try again later.'
            });
          }
        }
        return;
      }

      // Check if the file content is empty or invalid JSON
      if (!data.trim()) {
        return res.status(404).json({
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.originalUrl,
          statusCode: 404,
          errorType: 'Not Found',
          message: 'File is empty or invalid'
        });
      }

      try {
        const jsonData = JSON.parse(data);
        if (!res.headersSent) {
          res.json(jsonData);
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        if (!res.headersSent) {
          res.status(500).json({
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            statusCode: 500,
            errorType: 'Internal Server Error',
            message: 'Failed to parse JSON data'
          });
        }
      }
    });
  };

  if (extname === '.json') {
    sendJson(filepath);
  } else {
    sendFile(filepath);
  }
};

/**
 * Get file metadata
 * @param {string} filepath - The path to the file
 * @param {express.Request} req - The Express request object (optional, for detailed error handling)
 * @param {express.Response} res - The Express response object (optional, for detailed error handling)
 * @returns {Promise<object>} - Metadata about the file
 */
export const getFileMetadata = async (filepath, req, res) => {
  try {
    const stats = await fs.promises.stat(filepath);
    return {
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime,
      ext: path.extname(filepath),
    };
  } catch (error) {
    console.error('Error retrieving file metadata:', error);

    // Check if req and res are provided for detailed error handling
    if (req && res) {
      const statusCode = error.code === 'ENOENT' ? 404 : 500;
      const errorType = statusCode === 404 ? 'Not Found' : 'Internal Server Error';
      const message = error.code === 'ENOENT'
        ? 'File not found'
        : 'Unable to retrieve file metadata';

      res.status(statusCode).json({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        statusCode: statusCode,
        errorType: errorType,
        message: message,
      });
    } else {
      // If req and res are not provided, just throw the error
      throw new Error('Unable to retrieve file metadata');
    }
  }
};
