import { parse } from 'date-fns';

/**
 * Extrai a data de publicação de um texto e a formata para o formato ISO.
 * @param content: Texto contendo a data de publicação.
 * @returns: Data de publicação no formato ISO.
 * @example: 'N.º 5958120 - 10/05/2024 18:29 - Autopublicação - Portarias - Câmara de Vereadores de São José [Abrir/Salvar Original]  PORTARIA Nº 174/2024 O PRESIDENTE DA CÂMARA MUNICIPAL DE SÃO JOSÉ, no uso das atribuições que lhe são conferidas pelo art. 23, III, a, do Regimento Interno aprovado pela Resolução nº 164, de 20 de dezembro de 2005; Considerando que os contratos administrativos devem ser fielmente executados pelas partes, respondendo cada uma das partes pelas consequências de sua inexecução; Considerando a obrigação da Administração indicar') // '2024-05-10T03:00:00.000Z'
 */
export function formatOrdinanceDate(content: string): string {
  // extrai a data do texto em formato 'dd/MM/yyyy':
  //const dateString = content.split(' - ')[1].split(' ')[0];

  // converte a data para o formato ISO:
  const formattedDate = parse(content, 'dd/MM/yyyy', new Date());

  return formattedDate.toISOString();
}
