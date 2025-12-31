import { sendData } from './api.js';
import { findElement, findAllElements, isEscapeKey } from './util.js';
import { showSuccessMessage, showErrorMessage } from './form-messages.js';
import { initValidation } from './form-validation.js';

const UPLOAD_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';
const OVERLAY_HIDDEN_CLASS = 'hidden';
const BODY_MODAL_CLASS = 'modal-open';

const DEFAULT_SELECTORS = {
  form: '.img-upload__form',
  fileInput: '.img-upload__input',
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
  hashtags: '.text__hashtags',
  description: '.text__description',
  scaleSmaller: '.scale__control--smaller',
  scaleBigger: '.scale__control--bigger',
  scaleValue: '.scale__control--value'
};

const EFFECTS = {
  none: { slider: null, apply: () => '' },
  chrome: { slider: { min: 0, max: 1, step: 0.1, start: 1 }, apply: (value) => `grayscale(${value})` },
  sepia: { slider: { min: 0, max: 1, step: 0.1, start: 1 }, apply: (value) => `sepia(${value})` },
  marvin: { slider: { min: 0, max: 100, step: 1, start: 100 }, apply: (value) => `invert(${value}%)` },
  phobos: { slider: { min: 0, max: 3, step: 0.1, start: 3 }, apply: (value) => `blur(${value}px)` },
  heat: { slider: { min: 1, max: 3, step: 0.1, start: 3 }, apply: (value) => `brightness(${value})` }
};

const state = {
  inited: false,
  selectors: Object.assign({}, DEFAULT_SELECTORS),
  form: null,
  fileInput: null,
  overlay: null,
  cancelBtn: null,
  submitBtn: null,
  previewContainer: null,
  previewImage: null,
  effectsList: null,
  effectsPreviewNodes: [],
  effectLevelContainer: null,
  effectSliderNode: null,
  effectValueInput: null,
  scaleSmaller: null,
  scaleBigger: null,
  scaleValueNode: null,
  pristine: null,
  noUiSliderInstance: null,
  currentEffect: 'none',
  defaultPreviewSrc: ''
};

function initForm(options = {}) {
  if (state.inited) {
    return state;
  }

  state.selectors = Object.assign({}, DEFAULT_SELECTORS, options);
  const selectors = state.selectors;
  const form = findElement(selectors.form);

  if (!form) {
    state.inited = true;
    return state;
  }

  state.form = form;
  state.fileInput = form.querySelector(selectors.fileInput) || findElement(selectors.fileInput);
  state.overlay = form.querySelector(selectors.overlay) || findElement(selectors.overlay);
  state.cancelBtn = form.querySelector(selectors.cancelBtn) || findElement(selectors.cancelBtn);
  state.submitBtn = form.querySelector(selectors.submitBtn) || findElement(selectors.submitBtn);
  state.previewContainer = form.querySelector(selectors.previewContainer) || findElement(selectors.previewContainer);
  state.previewImage = form.querySelector(selectors.previewImage) || findElement(selectors.previewImage);
  state.effectsList = form.querySelector(selectors.effectsList) || findElement(selectors.effectsList);
  state.effectsPreviewNodes = findAllElements(selectors.effectsPreview, form);
  state.effectLevelContainer = form.querySelector(selectors.effectLevelContainer) || findElement(selectors.effectLevelContainer);
  state.effectSliderNode = form.querySelector(selectors.effectSliderNode) || findElement(selectors.effectSliderNode);
  state.effectValueInput = form.querySelector(selectors.effectValueInput) || findElement(selectors.effectValueInput);
  state.scaleSmaller = form.querySelector(selectors.scaleSmaller) || findElement(selectors.scaleSmaller);
  state.scaleBigger = form.querySelector(selectors.scaleBigger) || findElement(selectors.scaleBigger);
  state.scaleValueNode = form.querySelector(selectors.scaleValue) || findElement(selectors.scaleValue);

  if (state.previewImage && !state.defaultPreviewSrc) {
    state.defaultPreviewSrc = state.previewImage.src;
  }

  if (state.scaleValueNode) {
    state.scaleValueNode.setAttribute('readonly', true);
  }

  if (!state.form.getAttribute('action')) {
    state.form.setAttribute('action', UPLOAD_URL);
  }
  if (!state.form.getAttribute('method')) {
    state.form.setAttribute('method', 'post');
  }
  if (!state.form.getAttribute('enctype')) {
    state.form.setAttribute('enctype', 'multipart/form-data');
  }

  state.pristine = initValidation(state.form, state.selectors);

  const hashtagsNode = findElement(state.selectors.hashtags, state.form) || findElement(state.selectors.hashtags);
  const descriptionNode = findElement(state.selectors.description, state.form) || findElement(state.selectors.description);

  if (hashtagsNode) {
    hashtagsNode.addEventListener('keydown', (evt) => {
      if (isEscapeKey(evt)) {
        evt.stopPropagation();
      }
    });
  }

  if (descriptionNode) {
    descriptionNode.addEventListener('keydown', (evt) => {
      if (isEscapeKey(evt)) {
        evt.stopPropagation();
      }
    });
  }

  let defaultScale = 100;
  if (state.scaleValueNode && state.scaleValueNode.value) {
    const parsedScale = parseInt(state.scaleValueNode.value, 10);
    if (!Number.isNaN(parsedScale)) {
      defaultScale = parsedScale;
    }
  }
  applyScale(defaultScale);

  if (state.effectLevelContainer) {
    state.effectLevelContainer.style.display = 'none';
  }

  state.inited = true;
  return state;
}

