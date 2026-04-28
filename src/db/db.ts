import { Video } from '../videos/types/video.types';

export const db = {
  videos: new Map<number, Video>(),
  nextVideoId: 0,
};
