const createThumbnailElement = (photoData) => {
  const template = document.querySelector('#picture');
  if (!template) {
    return null;
  }

  const thumbnail = template.content.querySelector('.picture').cloneNode(true);
  const image = thumbnail.querySelector('.picture__img');

  image.src = photoData.url;
  image.alt = photoData.description;
  thumbnail.querySelector('.picture__likes').textContent = photoData.likes;
  thumbnail.querySelector('.picture__comments').textContent = photoData.comments.length;

  thumbnail.dataset.id = photoData.id;

  return thumbnail;
};

const renderThumbnails = (photos) => {
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = createThumbnailElement(photo);
    if (thumbnail) {
      fragment.appendChild(thumbnail);
    }
  });

  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  picturesContainer.appendChild(fragment);
};

export {
  renderThumbnails
};
