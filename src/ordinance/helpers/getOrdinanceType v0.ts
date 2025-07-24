/**
 * Função que verifica o tipo de publicação.
 * @param content: Texto contendo o número de publicação.
 * @returns: 'Nomeação' ou 'Exoneração'.
 */
export function getOrdinanceTypev0(content: string): string {
  let typePublication = '';

  if (content.includes('Nomear') && content.includes('CCV-')) {
    typePublication = 'Nomeação';
  } else if (content.includes('Exonerar') && content.includes('CCV-')) {
    typePublication = 'Exoneração';
  } else if (content.includes('Conceder') && content.includes('férias')) {
    typePublication = 'Início de férias';
  } else {
    typePublication = 'Outro';
  }

  return typePublication;
}
