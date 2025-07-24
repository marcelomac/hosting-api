import puppeteer, { Browser, Page } from "puppeteer";

const url =
  "https://www.diariomunicipal.sc.gov.br/?r=site%2Fportal&codigoEntidade=433&categoria=Portarias";
//

(async () => {
  const browser: Browser = await puppeteer.launch({ headless: false });
  const page: Page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  // Espera o elemento aparecer (opcional, caso carregue via JS)
  await page.waitForSelector("p.quiet", { visible: true });

  // Extraindo o texto da tag <p> com a classe "quiet"
  const texto: string | null = await page.evaluate(() => {
    const elemento = document.querySelector("p.quiet");
    return elemento ? elemento.textContent?.trim() || null : null;
  });

  console.log("Texto extraído:", texto);

  const regex = /\b\d+\b/;
  const numero = texto.match(regex)?.[0] || null;

  console.log("numero: ", numero);

  await page.waitForSelector("row no-print resultado-pesquisa", { visible: true });
  const links = await page.$$eval("row no-print resultado-pesquisa > h4 > a", (el) => el.map((a) => a.href));
  console.log("Links extraídos:", links);

  // Aguarda 2 segundos antes de prosseguir
  // await page.waitForTimeout(2000);

  await browser.close();
})();
