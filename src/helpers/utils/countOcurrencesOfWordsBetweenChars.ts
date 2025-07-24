// Utiliza regex para encontrar todas as ocorrências entre os caracteres { char }

export function countOcurrencesOfWordsBetweenChars(
  text: string,
  char: string,
): number {
  const regexp = new RegExp(`${char}.*?${char}`, 'g');
  const matches = text.match(regexp);
  return matches ? matches.length : 0;
}
