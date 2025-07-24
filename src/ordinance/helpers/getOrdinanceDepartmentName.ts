/**
 * Extrai o nome do tipo de movimento.
 * @param content: Texto contendo o número de publicação.
 */
export function getOrdinanceDepartmentName(content: string): string {
  const regexOptions = [];
  let departmentName = '';

  /**
   * Exemplos:
   * Nomear o senhor xxx para o cargo em comissão de Coordenador das Comissões – DAS-4....
   * Exonerar o servidor xxx, matrícula 999-9, do cargo em comissão de Coordenador das Comissões – DAS-4. Art. 2 ...
   * Nomear o senhor xxx para o cargo em comissão de Secretário Parlamentar – CCV-3, vinculado ao gabinete do vereador xxxx. Art. 2°...
   * Nomear a senhora xxx para o cargo em comissão de Assessor Parlamentar – CCV-2, vinculado ao gabinete do vereador xxxx Art. 2...
   * Exonerar o servidor xxxxx (...), vinculada ao gabinete do vereador xxxx. Art. 2°...
   */
  regexOptions.push(
    /gabinete do vereador ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+) Art./,
    /gabinete da vereadora ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+) Art./,
  );

  regexOptions.push(
    /gabinete do vereador ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+). Art./,
    /gabinete da vereadora ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+). Art./,
  );
  regexOptions.push(
    /em comissão de Coordenador das ([A-Za-zÁÉÍÓÚÃÕÂÊÎÔÛÇáéíóúãõâêîôûç ]+) – DAS-4/,
  );

  for (let i = 0; i < regexOptions.length; i++) {
    const match = content.match(regexOptions[i]);

    if (match) {
      departmentName = match[1] || match[2];
      return departmentName;
    }
  }
  return departmentName;
}
