const lengthString = ({checkedString = '', maxLength = 1}) => checkedString.length <= maxLength;

lengthString('Строка', 20);

const palindrome = (word) => {
  const normalWord = word.replaceAll(' ', '').toLowerCase();
  let cleanString = '';
  for (let i = normalWord.length - 1; i >= 0; i--) {
    const char = normalWord[i];
    cleanString += char;
  }
  return normalWord === cleanString;
};

palindrome('топор');
palindrome('Лёша на полке клопа нашёл ');

