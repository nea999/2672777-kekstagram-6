const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const sendRequest = (path = '', options = {}) =>
  fetch(`${SERVER_URL}${path}`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.json();
    });

const getPhotos = () => sendRequest('/data');

const sendData = (body) => sendRequest('/', {
  method: 'POST',
  body
});

export {
  getPhotos,
  sendData
};
