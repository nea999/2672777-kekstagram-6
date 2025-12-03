import { photos } from './photos.js';
import { openBigPicture } from './big-picture.js';

// Экспортируем photos для использования в других модулях
export { photos };

// Код для работы с миниатюрами (если он у вас уже есть)
// Например, если у вас есть функция renderThumbnails:

const pictureContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

// Функция для создания миниатюры
const createThumbnail = (photo) => {
  const thumbnail = pictureTemplate.cloneNode(true);

  thumbnail.querySelector('.picture__img').src = photo.url;
  thumbnail.querySelector('.picture__img').alt = photo.description;
  thumbnail.querySelector('.picture__likes').textContent = photo.likes;
  thumbnail.querySelector('.picture__comments').textContent = photo.comments.length;

  // Добавляем обработчик клика
  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(photo.id);
  });

  return thumbnail;
};

// Функция для отрисовки всех миниатюр
const renderThumbnails = () => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = createThumbnail(photo);
    fragment.appendChild(thumbnail);
  });

  // Очищаем контейнер и добавляем миниатюры
  const existingPictures = pictureContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  pictureContainer.appendChild(fragment);
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  renderThumbnails();
});
