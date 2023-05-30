
const {saveResult, extractStateFromResponse, obtenerLetraPorProvincia} = require("./utils/functions")
const stateCode = require("./db/stateCode.json")


exports.scrape = async () => {
  const zipcodes = require("./db/cpa.json");

  for (const zipcode of zipcodes) {
    const zipcodePrefix = zipcode.CP;
    const provinciaCpa = zipcode.Provincia
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
        for (let k = 0; k < 26; k++) {
          const suffix =
            String.fromCharCode(65 + i) +
            String.fromCharCode(65 + j) +
            String.fromCharCode(65 + k);
            const prefijo = obtenerLetraPorProvincia(provinciaCpa);
          const url = `https://codigo-postal.co/argentina/cpa/M5500FHA/`;
          console.log( url)
          try {
            const state = await extractStateFromResponse(url);
            if (state.state === null) {
              console.log("error no existe este CPA");
            }else{
              console.log("exitos");
              saveResult(state, prefijo, suffix, zipcodePrefix);
            }

            console.log(`Processed ${zipcode}${suffix}`);
          } catch (error) {
            console.error(
              `Error processing ${zipcode}${suffix}: ${error.message}`
            );
          }
        }
      }
    }
  }
};

