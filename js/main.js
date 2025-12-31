import { openBigPicture, setPhotos } from './big-picture.js';
import { initForm, enableUploadListener, bindScaleAndEffects, handleFormSubmit } from './upload-form.js';
import { getPhotos } from './api.js';
import { renderThumbnails } from './pictures.js';
import { initFilters } from './filters.js';
import { showNotification } from './util.js';

const pictureContainer = document.querySelector('.pictures');


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

getPhotos()
  .then((photos) => {
    setPhotos(photos);
    renderThumbnails(photos);
    initFilters(photos);
  })
  .catch((err) => {
    showNotification(err.message);
  });

if (pictureContainer) {
  pictureContainer.addEventListener('click', (evt) => {
    const picture = evt.target.closest('.picture');
    if (!picture) {
      return;
    }

    evt.preventDefault();
    const photoId = Number(picture.dataset.id);
    openBigPicture(photoId);
  });
}