function openForm() {
  if (!state.inited || !state.overlay) {
    return;
  }
  state.overlay.classList.remove(OVERLAY_HIDDEN_CLASS);
  document.body.classList.add(BODY_MODAL_CLASS);
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeForm() {
  if (!state.inited || !state.overlay || !state.form) {
    return;
  }

  state.overlay.classList.add(OVERLAY_HIDDEN_CLASS);
  document.body.classList.remove(BODY_MODAL_CLASS);

  try {
    state.form.reset();
  } catch (error) {
    // ignore
  }

  if (state.pristine) {
    try {
      state.pristine.reset();
    } catch (error) {
      // ignore
    }
  }

  if (state.noUiSliderInstance && state.effectSliderNode && state.noUiSliderInstance.destroy) {
    try {
      state.noUiSliderInstance.destroy();
    } catch (error) {
      // ignore
    }
    state.noUiSliderInstance = null;
  }

  clearPreviewFilter();
  state.currentEffect = 'none';
  applyScale(100);

  if (state.effectLevelContainer) {
    state.effectLevelContainer.style.display = 'none';
  }

  if (state.previewImage && state.defaultPreviewSrc) {
    state.previewImage.src = state.defaultPreviewSrc;
  }

  if (state.effectsPreviewNodes && state.effectsPreviewNodes.length) {
    state.effectsPreviewNodes.forEach((effectNode) => {
      effectNode.style.backgroundImage = '';
    });
  }

  if (state.fileInput) {
    try {
      state.fileInput.value = '';
    } catch (error) {
      // ignore
    }
  }

  document.removeEventListener('keydown', onDocumentKeydown);
  document.body.style.overflow = '';
}

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    const hashtagsNodeLocal = findElement(state.selectors.hashtags, state.form) || findElement(state.selectors.hashtags);
    const descriptionNodeLocal = findElement(state.selectors.description, state.form) || findElement(state.selectors.description);

    if (document.activeElement === hashtagsNodeLocal || document.activeElement === descriptionNodeLocal) {
      return;
    }

    evt.preventDefault();
    closeForm();
  }
}

function applyScale(percent) {
  const scale = percent / 100;
  const image = state.previewImage || (state.previewContainer && state.previewContainer.querySelector('img'));

  if (image) {
    image.style.transform = `scale(${scale})`;
  }

  if (state.scaleValueNode) {
    state.scaleValueNode.value = `${percent}%`;
  }
}

function bindScaleControls() {
  if (!state.scaleSmaller || !state.scaleBigger || !state.scaleValueNode) {
    return;
  }

  const STEP = 25;
  const MIN = 25;
  const MAX = 100;

  state.scaleSmaller.addEventListener('click', (evt) => {
    evt.preventDefault();
    const currentScale = parseInt(state.scaleValueNode.value, 10) || 100;
    const nextScale = Math.max(MIN, currentScale - STEP);
    applyScale(nextScale);
  });

  state.scaleBigger.addEventListener('click', (evt) => {
    evt.preventDefault();
    const currentScale = parseInt(state.scaleValueNode.value, 10) || 100;
    const nextScale = Math.min(MAX, currentScale + STEP);
    applyScale(nextScale);
  });
}

function clearPreviewFilter() {
  const image = state.previewImage || (state.previewContainer && state.previewContainer.querySelector('img'));
  if (image) {
    image.style.filter = '';
  }
}

function applyFilterToPreview(filterString) {
  const image = state.previewImage || (state.previewContainer && state.previewContainer.querySelector('img'));
  if (image) {
    image.style.filter = filterString;
  }
}

