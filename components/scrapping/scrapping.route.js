const savingJSON = require('../savingJSON/savingJSON.controller');
const express = require('express');
const router = express();
const provinceExtract = require('./provinceExtract.controller');
const locationExtract = require('./locationExtract.controller');
const cpaExtract = require('./cpaExtract.controller');
const savingCSV = require('../savingCSV/savingCSV.controller');
const streetExtract = require("../scrapping/streetExtract.controller");


router.get('/', async (req, res)=>{
    try{
        //1ero - ProvinceExtract ---genero el archivo 1-ListaGeneral.json
        const generalList = await provinceExtract();
        let result1 = savingJSON("1-ListaGeneral", generalList);

        //2do - locationExtract ---genero el archivo 2-ProvinciaLocalidades.json
        let startId=0;  //Numero para poner id a las localidades en toda la argentina
        
        for(let x=0; x<generalList.length; x++) {
            const {result, id} = await locationExtract (generalList[x].provinceName, generalList[x].provinceLink, startId);
            generalList[x].locationsCount = id;
            generalList[x].locationWithCPALink = result.length;
            generalList[x].locations= result;
            startId= id;
        }
        let result2 = savingJSON("2-PLocalidades", generalList);    
        //3 - cpa Extract por provincia y grabar en un archivo por provincia
        //cpaExtract
        for(let p=0; p<generalList.length; p++) {
                console.log(`provincia: ${generalList[p].provinceName}`);
                let tiempo = new Date();
                console.log(tiempo.toLocaleTimeString('en-US'));
                for(let l=0; l<generalList[p].locations.length; l++)  {

                    const result = await cpaExtract(generalList[p].provinceName, generalList[p].locations[l].locationName, generalList[p].locations[l].locationLink);
                    generalList[p].locations[l].cpa=result;
                }
                let fillName = '3-CPA-'.concat((generalList[p].provinceName).replace(/\s+/g,''))
                let result3 = savingJSON(fillName, generalList[p]);    

                let intervalo = [570000, 800000,200000];
                let valor = intervalo[Math.floor(Math.random()*intervalo.length)]

                console.log(`temporizador de ${valor} iteraciones`)
                for(let clock=0; clock<valor; clock++){
                    console.log(clock);
                }
                console.log('------------------------------------------')
        }        
        res.send(generalList);    
    }catch(e) {
        res.send(e)
    }
})


module.exports = router;