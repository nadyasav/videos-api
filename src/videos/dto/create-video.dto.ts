import { Resolution } from '../types/video.types';

export type CreateVideoDto = {
  title: string;
  author: string;
  availableResolutions: Resolution[];
  canBeDownloaded?: boolean;
  minAgeRestriction?: number | null;
};
