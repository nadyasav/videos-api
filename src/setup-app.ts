import express, { Express } from 'express';
import { videosRouter } from './videos/routers/videos.router';
import { testingRouter } from './testing/routers/testing.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (_, res) => {
    res.status(200).send('Hello world!');
  });

  app.use('/videos', videosRouter);
  app.use('/testing', testingRouter);

  return app;
};
