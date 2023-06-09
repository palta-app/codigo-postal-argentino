import { chromium } from "playwright";
import { createObjectCsvWriter } from "csv-writer";

async function scrapeCPAData() {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();
    await page.goto("https://codigo-postal.co/");

    const countries = await page.$$eval(
      'div[class="col-md-4 col-md-offset-4"] ul li a',
      (links) =>
        links.map((link, index) => ({
          index,
          title: link.innerText,
          url: link.href,
        }))
    );

    for (const country of countries) {
      const countryPage = await browser.newPage();
      await countryPage.goto(country.url);

      const provinces = await countryPage.$$eval(
        "ul.column-list li a",
        (links) =>
          links.map((link, index) => ({
            index,
            title: link.innerText,
            url: link.href,
          }))
      );

      for (const province of provinces) {
        const provincePage = await browser.newPage();
        await provincePage.goto(province.url);

        const localities = await provincePage.$$eval(
          "ul.cities li a",
          (links) =>
            links.map((link, index) => ({
              index,
              title: link.innerText,
              url: link.href,
            }))
        );

        for (const locality of localities) {
          const localityPage = await browser.newPage();
          await localityPage.goto(locality.url);

          const streets = await localityPage.$$eval(
            "ul.three_columns li a",
            (links) =>
              links.map((link, index) => ({
                index,
                title: link.innerText,
                url: link.href,
              }))
          );

          for (const street of streets) {
            const streetPage = await browser.newPage();
            await streetPage.goto(street.url);

            const postalCodes = await streetPage.$$eval(
              "div.table-responsive table tbody tr",
              (rows) =>
                rows.map((row) => {
                  const columns = Array.from(row.querySelectorAll("td"));
                  return {
                    provincia: columns[0].innerText,
                    localidad: columns[1].innerText,
                    codigoPostal: columns[2].innerText,
                    cpaUrl: columns[3].querySelector("a")?.href || "",
                  };
                })
            );

            // Guardar los resultados en un archivo CSV
            const csvWriter = createObjectCsvWriter({
              path: "resultados1.csv",
              header: [
                { id: "provincia", title: "Provincia" },
                { id: "localidad", title: "Localidad" },
                { id: "codigoPostal", title: "Código Postal" },
                { id: "cpaUrl", title: "URL CPA" },
              ],
            });
            await csvWriter.writeRecords(postalCodes);

            await streetPage.close();
          }

          await localityPage.close();
        }

        await provincePage.close();
      }

      await countryPage.close();
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  } finally {
    await browser.close();
  }
}

scrapeCPAData();
