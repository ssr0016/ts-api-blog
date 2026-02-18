/**
 * @Copyright 2027 Classless
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from 'express';
import { timeStamp } from 'node:console';
const router = Router();

/**
 * Routes
 */
import authRoutes from '@/routes/v1/auth';

/**
 * Root route
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is alive',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://docs.blog-api.classless.com',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);

export default router;
