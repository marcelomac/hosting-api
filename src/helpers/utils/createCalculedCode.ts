/**
 * /Gera um código com base em uma string de texto fornecida como argumento.
 * Mapeamento de vogais para números: A função define um objeto chamado vowelsMap, que mapeia vogais específicas (a, e, i, o, u) para números específicos (4, 3, 1, 0, 9, respectivamente).
 * Encontrar a primeira letra: A função então itera sobre cada caractere do texto fornecido para encontrar a primeira letra alfabética (a-z ou A-Z). Ela usa uma expressão regular para verificar se um caractere é uma letra. Assim que encontra a primeira letra, ela interrompe a iteração.
 * Calcula o próximo caractere: A função calcula o caractere seguinte ao firstLetter convertendo-o para maiúsculo, obtendo seu código ASCII com charCodeAt(0), adicionando 1 a esse código e, em seguida, convertendo o código de volta para um caractere com String.fromCharCode. Se o caractere resultante for maior que 'Z', substitui por 'A'.
 * Verifica se uma vogal foi encontrada: Se nenhuma vogal for encontrada (ou seja, number permanece -1), a função lança um erro informando que o texto não contém vogais.
 * Gera o número de dois dígitos: O número encontrado é multiplicado por 7, e o resultado é convertido para uma string. Se necessário, zeros são adicionados à esquerda para garantir que o resultado tenha pelo menos dois dígitos.
 *
 */
export function createCalculedCode(text: string): string {
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

  const lastChar = String.fromCharCode(firstLetter.toUpperCase().charCodeAt(0));

  const nextChar =
    lastChar === 'Z'
      ? 'A'
      : String.fromCharCode(firstLetter.toUpperCase().charCodeAt(0) + 1);

  let number = -1;
  for (const char of text.toLowerCase()) {
    if (Object.prototype.hasOwnProperty.call(vowelsMap, char)) {
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
