import { isEscapeKey } from './util.js';

let photos = [];
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const commentsBatchSize = 5;
let currentPhoto = null;
let shownCommentsCount = 0;
let shownCountElement = socialCommentCount.querySelector('.social__comment-shown-count');
let totalCountElement = socialCommentCount.querySelector('.social__comment-total-count');

if (!shownCountElement || !totalCountElement) {
  shownCountElement = document.createElement('span');
  shownCountElement.classList.add('social__comment-shown-count');
  shownCountElement.textContent = '0';

  totalCountElement = document.createElement('span');
  totalCountElement.classList.add('social__comment-total-count');
  totalCountElement.textContent = '0';

  socialCommentCount.textContent = '';
  socialCommentCount.append(
    shownCountElement,
    ' из ',
    totalCountElement,
    ' комментариев'
  );
}


const updateCommentsCounter = () => {
  if (!currentPhoto) {
    shownCountElement.textContent = '0';
    totalCountElement.textContent = '0';
    return;
  }

  shownCountElement.textContent = String(shownCommentsCount);
  totalCountElement.textContent = String(currentPhoto.comments.length);
};

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
  if (!currentPhoto) {
    return;
  }

  const comments = currentPhoto.comments;
  const commentsToShow = Math.min(shownCommentsCount + commentsBatchSize, comments.length);

  for (let i = shownCommentsCount; i < commentsToShow; i++) {
    const commentElement = createCommentElement(comments[i]);
    socialComments.appendChild(commentElement);
  }

  shownCommentsCount = commentsToShow;

  updateCommentsCounter();

  if (commentsLoader) {
    commentsLoader.classList.toggle('hidden', shownCommentsCount >= comments.length);
  }
};

const onLoadMoreClick = (evt) => {
  evt.preventDefault();
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
