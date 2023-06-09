import { chromium } from "playwright";

//generar resultados

async function getResultsFromCPA(query) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://codigo-postal.co/');
}

// visitar resultados y extraer informacion