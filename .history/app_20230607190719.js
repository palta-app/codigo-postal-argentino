import { chromium } from "playwright";

//generar resultados

async function getResultsFromCPA(query) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://codigo-postal.co/');
    await page.waitForNavigation({ waitUntil: 'networkidle'});

    const listResult = await page.evaluate(()=>{
        let result = [];
        document.querySelectorAll('div []')
    })
}

// visitar resultados y extraer informacion