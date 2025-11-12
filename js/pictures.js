const createThumbnailElement = (photoData) => {
  const template = document.querySelector('#picture');
  const thumbnail = template.content.querySelector('.picture').cloneNode(true);
  const image = thumbnail.querySelector('.picture__img');

  image.src = photoData.url;
  image.alt = photoData.description;
  thumbnail.querySelector('.picture__likes').textContent = photoData.likes;
  thumbnail.querySelector('.picture__comments').textContent = photoData.comments.length;

  return thumbnail;
};

const renderThumbnails = (photos) => {
  const picturesContainer = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.appendChild(createThumbnailElement(photo));
  });

  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };
