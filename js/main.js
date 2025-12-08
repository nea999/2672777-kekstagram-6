import { photos } from './photos.js';
import { openBigPicture } from './big-picture.js';
import { initForm, enableUploadListener, bindScaleAndEffects,  handleFormSubmit } from './form.js';

export { photos };

const pictureContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const createThumbnail = (photo) => {
  const thumbnail = pictureTemplate.cloneNode(true);

  thumbnail.querySelector('.picture__img').src = photo.url;
  thumbnail.querySelector('.picture__img').alt = photo.description;
  thumbnail.querySelector('.picture__likes').textContent = photo.likes;
  thumbnail.querySelector('.picture__comments').textContent = photo.comments.length;

  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(photo.id);
  });

  return thumbnail;
};

const renderThumbnails = () => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = createThumbnail(photo);
    fragment.appendChild(thumbnail);
  });


  const existingPictures = pictureContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  pictureContainer.appendChild(fragment);
};


document.addEventListener('DOMContentLoaded', () => {
  initForm({
    form: '.img-upload__form',
    fileInput: '#upload-file',
    overlay: '.img-upload__overlay',
    cancelBtn: '#upload-cancel',
    submitBtn: '#upload-submit',
    previewContainer: '.img-upload__preview',
    previewImage: '.img-upload__preview img',
    effectsList: '.effects__list',
    effectsPreview: '.effects__preview',
    effectLevelContainer: '.img-upload__effect-level',
    effectSliderNode: '.effect-level__slider',
    effectValueInput: '.effect-level__value',
    scaleSmaller: '.scale__control--smaller',
    scaleBigger: '.scale__control--bigger',
    scaleValue: '.scale__control--value',
    hashtags: '.text__hashtags',
    description: '.text__description'
  });

  enableUploadListener();
  bindScaleAndEffects();
  handleFormSubmit();

  renderThumbnails();
});
