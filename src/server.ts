/**
 * @Copyright 2027 Classless
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom modules
 */
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';

/**
 * Router
 */
import v1Routes from './routes/v1';

/**
 * Types
 */
import type { CorsOptions } from 'cors';

/**
 * Express app initial
 */
const app = express();

// Configure CORS options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELISTED_DOMAINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      // Reject requests from non-whitelisted origins
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false,
      );
      console.log(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Enable URL-encoded request body parsing with extended mode
// `extended: true` allows rich objects and arrays via query string library
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // only compress responses larger than 1kb
  }),
);

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server.
 * Tries to connect to the database before initializing the server
 * Defines the API Route (`/api/v1`)
 * Starts the server on the specified PORT and logs the running URL.
 * If an error occurs during startup, it is logged, and the process exits with status 1.
 */
(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      console.log(`Server is running: http://localhost:${config.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
  }
})();

/**
 * Handles Server shutdown gracefully by disconnecting from database
 * Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * Exists the process with status code 0. (indicating a successful shutdown)
 */
const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();

    console.log('Server Shutdown');
    process.exit(0);
  } catch (err) {
    console.log('Error during server shutdown', err);
  }
};

/**
 * Listen for termination signals (`SIGTERM` and `SIGINT`)
 * - `SIGTERM` is a typically sent when stopping a process (e.q., `kill` command or container shutdown)
 * - `SIGINT` is triggered when the user interrupts the process (e.q., pressing `Ctrl+C`)
 * - When either signal is received `handleServerShutdown` is executed to ensure proper cleanup.
 */
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
