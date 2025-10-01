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


//для генерации случайного числа в диапазоне
const getRandomInteger = (min, max) => {
  const result = Math.random() * (max - min + 1) + min;
  return Math.floor(result);
};

// получение случайного элемента массива
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

//генерация уникального идентификатора
const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const generateCommentId = createIdGenerator();

// для генерации комментария
const generateComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

//для массива комментариев
const generateComments = () => {
  const commentsCount = getRandomInteger(0, 30);
  return Array.from({ length: commentsCount }, generateComment);
};

//для генерации объекта фото
const generatePhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(15, 200),
  comments: generateComments()
});

//генерация массива фотографий
const generatePhotos = () => Array.from({ length: 25 }, (_, index) => generatePhoto(index + 1));
const photos = generatePhotos();
