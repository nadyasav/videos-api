import { Resolution } from '../types/video.types';
import { CreateVideoDto } from '../dto/create-video.dto';
import { UpdateVideoDto } from '../dto/update-video.dto';
import { FieldError } from '../../core/types/error.types';

const VIDEO_KEYS = {
  title: 'title',
  author: 'author',
  availableResolutions: 'availableResolutions',
  canBeDownloaded: 'canBeDownloaded',
  minAgeRestriction: 'minAgeRestriction',
  publicationDate: 'publicationDate',
} as const;

const validateTitle = (title: string): FieldError | null => {
  if (!title || title.trim().length === 0) {
    return {
      message: `${VIDEO_KEYS.title} is required`,
      field: VIDEO_KEYS.title,
    };
  }

  if (title.length > 40) {
    return {
      message: `${VIDEO_KEYS.title} must be at most 40 characters`,
      field: VIDEO_KEYS.title,
    };
  }

  return null;
};

const validateAuthor = (author: string): FieldError | null => {
  if (!author || author.trim().length === 0) {
    return {
      message: `${VIDEO_KEYS.author} is required`,
      field: VIDEO_KEYS.author,
    };
  }

  if (author.length > 20) {
    return {
      message: `${VIDEO_KEYS.author} must be at most 20 characters`,
      field: VIDEO_KEYS.author,
    };
  }

  return null;
};

const validateResolutions = (resolutions: Resolution[]): FieldError | null => {
  if (!resolutions || resolutions.length === 0) {
    return {
      message: `${VIDEO_KEYS.availableResolutions} is required`,
      field: VIDEO_KEYS.availableResolutions,
    };
  }

  const validResolutions = Object.values(Resolution);
  const invalidResolution = resolutions.find(
    (resolution) => !validResolutions.includes(resolution),
  );
  if (invalidResolution) {
    return {
      message: `${VIDEO_KEYS.availableResolutions} contains invalid values`,
      field: VIDEO_KEYS.availableResolutions,
    };
  }

  return null;
};

const validateCanBeDownloaded = (
  value: boolean | undefined,
  required = false,
): FieldError | null => {
  if (required && value === undefined) {
    return {
      message: `${VIDEO_KEYS.canBeDownloaded} is required`,
      field: VIDEO_KEYS.canBeDownloaded,
    };
  }

  if (value !== undefined && typeof value !== 'boolean') {
    return {
      message: `${VIDEO_KEYS.canBeDownloaded} must be a boolean`,
      field: VIDEO_KEYS.canBeDownloaded,
    };
  }

  return null;
};

const validateMinAgeRestriction = (
  value: number | null | undefined,
  required = false,
): FieldError | null => {
  if (required && value === undefined) {
    return {
      message: `${VIDEO_KEYS.minAgeRestriction} is required`,
      field: VIDEO_KEYS.minAgeRestriction,
    };
  }

  if (value === undefined || value === null) {
    return null;
  }

  if (!Number.isInteger(value) || value < 1 || value > 18) {
    return {
      message: `${VIDEO_KEYS.minAgeRestriction} must be a number between 1 and 18`,
      field: VIDEO_KEYS.minAgeRestriction,
    };
  }

  return null;
};

const validatePublicationDate = (date: string): FieldError | null => {
  if (!date) {
    return {
      message: `${VIDEO_KEYS.publicationDate} is required`,
      field: VIDEO_KEYS.publicationDate,
    };
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  if (typeof date !== 'string' || !isoDateRegex.test(date)) {
    return {
      message: `${VIDEO_KEYS.publicationDate} must be an ISO date string`,
      field: VIDEO_KEYS.publicationDate,
    };
  }

  return null;
};

export const validateCreateVideo = (body: CreateVideoDto): FieldError[] => {
  const errors = [
    validateTitle(body.title),
    validateAuthor(body.author),
    validateResolutions(body.availableResolutions),
    validateCanBeDownloaded(body.canBeDownloaded),
    validateMinAgeRestriction(body.minAgeRestriction),
  ];

  const filteredErrors = errors.filter(
    (error): error is FieldError => error !== null,
  );
  return filteredErrors;
};

export const validateUpdateVideo = (body: UpdateVideoDto): FieldError[] => {
  const errors = [
    validateTitle(body.title),
    validateAuthor(body.author),
    validateResolutions(body.availableResolutions),
    validateCanBeDownloaded(body.canBeDownloaded, true),
    validateMinAgeRestriction(body.minAgeRestriction, true),
    validatePublicationDate(body.publicationDate),
  ];

  const filteredErrors = errors.filter(
    (error): error is FieldError => error !== null,
  );
  return filteredErrors;
};
