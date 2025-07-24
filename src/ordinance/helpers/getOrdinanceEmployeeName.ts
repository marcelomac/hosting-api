/**
 * Extrai o nome do servidor.
 * @param content: Texto contendo o número de publicação.
 */
export function getOrdinanceEmployeeName(content: string): string {
  const regexOptions = [];
  let employeeName = '';

  /**
   * Exemplos:
   * Nomear o senhor xxxxxxxxxx para o cargo em comissão de Secretário Parlamentar – CCV-3...
   * Nomear a senhora xxxxxxx para o cargo em comissão de Assessor Parlamentar – CCV–2,
   * Nomear o senhor xxxxxxxxx para o cargo em comissão de Coordenador das Comissões – DAS-4...
   * Exonerar o servidor xxxxxxxxx , matrícula 1648-1, do cargo em comissão de Secretário Parlamentar – CCV-3...
   * Exonerar a servidora xxxxxxx, matrícula ....
   * Convocar a servidora xxxxxxxxxx, matrícula nº 99-9, a retornar às suas atividades...
   * Conceder 99 (nnnn) dias de férias ao servidor xxxxxxxxxx, matrícula nº 9999-9, a contar de...
   */
  regexOptions.push(
    /Nomear o senhor ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+) para o cargo/,
    /Nomear a senhora ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+) para o cargo/,
  );
  regexOptions.push(
    /Exonerar o servidor ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+)/,
    /Exonerar a servidora ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+), matrícula/,
    /, matricula/,
  );
  regexOptions.push(
    /ao servidor ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+)/,
    /à servidora ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+), matrícula/,
    /, matricula/,
  );

  regexOptions.push(
    /o servidor ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+)/,
    /a servidora ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+), matrícula/,
    /, matricula/,
  );

  regexOptions.push(
    /o servidor ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+) do cargo/,
    /a servidora ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+) do cargo/,
    /, matricula/,
  );

  for (let i = 0; i < regexOptions.length; i++) {
    const match = content.match(regexOptions[i]);

    if (match) {
      employeeName = match[1] || match[2];
      return employeeName;
    }
  }

  return employeeName;
}
