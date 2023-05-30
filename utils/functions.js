const puppeteer = require("puppeteer");
const fs = require("fs");
const stateCode = require("../db/stateCode.json")
// Ejemplo de uso:
const result = {
  localities: [],
  streets: [],
  numbers: [],
};

function obtenerLetraPorProvincia(provincia) {
  const resultado = stateCode.find((objeto) => objeto.provincia.toUpperCase() === provincia.toUpperCase());
 
  if (resultado) {
    return resultado.letra;
  } else {
    return null;
  }
 }
const extractStateFromResponse = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const pElement = await page.$x("/html/body/div[3]/div/div[2]/div[1]/p");

    var fragmento = {
      state: "",
      name: "",
      zip: "",
      district: "",
      type: "",
      reference: "",
      alternativeName: "",
      neighborhood: "",
      isOdd: "",
      from: "",
      until: "",
    };
    if (pElement.length > 0) {
      const pText = await page.evaluate(
        (element) => element.textContent,
        pElement[0]
      );

      const calleRegex = /(Calle|Avenida) ([^\s,]+)/;
      const provinciaRegex = /provincia ([^\s,]+)/;
      const ubicacionRegex = /en ([^\s,]+)/;
      const numerosRegex = /números ([\d]+) a ([\d]+)/;
      const cpaRegex = /CPA ([^\s,]+)/;

      const calleMatch = pText.match(calleRegex);
      const provinciaMatch = pText.match(provinciaRegex);
      const ubicacionMatch = pText.match(ubicacionRegex);
      const numerosMatch = pText.match(numerosRegex);
      const cpaMatch = pText.match(cpaRegex);

      const cpa = cpaMatch ? cpaMatch[1] : null;
      const calle = calleMatch ? calleMatch[2] : null;
      const provincia = provinciaMatch ? provinciaMatch[1] : null;
      const ubicacion = ubicacionMatch ? ubicacionMatch[1] : null;
      const numerosInicio = numerosMatch ? parseInt(numerosMatch[1]) : null;
      const numerosFin = numerosMatch ? parseInt(numerosMatch[2]) : null;
      const numerosTipo =
        numerosInicio && numerosFin
          ? numerosInicio % 2 === 0
            ? "pares"
            : "impares"
          : null;

      fragmento.state = provincia;
      fragmento.nameStreet = calle;
      fragmento.from = numerosInicio;
      fragmento.until = numerosFin;
      fragmento.isOdd = numerosTipo;
      fragmento.neighborhood = ubicacion;
      fragmento.name = ubicacion;
      fragmento.zip = cpa;
    } else {
      console.log("err: no encontramos referencias");
    }
    return fragmento;
  } catch (error) {
    console.error(`Error processing : ${error.message}`);
  }
  return fragmento;
};

function saveResult(state) {
  var localitiesID = generarID();
  var streetsID = generarID();
  var numbersID = generarID();

  result.localities.push({
    id: localitiesID.toLowerCase(),
    name: state.name.toLowerCase(),
    zip: state.zip.toLowerCase(),
    state: state.state.toLowerCase(),
  });
  result.streets.push({
    streetId: streetsID.toLowerCase(),
    name: state.nameStreet.toLowerCase(),
    localityId: localitiesID.toLowerCase(),
    neighborhood: state.name.toLowerCase(),
  });
  result.numbers.push({
    numberId: numbersID.toLowerCase(),
    streetId: streetsID.toLowerCase(),
    from: state.from.toLowerCase(),
    until: state.until.toLowerCase(),
    isOdd: state.isOdd.toLowerCase(),
  });


  const jsonData = JSON.stringify(result);

  fs.writeFileSync("db/data.json", jsonData);
  return result;
}

function generarID() {
  let timestamp = new Date().getTime().toString();
  let random = Math.random().toString(36).substring(2, 10);
  let id = timestamp + random;
  return id;
}

module.exports = {
  extractStateFromResponse,

  saveResult,

  generarID,
  obtenerLetraPorProvincia,
};
