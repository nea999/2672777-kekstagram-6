import { showNotification, isEscapeKey } from './util.js';

const SUCCESS_TEMPLATE_ID = '#success';
const ERROR_TEMPLATE_ID = '#error';
const MESSAGE_Z_INDEX = '110';

const showSuccessMessage = () => {
  const template = document.querySelector(SUCCESS_TEMPLATE_ID);

  if (!template) {
    showNotification('Изображение успешно загружено');
    return;
  }

  const successFragment = template.content.querySelector('.success');

  if (!successFragment) {
    showNotification('Изображение успешно загружено');
    return;
  }

  const successElement = successFragment.cloneNode(true);
  successElement.style.zIndex = MESSAGE_Z_INDEX;
  const successButton = successElement.querySelector('.success__button');
  const innerSelector = '.success__inner';

  const onSuccessEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeSuccessMessage();
    }
  };

  const onSuccessClick = (evt) => {
    if (evt.target === successButton || !evt.target.closest(innerSelector)) {
      closeSuccessMessage();
    }
  };

  function closeSuccessMessage() {
    successElement.removeEventListener('click', onSuccessClick);
    document.removeEventListener('keydown', onSuccessEscKeydown);
    successElement.remove();
  }

  successElement.addEventListener('click', onSuccessClick);
  document.addEventListener('keydown', onSuccessEscKeydown);
  document.body.appendChild(successElement);
};

const showErrorMessage = (disableFormEsc, enableFormEsc) => {
  const template = document.querySelector(ERROR_TEMPLATE_ID);

  if (!template) {
    showNotification('Ошибка при отправке формы. Попробуйте ещё раз.');
    return;
  }

  const errorFragment = template.content.querySelector('.error');

  if (!errorFragment) {
    showNotification('Ошибка при отправке формы. Попробуйте ещё раз.');
    return;
  }

  const errorElement = errorFragment.cloneNode(true);
  errorElement.style.zIndex = MESSAGE_Z_INDEX;
  const errorButton = errorElement.querySelector('.error__button');
  const innerSelector = '.error__inner';

  if (typeof disableFormEsc === 'function') {
    disableFormEsc();
  }

  const onErrorEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeErrorMessage();
    }
  };

  const onErrorClick = (evt) => {
    if (evt.target === errorButton || !evt.target.closest(innerSelector)) {
      closeErrorMessage();
    }
  };

  function closeErrorMessage() {
    errorElement.removeEventListener('click', onErrorClick);
    document.removeEventListener('keydown', onErrorEscKeydown);
    errorElement.remove();

    if (typeof enableFormEsc === 'function') {
      enableFormEsc();
    }
  }

  errorElement.addEventListener('click', onErrorClick);
  document.addEventListener('keydown', onErrorEscKeydown);
  document.body.appendChild(errorElement);
};

export {
  showSuccessMessage,
  showErrorMessage
};
