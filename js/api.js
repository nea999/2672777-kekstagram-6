const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const getPhotos = () =>
  fetch(`${SERVER_URL}/data`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    });

const sendData = (body) =>
  fetch(`${SERVER_URL}/`, {
    method: 'POST',
    body
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    });

export {
  getPhotos,
  sendData
};
