import { findElement } from './util.js';

const HASHTAG_MAX_COUNT = 5;
const COMMENT_MAX_LENGTH = 140;
const HASHTAG_REG_EXP = /^#[\p{L}\p{N}]{1,19}$/u;

const parseHashtags = (value) => (!value ? [] : value.trim().split(/\s+/).filter(Boolean));

const initValidation = (form, selectors) => {
  if (!form || !selectors || typeof Pristine === 'undefined') {
    return null;
  }

  try {
    const pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextClass: 'img-upload__error'
    }, true);

    const hashtagsNode = findElement(selectors.hashtags, form) || findElement(selectors.hashtags);
    const descriptionNode = findElement(selectors.description, form) || findElement(selectors.description);

    if (hashtagsNode) {
      pristine.addValidator(
        hashtagsNode,
        (value) => parseHashtags(value).every((hashtag) => HASHTAG_REG_EXP.test(hashtag)),
        'Неверный формат хэш-тега'
      );

      pristine.addValidator(
        hashtagsNode,
        (value) => parseHashtags(value).length <= HASHTAG_MAX_COUNT,
        'Нельзя указать больше 5 хэштегов'
      );

      pristine.addValidator(
        hashtagsNode,
        (value) => {
          const hashtags = parseHashtags(value).map((hashtag) => hashtag.toLowerCase());
          return new Set(hashtags).size === hashtags.length;
        },
        'Хэш-теги не должны повторяться'
      );
    }

    if (descriptionNode) {
      pristine.addValidator(
        descriptionNode,
        (value) => !value || value.length <= COMMENT_MAX_LENGTH,
        'Комментарий не может быть длиннее 140 символов'
      );
    }

    return pristine;
  } catch (error) {
    return null;
  }
};

export {
  initValidation
};
