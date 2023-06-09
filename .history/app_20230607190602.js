import { chromium } from "playwright";

//generar resultados

async function getResultsFromCPA(query) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://codigo-postal.co/');
    await page.waitForNavigation({ waitUntil: 'networkidle'});

    const listResult = await page.evaluate(()=>{
        let result = [];
        document.querySelectorAll('div [<div class="col-md-4 col-md-offset-4">
					<ul class="paises">
						<li><a href="https://codigo-postal.co/argentina/"><img src="/images/_country_flags/ar.png" border="0" width="32" height="20" alt="Código Postal Argentina">Código Postal Argentina</a></li>
						<li><a href="https://codigo-postal.co/chile/"><img src="/images/_country_flags/cl.png" border="0" width="32" height="20" alt="Código Postal Chile">Código Postal Chile</a></li>
						<li><a href="https://codigo-postal.co/colombia/"><img src="/images/_country_flags/co.png" border="0" width="32" height="20" alt="Código Postal Colombia">Código Postal Colombia</a></li>
						<li><a href="https://codigo-postal.co/espana/"><img src="/images/_country_flags/es.png" border="0" width="32" height="20" alt="Código Postal España">Código Postal España</a></li>
						<li><a href="https://codigo-postal.co/ecuador/"><img src="/images/_country_flags/ec.png" border="0" width="32" height="20" alt="Código Postal Ecuador">Código Postal Ecuador</a></li>
						<li><a href="https://codigo-postal.co/japon/"><img src="/images/_country_flags/jp.png" border="0" width="32" height="20" alt="Código Postal Japón">Código Postal Japón</a></li>
						<li><a href="https://codigo-postal.co/eeuu/"><img src="/images/_country_flags/us.png" border="0" width="32" height="20" alt="Código Postal Estados Unidos">Código Postal Estados Unidos</a></li>
						<li><a href="https://codigo-postal.co/mexico/"><img src="/images/_country_flags/mx.png" border="0" width="32" height="20" alt="Código Postal México">Código Postal México</a></li>
						<li><a href="https://codigo-postal.org/paraguay/"><img src="/images/_country_flags/py.png" border="0" width="32" height="20" alt="Código Postal Paraguay">Código Postal Paraguay</a></li>
						<li><a href="https://codigo-postal.co/peru/"><img src="/images/_country_flags/pe.png" border="0" width="32" height="20" alt="Código Postal Perú">Código Postal Perú</a></li>
						<li><a href="https://codigo-postal.co/uruguay/"><img src="/images/_country_flags/uy.png" border="0" width="32" height="20" alt="Código Postal Uruguay">Código Postal Uruguay</a></li>
						<li><a href="https://codigo-postal.co/venezuela/"><img src="/images/_country_flags/ve.png" border="0" width="32" height="20" alt="Código Postal Venezuela">Código Postal Venezuela</a></li>
					</ul>
				</div>]')
    })
}

// visitar resultados y extraer informacion