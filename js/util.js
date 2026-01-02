const alertShowTime = 5000;

const findElement = (selector, root = document) => {
  try {
    return root.querySelector(selector);
  } catch (error) {
    return null;
  }
};

const findAllElements = (selector, root = document) => {
  try {
    return Array.from(root.querySelectorAll(selector));
  } catch (error) {
    return [];
  }
};

const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const showNotification = (text) => {
  const node = document.createElement('div');
  node.classList.add('data-error');

  node.style.zIndex = '100';
  node.style.position = 'fixed';
  node.style.left = '0';
  node.style.top = '0';
  node.style.right = '0';
  node.style.padding = '10px 3px';
  node.style.fontSize = '20px';
  node.style.textAlign = 'center';
  node.style.backgroundColor = 'red';
  node.style.color = 'white';
  node.textContent = text;

  document.body.append(node);

  setTimeout(() => {
    node.remove();
  }, alertShowTime);
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), timeoutDelay);
  };
};

const getShuffledArray = (items) => {
  const result = items.slice();

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temporary = result[index];
    result[index] = result[randomIndex];
    result[randomIndex] = temporary;
  }

  return result;
};

const getRandomUniqueItems = (items, count) => {
  const shuffled = getShuffledArray(items);
  const limitedCount = Math.min(count, shuffled.length);
  return shuffled.slice(0, limitedCount);
};

export {
  findElement,
  findAllElements,
  isEscapeKey,
  showNotification,
  debounce,
  getShuffledArray,
  getRandomUniqueItems
};
