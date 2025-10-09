const MIN_AVATAR = 1;
const MAX_AVATAR = 6;
const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 30;
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const PHOTOS_COUNT = 25;

const DESCRIPTIONS = [
  'Прекрасный закат на море',
  'Горный пейзаж в утреннем тумане',
  'Улочки старого города',
  'Кофе в уютном кафе',
  'Прогулка по лесу',
  'Архитектура современного мегаполиса',
  'Мой пушистый друг',
  'Вкусный ужин',
  'Путешествие по новым местам',
  'Отдых на природе'
];

//дата для генерации это оно так скопировалось с выделениями символов..
const MESSAGES = [ 'Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];


const NAMES = ['Артём', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Елена', 'Алексей',
  'Ольга', 'Иван', 'Наталья'];


const getRandomInteger = (min, max) => {
  const result = Math.random() * (max - min + 1) + min;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const generateCommentId = createIdGenerator();

const generateComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(MIN_AVATAR, MAX_AVATAR)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const generateComments = () => {
  const commentsCount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);
  return Array.from({ length: commentsCount }, generateComment);
};

const generatePhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: generateComments()
});

const generatePhotos = () => Array.from({ length: PHOTOS_COUNT }, (_, index) => generatePhoto(index + 1));

const photos = generatePhotos();
export { photos };

