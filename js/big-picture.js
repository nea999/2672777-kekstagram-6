import { isEscapeKey } from './util.js';

let photos = [];

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const commentsBatchSize = 5;
let currentPhoto = null;
let shownCommentsCount = 0;

const setPhotos = (newPhotos) => {
  photos = Array.isArray(newPhotos) ? newPhotos.slice() : [];
};

const createCommentElement = ({ avatar, message, name }) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarElement = document.createElement('img');
  avatarElement.classList.add('social__picture');
  avatarElement.src = avatar;
  avatarElement.alt = name;
  avatarElement.width = 35;
  avatarElement.height = 35;

  const textElement = document.createElement('p');
  textElement.classList.add('social__text');
  textElement.textContent = message;

  commentElement.appendChild(avatarElement);
  commentElement.appendChild(textElement);

  return commentElement;
};

const renderComments = () => {
  const comments = currentPhoto.comments;
  const commentsToShow = Math.min(shownCommentsCount + commentsBatchSize, comments.length);

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
  commentsLoader.removeEventListener('click', onLoadMoreClick);
  commentsLoader.addEventListener('click', onLoadMoreClick);
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

const openBigPicture = (photoId) => {
  const numericId = Number(photoId);
  currentPhoto = photos.find((photo) => photo.id === numericId);

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

  document.addEventListener('keydown', onDocumentKeydown);
};

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';

  commentsLoader.removeEventListener('click', onLoadMoreClick);
  document.removeEventListener('keydown', onDocumentKeydown);
}

closeButton.addEventListener('click', () => {
  closeBigPicture();
});

export {
  openBigPicture,
  setPhotos
};
