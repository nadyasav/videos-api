import { Router, Request, Response } from 'express';
import { db } from '../../db/db';
import { Video } from '../types/video.types';
import {
  validateCreateVideo,
  validateUpdateVideo,
} from '../validation/video.validation';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const VIDEO_NOT_FOUND = 'Video not found';

export const videosRouter = Router();

videosRouter
  .get('', (_, res: Response) => {
    res.status(200).send(Array.from(db.videos.values()));
  })

  .get('/:id', (req: Request, res: Response) => {
    const video = db.videos.get(Number(req.params.id));

    if (!video) {
      return res.status(404).send({ message: VIDEO_NOT_FOUND });
    }

    res.status(200).send(video);
  })

  .post('', (req: Request, res: Response) => {
    const errors = validateCreateVideo(req.body);

    if (errors.length > 0) {
      return res.status(400).send({ errorsMessages: errors });
    }

    const dateNow = Date.now();
    const id = db.nextVideoId++;

    const newVideo: Video = {
      id,
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: req.body.canBeDownloaded ?? false,
      minAgeRestriction: req.body.minAgeRestriction ?? null,
      availableResolutions: req.body.availableResolutions,
      createdAt: new Date(dateNow).toISOString(),
      publicationDate: new Date(dateNow + ONE_DAY_MS).toISOString(),
    };

    db.videos.set(id, newVideo);
    res.status(201).send(newVideo);
  })

  .put('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const video = db.videos.get(id);

    if (!video) {
      return res.status(404).send({ message: VIDEO_NOT_FOUND });
    }

    const errors = validateUpdateVideo(req.body);

    if (errors.length > 0) {
      return res.status(400).send({ errorsMessages: errors });
    }

    const updatedVideo: Video = {
      ...video,
      title: req.body.title,
      author: req.body.author,
      availableResolutions: req.body.availableResolutions,
      canBeDownloaded: req.body.canBeDownloaded,
      minAgeRestriction: req.body.minAgeRestriction,
      publicationDate: req.body.publicationDate,
    };

    db.videos.set(id, updatedVideo);
    res.status(204).send();
  })

  .delete('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!db.videos.has(id)) {
      return res.status(404).send({ message: VIDEO_NOT_FOUND });
    }

    db.videos.delete(id);
    res.status(204).send();
  });
