const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const request = (path = '', options = {}) =>
  fetch(`${SERVER_URL}${path}`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.json();
    });

const getPhotos = () => request('/data');

const sendData = (body) => request('/', {
  method: 'POST',
  body
});

export {
  getPhotos,
  sendData
};
