/**
 * Entry point for the application that dynamically loads the appropriate module 
 * based on the custom module type environment variable.
 * 
 * @file
 * @module main
 */

// Get the module type, defaulting to 'commonjs' if not specified
const moduleType = process.env.MODULE_TYPE || 'commonjs';

if (moduleType === 'commonjs') {
    /**
     * Load and execute the CommonJS module.
     * @requires ./commonjs.js
     */
    require('./commonjs.js');
} else if (moduleType === 'module') {
    /**
     * Dynamically import and execute the ES Module.
     * Handles any errors that occur during the import.
     * @async
     * @requires ./module.mjs
     */
    import('./module.mjs')
        .catch(err => console.error('Error loading module:', err));
} else {
    /**
     * Handles invalid module type configurations.
     * Logs an error message and exits the process.
     */
    console.error('Invalid module type specified');
    process.exit(1);
}