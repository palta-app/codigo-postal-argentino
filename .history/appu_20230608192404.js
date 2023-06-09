// import { chromium } from "playwright";
// import { createObjectCsvWriter } from "csv-writer";

// async function scrapeCPAData() {
//   const browser = await chromium.launch();

//   try {
//     const page = await browser.newPage();
//     await page.goto("https://codigo-postal.co/");
//     console.log("Página principal cargada");

//     const countries = await page.$$eval(
//       'div[class="col-md-4 col-md-offset-4"] ul li a',
//       (links) =>
//         links.map((link, index) => ({
//           index,
//           title: link.innerText,
//           url: link.href,
//         }))
//     );

//     for (const country of countries) {
//       const countryPage = await browser.newPage();
//       await countryPage.goto(country.url);
//       console.log(`Página de país (${country.title}) cargada`);

//       const provinces = await countryPage.$$eval(
//         "ul.column-list li a",
//         (links) =>
//           links.map((link, index) => ({
//             index,
//             title: link.innerText,
//             url: link.href,
//           }))
//       );

//       for (const province of provinces) {
//         const provincePage = await browser.newPage();
//         await provincePage.goto(province.url);
//         console.log(`Página de provincia (${province.title}) cargada`);

//         const localities = await provincePage.$$eval(
//           "ul.cities li a",
//           (links) =>
//             links.map((link, index) => ({
//               index,
//               title: link.innerText,
//               url: link.href,
//             }))
//         );

//         for (const locality of localities) {
//           const localityPage = await browser.newPage();
//           await localityPage.goto(locality.url);
//           console.log(`Página de localidad (${locality.title}) cargada`);

//           const streets = await localityPage.$$eval(
//             "ul.three_columns li a",
//             (links) =>
//               links.map((link, index) => ({
//                 index,
//                 title: link.innerText,
//                 url: link.href,
//               }))
//           );

//           for (const street of streets) {
//             const streetPage = await browser.newPage();
//             await streetPage.goto(street.url);
//             console.log(`Página de calle (${street.title}) cargada`);

//             const postalCodes = await streetPage.$$eval(
//               "div.table-responsive table tbody tr",
//               (rows) =>
//                 rows.map((row) => {
//                   const columns = Array.from(row.querySelectorAll("td"));
//                   return {
//                     provincia: columns[0].innerText,
//                     localidad: columns[1].innerText,
//                     codigoPostal: columns[2].innerText,
//                     cpaUrl: columns[3].querySelector("a")?.href || "",
//                   };
//                 })
//             );

//             // Guardar los resultados en un archivo CSV
//             const csvWriter = createObjectCsvWriter({
//               path: "resultados1.csv",
//               header: [
//                 { id: "provincia", title: "Provincia" },
//                 { id: "localidad", title: "Localidad" },
//                 { id: "codigoPostal", title: "Código Postal" },
//                 { id: "cpaUrl", title: "URL CPA" },
//               ],
//             });
//             await csvWriter.writeRecords(postalCodes);

//             await streetPage.close();
//             console.log(`Página de calle (${street.title}) cerrada`);
//           }

//           await localityPage.close();
//           console.log(`Página de localidad (${locality.title}) cerrada`);
//         }

//         await provincePage.close();
//         console.log(`Página de provincia (${province.title}) cerrada`);
//       }

//       await countryPage.close();
//       console.log(`Página de país (${country.title}) cerrada`);
//     }
//   } catch (error) {
//     console.error("Error al obtener los datos:", error);
//   } finally {
//     await browser.close();
//   }
// }

// scrapeCPAData();

// import { chromium } from "playwright";
// import { createObjectCsvWriter } from "csv-writer";

// async function scrapeCPAData() {
//   const browser = await chromium.launch();

//   const csvWriter = createObjectCsvWriter({
//     path: "resultados1.csv",
//     header: [
//       { id: "provincia", title: "Provincia" },
//       { id: "localidad", title: "Localidad" },
//       { id: "codigoPostal", title: "Código Postal" },
//       { id: "cpaUrl", title: "URL CPA" },
//     ],
//   });

//   const postalCodes = [];

//   try {
//     const page = await browser.newPage();
//     await page.goto("https://codigo-postal.co/");
//     console.log("Página principal cargada");

//     // ...

//     for (const street of streets) {
//       const streetPage = await browser.newPage();
//       await streetPage.goto(street.url);
//       console.log(`Página de calle (${street.title}) cargada`);

//       const postalCodesOnStreet = await streetPage.$$eval(
//         "div.table-responsive table tbody tr",
//         (rows) =>
//           rows.map((row) => {
//             const columns = Array.from(row.querySelectorAll("td"));
//             return {
//               provincia: columns[0].innerText,
//               localidad: columns[1].innerText,
//               codigoPostal: columns[2].innerText,
//               cpaUrl: columns[3].querySelector("a")?.href || "",
//             };
//           })
//       );

//       postalCodes.push(...postalCodesOnStreet);

//       await streetPage.close();
//       console.log(`Página de calle (${street.title}) cerrada`);

//       // Escribir los datos en el archivo CSV a medida que se encuentran
//       if (postalCodes.length > 0) {
//         await csvWriter.writeRecords(postalCodes);
//         postalCodes.length = 0; // Vaciar el array para la próxima iteración
//       }
//     }

//     // ...

//     // Comprobar si hay datos restantes después de cerrar la página del país
//     if (postalCodes.length > 0) {
//       await csvWriter.writeRecords(postalCodes);
//     }
//   } catch (error) {
//     console.error("Error al obtener los datos:", error);
//   } finally {
//     await browser.close();
//   }
// }

// scrapeCPAData();
