// ...

async function getResultsFromCPA(query) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto("https://codigo-postal.co/");
    await page.waitForSelector("ul li");
  
  
    const selectedUrls = listResultCountry.map((result) => result.url);
    for (const selectedUrl of selectedUrls) {
      const internalPage = await browser.newPage();
      await internalPage.goto(selectedUrl);
      await internalPage.waitForSelector("ul li");
  
      const listResultProvince = await internalPage.evaluate(() => {
        let result = [];
        const listItems = Array.from(document.querySelectorAll("ul li"));
        listItems.forEach((li, i) => {
          const a = li.querySelector("a");
          result.push({
            index: i,
            title: a.innerText,
            url: a.getAttribute("href"),
          });
        });
        return result;
      });
  
      const selectedInternalUrls = listResultProvince.map((result) => result.url);
      for (const selectedInternalUrl of selectedInternalUrls) {
        const nextPage = await browser.newPage();
        await nextPage.goto(selectedInternalUrl);
        await nextPage.waitForSelector("ul li");
  
        const listResultLocalities = await nextPage.evaluate(() => {
          let result = [];
          const listItems = Array.from(document.querySelectorAll("ul li"));
          listItems.forEach((li, i) => {
            const a = li.querySelector("a");
            result.push({
              index: i,
              title: a.innerText,
              url: a.getAttribute("href"),
            });
          });
          return result;
        });
  
        const selectedInternalUrlsLocalities = listResultLocalities.map((result) => result.url);
        for (const selectedInternalUrlLocalities of selectedInternalUrlsLocalities) {
          const nextPageLocalities = await browser.newPage();
          await nextPageLocalities.goto(selectedInternalUrlLocalities);
          await nextPageLocalities.waitForSelector("div.table-responsive table tbody");
  
          const listResultLocalitiesDos = await nextPageLocalities.evaluate(() => {
            let result = [];
            const rows = Array.from(document.querySelectorAll("div.table-responsive table tbody tr"));
            rows.forEach((row) => {
              const columns = row.querySelectorAll("td");
              const provincia = columns[0].innerText;
              const localidad = columns[1].innerText;
              const codigoPostal = columns[2].innerText;
              const cpaUrl = columns[3].querySelector("a")?.getAttribute("href") || "";
  
              result.push({
                provincia,
                localidad,
                codigoPostal,
                cpaUrl,
              });
            });
            return result;
          });
  
          const selectedInternalUrlsStreet = listResultLocalitiesDos.map((result) => result.cpaUrl);
          for (const selectedInternalUrlStreet of selectedInternalUrlsStreet) {
            const nextPageStreet = await browser.newPage();
            await nextPageStreet.goto(selectedInternalUrlStreet);
            await nextPageStreet.waitForSelector("ul li");
  
            const listResultStreet = await nextPageStreet.evaluate(() => {
              let result = [];
              const listItems = Array.from(document.querySelectorAll("ul li"));
              listItems.forEach((li, i) => {
                const a = li.querySelector("a");
                result.push({
                  index: i,
                  title: a.innerText,
                  url: a.getAttribute("href"),
                });
              });
              return result;
            });
  
            const selectedInternalUrlsEndStreet = listResultStreet.map((result) => result.url);
            for (const selectedInternalUrlEndStreet of selectedInternalUrlsEndStreet) {
              const nextPageEndStreet = await browser.newPage();
              await nextPageEndStreet.goto(selectedInternalUrlEndStreet);
              await nextPageEndStreet.waitForSelector("div.table-responsive table tbody");
  
              const listResultEndStreet = await nextPageEndStreet.evaluate(() => {
                let result = [];
                const rows = Array.from(document.querySelectorAll("div.table-responsive table tbody tr"));
                rows.forEach((row) => {
                  const columns = row.querySelectorAll("td");
                  const calleAvenida = columns[0].innerText;
                  const desde = columns[1].innerText;
                  const hasta = columns[2].innerText;
                  const aplicaA = columns[3].innerText;
                  const codigoPostal = columns[4].innerText;
                  const cpaUrl = columns[5].querySelector("a")?.getAttribute("href") || "";
  
                  result.push({
                    calleAvenida,
                    desde,
                    hasta,
                    aplicaA,
                    codigoPostal,
                    cpaUrl,
                  });
                });
                return result;
              });
  
              const selectedInternalUrlsHeight = listResultEndStreet.map((result) => result.cpaUrl);
              for (const selectedInternalUrlHeight of selectedInternalUrlsHeight) {
                const nextPageHeight = await browser.newPage();
                await nextPageHeight.goto(selectedInternalUrlHeight);
                await nextPageHeight.waitForSelector("div.table-responsive table tbody");
  
                const listResultHeight = await nextPageHeight.evaluate(() => {
                  let result = [];
                  const rows = Array.from(document.querySelectorAll("div.table-responsive table tbody tr"));
                  rows.forEach((row) => {
                    const columns = row.querySelectorAll("td");
                    const codigoPostal = columns[0].innerText;
                    const provincia = columns[1].innerText;
                    const localidad = columns[2].innerText;
                    const calleAvenida = columns[3].innerText;
                    const rangoAltura = columns[4].innerText;
  
                    result.push({
                      codigoPostal,
                      provincia,
                      localidad,
                      calleAvenida,
                      rangoAltura,
                    });
                  });
                  return result;
                });
  
                // Guardar los resultados en un archivo CSV
                const resultKeys = Object.keys(listResultHeight[0]);
                const csvWriter = createObjectCsvWriter({
                  path: "resultados.csv",
                  header: resultKeys.map((key) => ({ id: key, title: key })),
                });
                await csvWriter.writeRecords(listResultHeight);
              }
  
              await nextPageEndStreet.close();
            }
  
            await nextPageStreet.close();
          }
  
          await nextPageLocalities.close();
        }
  
        await nextPage.close();
      }
  
      await internalPage.close();
    }
  
    console.log("Los datos se han guardado en el archivo resultados.csv");
  
    // ...
  }
  
  getResultsFromCPA("nodejs");
  
