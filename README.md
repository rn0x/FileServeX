# FileServeX

![screencapture-home-i8x-net-2024-08-16-04_46_04](https://github.com/user-attachments/assets/5150ae22-6061-4bb5-aa60-6afba9f577f3)

## Description

This project is a file server API built with Node.js and Express. The server provides endpoints for serving files and their metadata from the `files` directory. It supports retrieving both the file content and file metadata in JSON format. The server dynamically loads either CommonJS or ES modules based on the environment variable `MODULE_TYPE`.

## Features

- Serves files from the `files` directory.
- Provides file metadata through `/api/files/*`.
- Supports JSON and other file types.
- Dynamically loads either CommonJS or ES modules based on environment configuration.
- Handles undefined routes and internal server errors gracefully.
- Automatically creates the `files` directory if it doesn't exist.

## Directory Structure

```plaintext
.
├── files/                   # Directory to store files, created automatically if missing
├── src/                     # Source files directory
│   ├── routes/              # Express routes
│   │   ├── fileMetadataRoutes.js  # Route for serving file metadata as JSON
│   │   └── fileServeRoutes.js     # Route for serving files
│   ├── utils/               # Utility functions
│   │   └── fileUtils.js     # File utility functions for handling file retrieval
│   └── index.js             # Main Express app file
├── commonjs.js              # CommonJS module file (if MODULE_TYPE is 'commonjs')
├── module.mjs              # ES Module file (if MODULE_TYPE is 'module')
├── server.js                # Entry point of the application, handles module loading
└── README.md                # Project documentation
```

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/rn0x/fileservex
   cd fileservex
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Create a `.env` file** in the root directory and specify the port and module type:

   ```
   PORT=7000
   MODULE_TYPE=commonjs
   ```

4. **Run the server:**
   ```sh
   npm start
   ```

## Usage

- **Retrieve File Metadata:**

  - Endpoint: `/api/files/*`
  - Method: `GET`
  - Example: `GET http://localhost:7000/api/files/example.json`

  This endpoint retrieves metadata for files from the `files` directory. If the requested file exists, the server responds with JSON metadata, including size, modification date, and a URL for downloading the file.

- **Retrieve a File:**

  - Endpoint: `/files/*`
  - Method: `GET`
  - Example: `GET http://localhost:7000/files/example.json`

  This endpoint serves the actual file content from the `files` directory. If the file has a `.json` extension, it will be returned as JSON. For other file types, the raw file content will be sent.

- **Root Endpoint:**

  - Endpoint: `/`
  - Method: `GET`
  - Example: `GET http://localhost:7000/`

  The root endpoint serves the `index.html` file located in the project root directory.

## Error Handling

- **Route Not Found:**
  If a request is made to an undefined route, the server returns a `404` status with an error message.

- **Internal Server Errors:**
  Any unhandled errors are caught by the error handling middleware, which logs the error and returns a `500` status with a generic error message.

## Environment Variables

- **MODULE_TYPE:** Determines whether to use CommonJS (`commonjs`) or ES modules (`module`). Defaults to `commonjs` if not specified.
- **PORT:** Specifies the port on which the server runs. Defaults to `7000` if not specified.

## Example .env File

```
PORT=7000
MODULE_TYPE=commonjs
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contribution

Feel free to contribute by submitting a pull request or opening an issue. Please follow the code of conduct and ensure your code adheres to the project's coding standards.