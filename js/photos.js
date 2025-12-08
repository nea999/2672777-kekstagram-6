import {
  DESCRIPTIONS,
  MIN_LIKES,
  MAX_LIKES,
  PHOTOS_COUNT
} from './data.js';
import { getRandomInteger, getRandomArrayElement } from './util.js';
import { generateComments } from './generators.js';

export const generatePhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: generateComments()
});

export const generatePhotos = () =>
  Array.from({ length: PHOTOS_COUNT }, (_, index) => generatePhoto(index + 1));

export const photos = generatePhotos();
