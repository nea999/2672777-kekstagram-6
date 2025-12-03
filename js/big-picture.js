import { photos } from './main.js';

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

// Функция для отрисовки комментариев
const renderComments = (comments) => {
  socialComments.innerHTML = '';

  comments.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');

    commentElement.innerHTML = `
      <img
        class="social__picture"
        src="${comment.avatar}"
        alt="${comment.name}"
        width="35" height="35">
      <p class="social__text">${comment.message}</p>
    `;

    socialComments.appendChild(commentElement);
  });
};

// Функция для открытия полноразмерного изображения
const openBigPicture = (photoId) => {
  // Находим фотографию по ID
  const photo = photos.find((item) => item.id === photoId);

  if (!photo) {
    return;
  }

  // Заполняем данные
  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description;
  likesCount.textContent = photo.likes;
  commentsCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description;

  // Отрисовываем комментарии
  renderComments(photo.comments);

  // Скрываем блоки загрузки комментариев
  commentsLoader.classList.add('hidden');
  socialCommentCount.classList.add('hidden');

  // Показываем модальное окно
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

// Функция для закрытия полноразмерного изображения
const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

// Обработчики событий
closeButton.addEventListener('click', () => {
  closeBigPicture();
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeBigPicture();
  }
});

// Экспортируем функцию для открытия
export { openBigPicture };
