// form.js
// ES module: экспортирует initForm, enableUploadListener, bindScaleAndEffects, handleFormSubmit, openForm, closeForm

const UPLOAD_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';
const OVERLAY_HIDDEN_CLASS = 'hidden';
const BODY_MODAL_CLASS = 'modal-open';

const DEFAULT_SELECTORS = {
  form: '.img-upload__form',
  fileInput: '.img-upload__input',            // #upload-file / .img-upload__input
  overlay: '.img-upload__overlay',
  cancelBtn: '#upload-cancel',                // в HTML id="upload-cancel"
  submitBtn: '#upload-submit',                // id submit
  previewContainer: '.img-upload__preview',
  previewImage: '.img-upload__preview img',   // <img> внутри превью
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

// эффекты — параметры слайдера и функция формирования CSS
const EFFECTS = {
  none:  { slider: null, apply: () => '' },
  chrome:{ slider: {min:0, max:1, step:0.1, start:1}, apply: (v)=>`grayscale(${v})` },
  sepia: { slider: {min:0, max:1, step:0.1, start:1}, apply: (v)=>`sepia(${v})` },
  marvin:{ slider: {min:0, max:100, step:1, start:100}, apply:(v)=>`invert(${v}%)` },
  phobos:{ slider: {min:0, max:3, step:0.1, start:3}, apply:(v)=>`blur(${v}px)` },
  heat:  { slider: {min:1, max:3, step:0.1, start:3}, apply:(v)=>`brightness(${v})` }
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
  currentEffect: 'none'
};

function $(sel, root = document) {
  try { return root.querySelector(sel); } catch (e) { return null; }
}
function $all(sel, root = document) {
  try { return Array.from(root.querySelectorAll(sel)); } catch (e) { return []; }
}


function initForm(options = {}) {
  if (state.inited) return state;
  state.selectors = Object.assign({}, DEFAULT_SELECTORS, options);

  const s = state.selectors;
  const form = $(s.form);
  if (!form) {
    console.warn('form.js: форма не найдена по селектору', s.form);
    state.inited = true;
    return state;
  }

  state.form = form;
  state.fileInput = form.querySelector(s.fileInput) || $(s.fileInput);
  state.overlay = form.querySelector(s.overlay) || $(s.overlay);
  state.cancelBtn = form.querySelector(s.cancelBtn) || $(s.cancelBtn);
  state.submitBtn = form.querySelector(s.submitBtn) || $(s.submitBtn);
  state.previewContainer = form.querySelector(s.previewContainer) || $(s.previewContainer);
  state.previewImage = form.querySelector(s.previewImage) || $(s.previewImage);
  state.effectsList = form.querySelector(s.effectsList) || $(s.effectsList);
  state.effectsPreviewNodes = $all(s.effectsPreview, form);
  state.effectLevelContainer = form.querySelector(s.effectLevelContainer) || $(s.effectLevelContainer);
  state.effectSliderNode = form.querySelector(s.effectSliderNode) || $(s.effectSliderNode);
  state.effectValueInput = form.querySelector(s.effectValueInput) || $(s.effectValueInput);
  state.scaleSmaller = form.querySelector(s.scaleSmaller) || $(s.scaleSmaller);
  state.scaleBigger = form.querySelector(s.scaleBigger) || $(s.scaleBigger);
  state.scaleValueNode = form.querySelector(s.scaleValue) || $(s.scaleValue);

  // ensure form attributes are present (per assignment)
  if (!state.form.getAttribute('action')) state.form.setAttribute('action', UPLOAD_URL);
  if (!state.form.getAttribute('method')) state.form.setAttribute('method', 'post');
  if (!state.form.getAttribute('enctype')) state.form.setAttribute('enctype', 'multipart/form-data');

  // Pristine (если подключён)
  if (typeof Pristine !== 'undefined') {
    try {
      state.pristine = new Pristine(state.form, {
        classTo: 'img-upload__field-wrapper',
        errorTextParent: 'img-upload__field-wrapper',
        errorTextClass: 'img-upload__error'
      }, true);

      // валидация хэштегов и комментария
      const hashtagsNode = $(state.selectors.hashtags, state.form) || $(state.selectors.hashtags);
      const descriptionNode = $(state.selectors.description, state.form) || $(state.selectors.description);
      if (state.pristine && hashtagsNode) {
        const parse = v => (!v ? [] : v.trim().split(/\s+/).filter(Boolean));
        const regex = /^#[\p{L}\p{N}]{1,19}$/u;
        state.pristine.addValidator(hashtagsNode, v => parse(v).every(t=>regex.test(t)), 'Неверный формат хэш-тега');
        state.pristine.addValidator(hashtagsNode, v => parse(v).length <= 5, 'Нельзя указать больше 5 хэш-тегов');
        state.pristine.addValidator(hashtagsNode, v => {
          const arr = parse(v).map(t=>t.toLowerCase());
          return new Set(arr).size === arr.length;
        }, 'Хэш-теги не должны повторяться');
      }
      if (state.pristine && descriptionNode) {
        state.pristine.addValidator(descriptionNode, v => !v || v.length <= 140, 'Комментарий не может быть длиннее 140 символов');
      }
    } catch (e) {
      console.warn('form.js: ошибка Pristine', e);
      state.pristine = null;
    }
  } else {
    state.pristine = null;
    console.warn('form.js: Pristine не найден. Подключите vendor/pristine/pristine.min.js для красивых сообщений об ошибках.');
  }


  const hashtagsNodeFlag = $(state.selectors.hashtags, state.form) || $(state.selectors.hashtags);
  const descriptionNodeFlag = $(state.selectors.description, state.form) || $(state.selectors.description);
  if (hashtagsNodeFlag) hashtagsNodeFlag.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Esc') e.stopPropagation(); });
  if (descriptionNodeFlag) descriptionNodeFlag.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Esc') e.stopPropagation(); });

  // default scale value: use existing value or 100%
  let defaultScale = 100;
  if (state.scaleValueNode && state.scaleValueNode.value) {
    const parsed = parseInt(state.scaleValueNode.value, 10);
    if (!Number.isNaN(parsed)) defaultScale = parsed;
  }
  applyScale(defaultScale);

  if (state.effectLevelContainer) state.effectLevelContainer.style.display = 'none';

  state.inited = true;
  return state;
}

function openForm() {
  if (!state.inited || !state.overlay) return;
  state.overlay.classList.remove(OVERLAY_HIDDEN_CLASS);
  document.body.classList.add(BODY_MODAL_CLASS);
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeForm() {
  if (!state.inited || !state.overlay || !state.form) return;
  state.overlay.classList.add(OVERLAY_HIDDEN_CLASS);
  document.body.classList.remove(BODY_MODAL_CLASS);

  try { state.form.reset(); } catch (e) {}
  if (state.pristine) { try { state.pristine.reset(); } catch (e) {} }

  if (state.noUiSliderInstance && state.effectSliderNode && state.noUiSliderInstance.destroy) {
    try { state.noUiSliderInstance.destroy(); } catch (e) {}
    state.noUiSliderInstance = null;
  }

  clearPreviewFilter();

  applyScale(100);

  if (state.fileInput) { try { state.fileInput.value = ''; } catch (e) {} }

  document.removeEventListener('keydown', onDocumentKeydown);
  document.body.style.overflow = '';
}

function onDocumentKeydown(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    const hashtagsNode = $(state.selectors.hashtags, state.form) || $(state.selectors.hashtags);
    const descriptionNode = $(state.selectors.description, state.form) || $(state.selectors.description);
    if (document.activeElement === hashtagsNode || document.activeElement === descriptionNode) return;
    e.preventDefault();
    closeForm();
  }
}

function applyScale(percent) {
  const scale = percent / 100;
  const img = state.previewImage || (state.previewContainer && state.previewContainer.querySelector('img'));
  if (img) img.style.transform = `scale(${scale})`;
  if (state.scaleValueNode) state.scaleValueNode.value = `${percent}%`;
}

function bindScaleControls() {
  if (!state.scaleSmaller || !state.scaleBigger || !state.scaleValueNode) return;
  const STEP = 25, MIN = 25, MAX = 100;
  state.scaleSmaller.addEventListener('click', (ev) => {
    ev.preventDefault();
    const cur = parseInt(state.scaleValueNode.value, 10) || 100;
    const next = Math.max(MIN, cur - STEP);
    applyScale(next);
  });
  state.scaleBigger.addEventListener('click', (ev) => {
    ev.preventDefault();
    const cur = parseInt(state.scaleValueNode.value, 10) || 100;
    const next = Math.min(MAX, cur + STEP);
    applyScale(next);
  });
}

function clearPreviewFilter() {
  const img = state.previewImage || (state.previewContainer && state.previewContainer.querySelector('img'));
  if (img) img.style.filter = '';
}

function applyFilterToPreview(filterStr) {
  const img = state.previewImage || (state.previewContainer && state.previewContainer.querySelector('img'));
  if (img) img.style.filter = filterStr;
}

function onEffectChange(evt) {
  const target = evt.target;
  if (!target) return;
  const value = target.value || target.getAttribute('value') || 'none';
  const effect = (value in EFFECTS) ? value : 'none';
  state.currentEffect = effect;

  if (state.noUiSliderInstance && state.effectSliderNode && state.noUiSliderInstance.destroy) {
    try { state.noUiSliderInstance.destroy(); } catch (e) {}
    state.noUiSliderInstance = null;
  }

  const cfg = EFFECTS[effect];

  if (!cfg.slider) {
    if (state.effectLevelContainer) state.effectLevelContainer.style.display = 'none';
    applyFilterToPreview('');
    if (state.effectValueInput) state.effectValueInput.value = '';
    return;
  }

  if (state.effectLevelContainer) state.effectLevelContainer.style.display = '';

  if (typeof noUiSlider === 'undefined') {
    console.warn('form.js: noUiSlider не найден — слайдер не будет работать');
    const start = cfg.slider.start;
    applyFilterToPreview(cfg.apply(start));
    if (state.effectValueInput) state.effectValueInput.value = String(start);
    return;
  }

  noUiSlider.create(state.effectSliderNode, {
    start: cfg.slider.start,
    step: cfg.slider.step,
    range: { min: cfg.slider.min, max: cfg.slider.max },
    connect: 'lower'
  });
  state.noUiSliderInstance = state.effectSliderNode.noUiSlider;

  state.noUiSliderInstance.set(cfg.slider.start);
  if (state.effectValueInput) state.effectValueInput.value = String(cfg.slider.start);

  state.noUiSliderInstance.on('update', (values) => {
    const raw = values[0];
    const parsed = (cfg.slider.step >= 1) ? Math.round(Number(raw)) : Number(raw);
    applyFilterToPreview(cfg.apply(parsed));
    if (state.effectValueInput) state.effectValueInput.value = String(parsed);
  });
}

function bindEffectsList() {
  if (!state.effectsList) return;
  state.effectsList.addEventListener('change', onEffectChange);

  const noneRadio = state.effectsList.querySelector('input[value="none"]') || state.effectsList.querySelector('input');
  if (noneRadio) {
    noneRadio.checked = true;
    noneRadio.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    if (state.effectLevelContainer) state.effectLevelContainer.style.display = 'none';
  }
}

function enableUploadListener() {
  if (!state.inited) {
    console.warn('form.js: вызови initForm() перед enableUploadListener()');
    return;
  }
  if (!state.fileInput) {
    console.warn('form.js: file input не найден');
    return;
  }

  state.fileInput.addEventListener('change', () => {
    openForm();
  });

  if (state.cancelBtn) {
    state.cancelBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      closeForm();
    });
  }
}

