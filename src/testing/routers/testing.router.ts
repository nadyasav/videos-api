import { Router, Response } from 'express';
import { db } from '../../db/db';

export const testingRouter = Router();

testingRouter.delete('/all-data', (_, res: Response) => {
  db.videos.clear();
  db.nextVideoId = 0;
  res.status(204).send();
});
