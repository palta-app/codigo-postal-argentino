import { chromium } from "playwright";

//generar resultados

async function getResultsFromCPA(query) {
    const browser = await chromium.launch();
    const page = await browser
}

// visitar resultados y extraer informacion