function bindScaleAndEffects() {
  bindScaleControls();
  bindScaleControls = bindScaleControls; // no-op to satisfy linter-like checks
  bindScaleControls(); // ensure bound
  bindEffectsList();
}

function handleFormSubmit() {
  if (!state.inited) {
    console.warn('form.js: вызови initForm() перед handleFormSubmit()');
    return;
  }
  if (!state.form) return;
  state.form.removeEventListener('submit', onFormSubmit);
  state.form.addEventListener('submit', onFormSubmit);
}

async function onFormSubmit(e) {
  e.preventDefault();

  let valid = true;
  if (state.pristine) {
    try { valid = state.pristine.validate(); } catch (err) { console.warn(err); valid = true; }
  } else {
    valid = true;
  }
  if (!valid) return;

  const fd = new FormData(state.form);

  if (state.submitBtn) {
    state.submitBtn.disabled = true;
    if (!state.submitBtn.dataset._origText) { state.submitBtn.dataset._origText = state.submitBtn.textContent || '';
    state.submitBtn.textContent = 'Отправка...';
  }

  try {
    const resp = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
    const text = await resp.text();
    document.open();
    document.write(text);
    document.close();
  } catch (err) {
    console.error('form.js: Ошибка отправки', err);
    alert('Ошибка при отправке формы. Попробуйте ещё раз.');
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
