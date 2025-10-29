import {
  MIN_AVATAR,
  MAX_AVATAR,
  MIN_COMMENTS_COUNT,
  MAX_COMMENTS_COUNT,
  MESSAGES,
  NAMES
} from './data.js';
import { getRandomInteger, getRandomArrayElement, createIdGenerator } from './util.js';

const generateCommentId = createIdGenerator();

export const generateComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(MIN_AVATAR, MAX_AVATAR)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

export const generateComments = () => {
  const commentsCount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);
  return Array.from({ length: commentsCount }, generateComment);
};
