import { countOcurrencesOfWordsBetweenChars } from 'src/helpers/utils/countOcurrencesOfWordsBetweenChars';
import { getScriptsValue } from './getScriptsValue';
// import { MovimentType } from 'src/types/moviment';
import { CreateMovimentFullDto } from 'src/moviment/dto/create-moviment-full.dto';

interface ScriptContentInterface {
  templateContent: string;
  movimentData: CreateMovimentFullDto;
}

/**
 * Retorna o conteúdo do script com as variáveis substituídas pelos valores correspondentes.
 */
export function getScriptContent({
  templateContent,
  movimentData,
}: ScriptContentInterface): string | null {
  if (!templateContent) {
    return null;
  }
  let count = countOcurrencesOfWordsBetweenChars(templateContent, '%');

  while (count > 0) {
    const word = templateContent.match(/%([^%]+)%/)[1];
    const value = getScriptsValue(`%${word}%`, movimentData);
    templateContent = templateContent.replace(`%${word}%`, value);
    count--;
  }

  return templateContent;
}
