import puppeteer, { Page } from 'puppeteer';

export type resultDOM = {
  total_ordinances: number;
  ordinances: {
    link: string;
    ordinance_number: string;
    publication: string;
    text: string;
  }[];
};

export async function scrapingDOM(url: string) {
  //const browser: Browser = await puppeteer.launch({ headless: true });

  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
  });

  const page: Page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  );

  try {
    //  console.log('url: ', url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Espera o elemento aparecer (opcional, caso carregue via JS)
    await page.waitForSelector('p.quiet', { visible: true });

    // Extraindo o texto da tag <p> com a classe "quiet"
    const texto: string | null = await page.evaluate(() => {
      const elemento = document.querySelector('p.quiet');
      return elemento ? elemento.textContent?.trim() || null : null;
    });

    const regex = /\b\d+\b/;
    const total_ordinances = texto.match(regex)?.[0] || null;

    const total_pages =
      total_ordinances && Number(total_ordinances) > 0
        ? Math.ceil(Number(total_ordinances) / 10)
        : 0;

    let current_page = 1;

    const finalResult: resultDOM = {
      total_ordinances: Number(total_ordinances),
      ordinances: [],
    };

    while (current_page <= total_pages) {
      // Extrai todos os links dentro dos elementos <a>
      const links: string[] = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll<HTMLAnchorElement>(
            '.resultado-pesquisa h4 a',
          ),
        ).map((link) => link.href);
      });

      for (const link of links) {
        await page.goto(link, { waitUntil: 'domcontentloaded' });

        /**
         * Extrai a data de publicação
         */
        // const publication_text: string | null = await page.evaluate(() => {
        //   const element = document.querySelector('.media-heading p small b');
        //   return element ? element.textContent?.trim() || null : null;
        // });
        // const regexDate = /\d{2}\/\d{2}\/\d{4}/;
        // const matchDate = publication_text.match(regexDate);

        // const publication = matchDate ? matchDate[0] : '';

        const publication = await page.evaluate(() => {
          // Procura todos os blocos com classe "field-row"
          const fieldRows = Array.from(document.querySelectorAll('.field-row'));

          for (const row of fieldRows) {
            const label = row
              .querySelector('.field-label')
              ?.textContent?.trim();
            if (label === 'Publicado em') {
              return row.querySelector('.field-value')?.textContent?.trim();
            }
          }
          return null;
        });

        /**
         * Extrai o texto das portarias
         * Pega o conteúdo de todas as tags <p> dentro da div "extrato-ato"
         */
        const paragraphs: string[] = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('#extrato-ato p')).map(
            (p) => p.textContent?.trim() || '',
          );
        });

        // Filtra elementos vazios e exibe o conteúdo extraído
        const filteredParagraphs = paragraphs.filter((text) => text.length > 0);

        const regex = /PORTARIA\s+Nº\s+(\d+\/\d+)/;
        const match = filteredParagraphs.join('\n').match(regex);
        const ordinance_number = match ? match[1] : '';

        /**
         * Adiciona o resultado final ao array de portarias
         */
        finalResult.ordinances.push({
          ordinance_number: ordinance_number,
          publication: publication,
          link: link,
          text: filteredParagraphs.join('\n'),
        });
      }

      current_page++;
      if (current_page <= total_pages) {
        const url_newPage =
          url.split('AtoASolrDocument_page=')[0] +
          `AtoASolrDocument_page=${current_page}`;
        await page.goto(url_newPage, { waitUntil: 'load' });
        await page.waitForSelector('.resultado-pesquisa', { visible: true });
      }
    }

    await browser.close();
    return {
      total_ordinances: finalResult.total_ordinances,
      ordinances: finalResult.ordinances,
    };
  } catch (error) {
    console.error('Erro ao buscar as portarias:', error);
    await browser.close();

    // return a empty array in resultDOM format:
    return {
      total_ordinances: 0,
      ordinances: [],
    };
  }
}
