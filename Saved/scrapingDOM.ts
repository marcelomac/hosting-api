import puppeteer from 'puppeteer';

export type resultDOM = {
  total: number;
  portarias: { portaria: string; texto: string }[];
};

export async function scrapingDOM(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('url: ', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const portarias = await page.evaluate(() => {
      const elements = document.body.innerText.split('\n');
      const portariasArray: resultDOM = { total: 0, portarias: [] };
      let currentPortaria: string | null = null;
      let currentText: string[] = [];

      elements.forEach((element) => {
        const content = element.trim();

        if (content.startsWith('Foram encontradas')) {
          const resultado = content.match(
            /Foram encontradas (\d+) publicações/,
          );
          portariasArray.total = parseInt(resultado[1], 10);
        } else if (content.startsWith('Foi encontrada')) {
          portariasArray.total = 1;
        } else {
          if (content.startsWith('PORTARIA N') && content.length < 22) {
            if (currentPortaria) {
              portariasArray.portarias.push({
                portaria: currentPortaria,
                texto: currentText.join(' '),
              });
            }
            currentPortaria = content;
            currentText = [];
          } else if (currentPortaria) {
            currentText.push(content);
          }
        }
      });

      // Adiciona a última portaria coletada
      if (currentPortaria) {
        portariasArray.portarias.push({
          portaria: currentPortaria,
          texto: currentText.join(' '),
        });
      }

      //return elements;
      return portariasArray;
    });

    await browser.close();
    return portarias;
  } catch (error) {
    console.error('Erro ao buscar as portarias:', error);
    await browser.close();

    // return a empty array in resultDOM format:
    return { total: 0, portarias: [] };
  }
}
