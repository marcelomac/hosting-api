/**
 * Use interface:
 * - Quando definir a estrutura de objetos que serão implementados ou estendidos.
 * - Quando precisar de herança múltipla e declarações incrementais.
 * - Quando estiver lidando com contratos de classes.
 *
 * Use type:
 * - Quando precisar de flexibilidade para definir tipos complexos, incluindo unions e intersections.
 * - Quando criar alias para tipos primitivos, funções, e tuples.
 * - Quando trabalhar com generics que exigem manipulação de tipos mais flexível.
 */

export interface ScriptTypes {
  powershell_script: string;
  'Requisição de API': string;
  'E-mail para Servidor': string;
  'E-mail para Terceiros': string;
  Webscraping: string;
  'Ação manual': string;
}
