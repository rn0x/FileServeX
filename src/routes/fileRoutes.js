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
import { getFile } from '../utils/fileUtils.js';

const router = express.Router();

/**
 * @route GET /api/files/*
 * @desc Get a file by filename and subdirectories
 * @access Public
 */
router.get('/*', getFile);

export default router;
