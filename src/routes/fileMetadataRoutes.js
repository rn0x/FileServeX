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
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getFileMetadata } from '../utils/fileUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

/**
 * @route GET /api/files/*
 * @desc Get metadata of a file
 * @access Public
 */
router.get('/*', async (req, res) => {
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

    fs.access(filepath, fs.constants.F_OK, async (err) => {
        if (err) {
            return res.status(404).json({
                timestamp: new Date().toISOString(),
                method: req.method,
                url: req.originalUrl,
                statusCode: 404,
                errorType: 'Not Found',
                message: 'File not found'
            });
        }

        try {
            const metadata = await getFileMetadata(filepath, req, res);
            res.json({
                filename: safeFilename,
                ...metadata,
                url: `http://localhost:${process.env.PORT || 7000}/files/${safeFilename}`
            });
        } catch (error) {
            res.status(500).json({
                timestamp: new Date().toISOString(),
                method: req.method,
                url: req.originalUrl,
                statusCode: 500,
                errorType: 'Internal Server Error',
                message: 'Error retrieving file metadata'
            });
        }
    });
});

export default router;