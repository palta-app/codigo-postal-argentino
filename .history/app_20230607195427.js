import { chromium } from "playwright";

//generar resultados

async function getResultsFromCPA(query) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://codigo-postal.co/');
    await page.waitForSelector('div[class="col-md-4 col-md-offset-4"] ul li');

    const listResult = await page.evaluate(() => {
        let result = [];
        document.querySelectorAll('div[class="col-md-4 col-md-offset-4"] ul li').forEach((li, i) => {
            const a = li.querySelector('a');
            result.push({
                index: i,
                title: a.innerText,
                url: a.getAttribute('href')
            });
        });
        return result;
    });

     // Acceder a la primera URL en la lista de resultados
     const selectedUrl = listResult[0].url;
     const internalPage = await browser.newPage();
     await internalPage.goto(selectedUrl);
 
     // Esperar a que la página interna cargue completamente
     await internalPage.waitForSelector('selector-de-elemento'); // Reemplaza 'selector-de-elemento' con el selector correspondiente
 
     // Extraer información de la página interna utilizando page.evaluate
     const internalData = await internalPage.evaluate(() => {
         // Lógica de extracción de información de la página interna
         // Retorna los datos extraídos
     });
 
     console.log(internalData);

    // console.log(listResult);

    await browser.close();
}



getResultsFromCPA('nodejs');

// visitar resultados y extraer informacion