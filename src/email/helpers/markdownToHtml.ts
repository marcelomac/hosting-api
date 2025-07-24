import { marked } from 'marked';

export function markdownToHtml(markdownText: string) {
  // Configurações opcionais do `marked`
  marked.setOptions({
    async: true,
    breaks: true, // Quebras de linha únicas se tornam quebras de linha
  });

  // Converter Markdown para HTML
  return marked(markdownText);
}
