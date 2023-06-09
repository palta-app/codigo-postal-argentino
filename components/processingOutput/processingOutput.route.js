const express = require('express');
const router = express();
const fs = require('fs');
const savingCSV = require('../savingCSV/savingCSV.controller');

router.get('/', async (req, res)=>{
    try{
        //IMPRESION DEL ARCHIVO LOCALITIES "localities.csv"
        //localities:      id     |      name        |         zip           |      state
        //                0234         aguasucia          A4444XAA               salta
        let files = fs.readdirSync('./JSON', "utf-8");
        let filesCPA = files.filter((x)=>x.includes('CPA'));
        let fileProvinceCPA = "";
        let fileToWork="";


        //empiezo a procesar cada uno de los archivos CPA de las provincias para sacar los CPA de cada localidad
        for(p=0; p<filesCPA.length; p++) {
        let data;
            data =[];
            fileProvinceCPA = fs.readFileSync('./JSON/'+ filesCPA[p], 'utf-8');
            fileToWork = JSON.parse(fileProvinceCPA); 
  
            let state = fileToWork.provinceName;
            for( y=0; y<fileToWork.locations.length; y++) {
                if (fileToWork.locations[y].cpa.code.length>0 && fileToWork.locations[y].cpa.code[0]!=="" ) {
                    data.push({
                        id: fileToWork.locations[y].locationId,
                        name: fileToWork.locations[y].locationName,
                        zip: fileToWork.locations[y].cpa.code[0],
                        state: fileToWork.provinceName
                    })
                }   
            }

           //aca deberia imprimir el archivo de cada provincia localities
            //newWorksheetData, newWorksheetTitle, newFilename, newHeaders
            if (data.length>0) {
                let provinceWithoutBlanks = fileToWork.provinceName.replace(/\s+/g, '')
                const result = savingCSV(data, fileToWork.provinceName, 'LOCATIONS-'+ provinceWithoutBlanks, ["id", "name", "zip", "state"] );
            }    
        }
        res.send({status: "finish"}); 
    }catch(e) {
        res.send(e);
    }

})

module.exports = router;