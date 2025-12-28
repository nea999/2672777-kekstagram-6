import { openBigPicture, setPhotos } from './big-picture.js';
import { initForm, enableUploadListener, bindScaleAndEffects, handleFormSubmit } from './upload-form.js';
import { getPhotos } from './api.js';
import { renderThumbnails } from './pictures.js';
import { initFilters } from './filters.js';

const pictureContainer = document.querySelector('.pictures');

const showDataLoadError = (message) => {
  const node = document.createElement('div');
  node.classList.add('data-error');
  node.style.zIndex = '100';
  node.style.position = 'fixed';
  node.style.left = '0';
  node.style.top = '0';
  node.style.right = '0';
  node.style.padding = '10px 3px';
  node.style.fontSize = '20px';
  node.style.textAlign = 'center';
  node.style.backgroundColor = 'red';
  node.style.color = 'white';

  node.textContent = message;

  document.body.append(node);

  setTimeout(() => {
    node.remove();
  }, 5000);
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

  getPhotos()
    .then((photos) => {
      setPhotos(photos);
      renderThumbnails(photos);
      initFilters(photos);
    })
    .catch(() => {
      showDataLoadError('Не удалось загрузить данные. Попробуйте обновить страницу позже.');
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
});
