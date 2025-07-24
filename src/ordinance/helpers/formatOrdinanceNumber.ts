/**
 * Extrai o número de publicação de um texto.
 * @param content: Texto contendo o número de publicação.
 * @returns: Número de publicação em formato de string.
 * @example: 'PORTARIA Nº 174/2024'
 */
export function formatOrdinanceNumber(content: string): string {
  const numberPublication = content.split(' ')[2];

  return numberPublication;
}
