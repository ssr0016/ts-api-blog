/**
 * @Copyright 2027 Classless
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    await User.deleteOne({ _id: userId });
    logger.info('A user account has been deleted', { userId });

    res.status(204).end();
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });

    logger.error('Error while deleting a user', err);
  }
};

export default deleteUser;
