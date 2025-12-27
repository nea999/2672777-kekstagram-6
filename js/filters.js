import { renderThumbnails } from './pictures.js';
import { debounce, getRandomUniqueItems } from './util.js';

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

let originalPhotos = [];
let currentFilterId = 'filter-default';

const getDefaultPhotos = (photos) => photos.slice();

const getRandomPhotos = (photos) => getRandomUniqueItems(photos, RANDOM_PHOTOS_COUNT);

const getDiscussedPhotos = (photos) =>
  photos.slice().sort((first, second) => second.comments.length - first.comments.length);

const applyFilter = (filterId) => {
  if (!originalPhotos.length) {
    return;
  }

  let photosToRender;

  switch (filterId) {
    case 'filter-random':
      photosToRender = getRandomPhotos(originalPhotos);
      break;
    case 'filter-discussed':
      photosToRender = getDiscussedPhotos(originalPhotos);
      break;
    case 'filter-default':
    default:
      photosToRender = getDefaultPhotos(originalPhotos);
      break;
  }

  renderThumbnails(photosToRender);
};

const debouncedApplyFilter = debounce(applyFilter, DEBOUNCE_DELAY);

const setActiveButton = (button) => {
  const buttons = document.querySelectorAll('.img-filters__button');
  buttons.forEach((btn) => btn.classList.remove('img-filters__button--active'));
  button.classList.add('img-filters__button--active');
};

const onFiltersClick = (evt) => {
  const target = evt.target;

  if (!target.classList.contains('img-filters__button')) {
    return;
  }

  if (target.id === currentFilterId) {
    return;
  }

  currentFilterId = target.id;
  setActiveButton(target);
  debouncedApplyFilter(currentFilterId);
};

const initFilters = (photos) => {
  originalPhotos = Array.isArray(photos) ? photos.slice() : [];

  const filtersBlock = document.querySelector('.img-filters');
  if (!filtersBlock) {
    return;
  }

  filtersBlock.classList.remove('img-filters--inactive');

  const form = filtersBlock.querySelector('.img-filters__form');
  if (form) {
    form.addEventListener('click', onFiltersClick);
  }

  const defaultButton = filtersBlock.querySelector('#filter-default');
  if (defaultButton) {
    setActiveButton(defaultButton);
  }
};

export {
  initFilters
};
