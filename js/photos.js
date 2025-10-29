import {
  DESCRIPTIONS,
  MIN_LIKES,
  MAX_LIKES,
  PHOTOS_COUNT
} from './data.js';
import { getRandomInteger, getRandomArrayElement } from './util.js';
import { generateComments } from './generators.js';

// Генерация одной фотографии
export const generatePhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: generateComments()
});

// Генерация массива фотографий
export const generatePhotos = () =>
  Array.from({ length: PHOTOS_COUNT }, (_, index) => generatePhoto(index + 1));

// Экспорт сгенерированных фотографий
export const photos = generatePhotos();
