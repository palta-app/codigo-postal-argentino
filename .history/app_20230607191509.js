import { chromium } from "playwright";

//generar resultados

async function getResultsFromCPA(query) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://codigo-postal.co/');
    await page.waitForNavigation({ waitUntil: 'networkidle'});

    const listResult = await page.evaluate(()=>{
        let result = [];
        document.querySelectorAll('div [col-md-4 col-md-offset-4] ul li').forEach((a, i)=>{
            result,push({
                index: i,
                title: a.innerText,
                url: a.href
            })
        });
        return result;
    })

    
}

// visitar resultados y extraer informacion