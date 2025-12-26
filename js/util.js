const query = (selector, root = document) => {
  try {
    return root.querySelector(selector);
  } catch (error) {
    return null;
  }
};

const queryAll = (selector, root = document) => {
  try {
    return Array.from(root.querySelectorAll(selector));
  } catch (error) {
    return [];
  }
};

const showNotification = (text) => {
  const node = document.createElement('div');
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
  }, 5000);
};

export {
  query,
  queryAll,
  showNotification
};
