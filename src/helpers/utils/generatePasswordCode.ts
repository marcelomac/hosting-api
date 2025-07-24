export function generateCode(text: string): string {
  if (text.length === 0) {
    throw new Error('Texto não pode ser vazio.');
  }

  const vowelsMap: { [key: string]: number } = {
    a: 4,
    e: 3,
    i: 1,
    o: 0,
    u: 9,
  };

  let firstLetter = '';
  for (const char of text) {
    if (/[a-zA-Z]/.test(char)) {
      firstLetter = char;
      break;
    }
  }

  if (firstLetter === '') {
    throw new Error('Texto não contém letras.');
  }

  const nextChar = String.fromCharCode(
    firstLetter.toUpperCase().charCodeAt(0) + 1,
  );
  if (nextChar > 'Z') {
    throw new Error('Letra não pode ser além de Z.');
  }

  let number = -1;
  for (const char of text.toLowerCase()) {
    if (vowelsMap.hasOwnProperty(char)) {
      number = vowelsMap[char];
      break;
    }
  }

  if (number === -1) {
    throw new Error('Texto não contém vogais.');
  }

  const twoDigitNumber = (number * 7).toString().padStart(2, '0');

  return `${nextChar}${twoDigitNumber}`;
}