function onEffectChange(evt) {
  const target = evt.target;
  if (!target) {
    return;
  }

  const value = target.value || target.getAttribute('value') || 'none';
  const effect = (value in EFFECTS) ? value : 'none';
  state.currentEffect = effect;

  if (state.noUiSliderInstance && state.effectSliderNode && state.noUiSliderInstance.destroy) {
    try {
      state.noUiSliderInstance.destroy();
    } catch (error) {
      // ignore
    }
    state.noUiSliderInstance = null;
  }

  const effectConfig = EFFECTS[effect];

  if (!effectConfig.slider) {
    if (state.effectLevelContainer) {
      state.effectLevelContainer.style.display = 'none';
    }
    applyFilterToPreview('');
    if (state.effectValueInput) {
      state.effectValueInput.value = '';
    }
    return;
  }

  if (state.effectLevelContainer) {
    state.effectLevelContainer.style.display = '';
  }

  if (typeof noUiSlider === 'undefined') {
    const start = effectConfig.slider.start;
    applyFilterToPreview(effectConfig.apply(start));
    if (state.effectValueInput) {
      state.effectValueInput.value = String(start);
    }
    return;
  }

  noUiSlider.create(state.effectSliderNode, {
    start: effectConfig.slider.start,
    step: effectConfig.slider.step,
    range: { min: effectConfig.slider.min, max: effectConfig.slider.max },
    connect: 'lower'
  });

  state.noUiSliderInstance = state.effectSliderNode.noUiSlider;
  state.noUiSliderInstance.set(effectConfig.slider.start);

  if (state.effectValueInput) {
    state.effectValueInput.value = String(effectConfig.slider.start);
  }

  state.noUiSliderInstance.on('update', (values) => {
    const valueString = values[0];
    const parsedValue = (effectConfig.slider.step >= 1) ? Math.round(Number(valueString)) : Number(valueString);
    applyFilterToPreview(effectConfig.apply(parsedValue));
    if (state.effectValueInput) {
      state.effectValueInput.value = String(parsedValue);
    }
  });
}

function bindEffectsList() {
  if (!state.effectsList) {
    return;
  }

  state.effectsList.addEventListener('change', onEffectChange);
  const noneRadio = state.effectsList.querySelector('input[value="none"]') || state.effectsList.querySelector('input');

  if (noneRadio) {
    noneRadio.checked = true;
    noneRadio.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    if (state.effectLevelContainer) {
      state.effectLevelContainer.style.display = 'none';
    }
  }
}

function enableUploadListener() {
  if (!state.inited) {
    return;
  }

  if (!state.fileInput) {
    return;
  }

  state.fileInput.addEventListener('change', () => {
    const file = state.fileInput.files && state.fileInput.files[0];

    if (file) {
      const objectUrl = URL.createObjectURL(file);

      const previewImage = state.previewImage || document.querySelector('.img-upload__preview img');
      const effectsPreviewNodes = (state.effectsPreviewNodes && state.effectsPreviewNodes.length)
        ? state.effectsPreviewNodes
        : Array.from(document.querySelectorAll('.effects__preview'));

      if (previewImage) {
        previewImage.src = objectUrl;
      }

      effectsPreviewNodes.forEach((effectNode) => {
        effectNode.style.backgroundImage = `url(${objectUrl})`;
      });
    }

    openForm();
  });

  if (state.cancelBtn) {
    state.cancelBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      closeForm();
    });
  }
}

function bindScaleAndEffects() {
  bindScaleControls();
  bindEffectsList();
}

function handleFormSubmit() {
  if (!state.inited) {
    return;
  }

  if (!state.form) {
    return;
  }

  state.form.removeEventListener('submit', onFormSubmit);
  state.form.addEventListener('submit', onFormSubmit);
}

async function onFormSubmit(evt) {
  evt.preventDefault();

  let valid = true;
  if (state.pristine) {
    try {
      valid = state.pristine.validate();
    } catch (error) {
      valid = true;
    }
  }

  if (!valid) {
    return;
  }

  const formData = new FormData(state.form);

  if (state.submitBtn) {
    state.submitBtn.disabled = true;
    if (!state.submitBtn.dataset._origText) {
      state.submitBtn.dataset._origText = state.submitBtn.textContent || '';
    }
    state.submitBtn.textContent = 'Отправка...';
  }

  try {
    await sendData(formData);
    closeForm();
    showSuccessMessage();
  } catch (err) {
    showErrorMessage(
      () => document.removeEventListener('keydown', onDocumentKeydown),
      () => document.addEventListener('keydown', onDocumentKeydown)
    );
  } finally {
    if (state.submitBtn) {
      state.submitBtn.disabled = false;
      state.submitBtn.textContent = state.submitBtn.dataset._origText || 'Опубликовать';
    }
  }
}

export {
  initForm,
  enableUploadListener,
  bindScaleAndEffects,
  handleFormSubmit,
  openForm,
  closeForm
};
