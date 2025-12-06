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
const COMMENTS_PLUS = 5;
let currentPhoto = null;
let shownCommentsCount = 0;

const createCommentElement = ({ avatar, message, name }) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${avatar}"
      alt="${name}"
      width="35" height="35">
    <p class="social__text">${message}</p>
  `;
  return commentElement;
};


const renderComments = () => {
  const comments = currentPhoto.comments;
  const commentsToShow = Math.min(shownCommentsCount + COMMENTS_PLUS, comments.length);

  for (let i = shownCommentsCount; i < commentsToShow; i++) {
    const commentElement = createCommentElement(comments[i]);
    socialComments.appendChild(commentElement);
  }

  shownCommentsCount = commentsToShow;

  socialCommentCount.innerHTML =
    `${shownCommentsCount} из <span class="comments-count">${comments.length}</span> комментариев`;

  commentsLoader.classList.toggle('hidden', shownCommentsCount >= comments.length);
};

const onLoadMoreClick = () => {
  renderComments();
};

const resetComments = () => {
  socialComments.innerHTML = '';
  shownCommentsCount = 0;
  commentsLoader.classList.remove('hidden');
  commentsLoader.addEventListener('click', onLoadMoreClick);
};

const openBigPicture = (photoId) => {
  currentPhoto = photos.find((photo) => photo.id === photoId);
  if (!currentPhoto) {
    return;
  }

  bigPictureImg.src = currentPhoto.url;
  bigPictureImg.alt = currentPhoto.description;
  likesCount.textContent = currentPhoto.likes;
  commentsCount.textContent = currentPhoto.comments.length;
  socialCaption.textContent = currentPhoto.description;

  resetComments();
  renderComments();

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.body.style.overflow = 'hidden';
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';

  commentsLoader.removeEventListener('click', onLoadMoreClick);
};

closeButton.addEventListener('click', () => {
  closeBigPicture();
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeBigPicture();
  }
});

export { openBigPicture };
