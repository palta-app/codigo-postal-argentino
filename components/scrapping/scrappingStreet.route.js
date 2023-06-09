const express = require('express');
const router = express();
const fs = require('fs');
const cpaStreetExtract = require('./cpaStreetExtract.controller');
const streetNumberExtract = require('./streetNumber.controller');
const savingCSV = require('../savingCSV/savingCSV.controller');
const cpaExtract = require('../scrapping/cpaExtract.controller');

router.get('/', async (req, res)=>{
    try{

        let files = fs.readdirSync('./JSON', "utf-8");
        let filesCPA = files.filter((x)=>x.includes('CPA'));
        let fileProvinceCPA = "";
        let fileToWork="";

        //empiezo a procesar cada uno de los archivos CPA de las provincias para crear un archivo
        //intermdio que tenga los datos para buscar las calles e imprimir despues STREET
        let data;

        //PROCESO PARA CADA UNO DE LOS ARCHIVOS CPA (CADA X es un provincia)
        for(x=1; x<filesCPA.length; x++) {
        let globalStreetId = 0;
            let result3;
            fileProvinceCPA = fs.readFileSync('./JSON/'+ filesCPA[x], 'utf-8');
            data=[];
            fileToWork = JSON.parse(fileProvinceCPA); 

            for(let lo=0; lo<fileToWork.locations.length; lo++) {
                    if (fileToWork.locations[lo].cpa.codeType=="linkToStreets") {
                        data.push({
                            locationId: fileToWork.locations[lo].locationId,
                            locationName: fileToWork.locations[lo].locationName,
                            streetLink: fileToWork.locations[lo].cpa.streetsLink
                        })
                    }
            }

            //recorro data para llamar al buscador de calles y recuperar todos los enlaces
            let streetId=0;
            for(d=0; d<data.length; d++) {
                let result = await cpaStreetExtract(data[d].streetLink, streetId);
                data[d].streets=result.streets;
                streetId=result.index;
            }

            //data es un arreglo por provincia y los elemento son las localidades(objetos) y tiene locationId, locationName, streetLink y streets este ultimo un arreglo de objetos con streetId, streetName, y link
           
            //Ahora recorro data y voy mandando los enlaces a streetNumbers para sacar alturas
            // for(let localidad=0; localidad<data.length; localidad++) {
            for(let localidad=0; localidad<1; localidad++) {

                let intervalo = [570000, 600000,200000];
                let valor = intervalo[Math.floor(Math.random()*intervalo.length)]

                console.log(`temporizador de ${valor} iteraciones`)
                for(let clock=0; clock<valor; clock++){
                    console.log(clock);
                }


                for(let calle=0; calle<data[localidad].streets.length; calle++) {

                        let result1 = await streetNumberExtract(data[localidad].streets[calle].link, data[localidad].streets[calle].streetId, data[localidad].streets[calle].streetName);
                        data[localidad].streets[calle].newCPA = result1;
                }
            } 

            //voy a guardar los cvs street y numbers recorriendo el objeto data para esta provincia (estoy dentro de un bucle de una provincia)   es el x de arriba de todos
            let streetFile=[];
            let numberFile=[];


            //bucle de location
            // for (let locationBucle=0; locationBucle<data.length; locationBucle++){
            for (let locationBucle=0; locationBucle<1; locationBucle++){
                //bucle de dtreets
                for (let streetBucle=0; streetBucle<data[locationBucle].streets.length; streetBucle++) {
                // for (let streetBucle=0; streetBucle<1; streetBucle++) {
                        globalStreetId++;
                        streetFile.push({
                            id: globalStreetId,
                            type: "",
                            name: data[locationBucle].streets[streetBucle].streetName,
                            alternativeName: "",
                            localityId: data[locationBucle].locationId,
                            neighborhood: ""
                        })

                        //ahora tengo que recorrer todo el archivo newCPA y grabar todas las posibilidad de numeros pares e impares para esa calle
                        for(let streetCPAList=0; streetCPAList<data[locationBucle].streets[streetBucle].newCPA.length; streetCPAList++) {
                            let pares = data[locationBucle].streets[streetBucle].newCPA[streetCPAList].odd.includes('impares');

                            numberFile.push({
                                streetId: globalStreetId,
                                isOdd: pares,
                                from: data[locationBucle].streets[streetBucle].newCPA[streetCPAList].from,
                                until: data[locationBucle].streets[streetBucle].newCPA[streetCPAList].until,
                                zip: data[locationBucle].streets[streetBucle].newCPA[streetCPAList].cpa,
                            })
                        }
                }
            }
            let provinceWithoutBlanks = filesCPA[x].replace(/\s+/g, '').slice(6);

            const result = savingCSV(streetFile, provinceWithoutBlanks, 'STREETS-'+ provinceWithoutBlanks, ["id", "type", "name", "alternativeName","localityId", "neighborhood"] );
             	
            const result2 = savingCSV(numberFile, provinceWithoutBlanks, 'NUMBER-'+ provinceWithoutBlanks, ["streetId", "isOdd", "from", "until","localityId", "zip"] );
          
        }
      
        res.send (fileToWork);
    } catch(e) {
        res.send (e);
    }
})

module.exports=router;














































// const express = require('express');
// const router = express();
// const fs = require('fs');
// const cpaStreetExtract = require('./cpaStreetExtract.controller');
// const streetNumberExtract = require('./streetNumber.controller');
// const savingCSV = require('../savingCSV/savingCSV.controller');
// const cpaExtract = require('../scrapping/cpaExtract.controller');

// router.get('/', async (req, res)=>{
//     try{
//         //streets:     id   |    type   |   name   |    alternativeName    |   localityId   |   neighborhood
//         //           000121               ruta prov2                              001212           

//         //el siguiente para mi no tiene identificador unico
//         //numbers:      streetId    |      isOdd    |      from    |     until   |    zip
//         //               000121          true/false        100           125         S3077AAA

//         let files = fs.readdirSync('./JSON', "utf-8");
//         let filesCPA = files.filter((x)=>x.includes('CPA'));
//         let fileProvinceCPA = "";
//         let fileToWork="";

//         //empiezo a procesar cada uno de los archivos CPA de las provincias para crear un archivo
//         //intermdio que tenga los datos para buscar las calles e imprimir despues STREET
//         let data;

//         //PROCESO PARA CADA UNO DE LOS ARCHIVOS CPA (CADA X es un provincia)
//         // for(x=1; x<filesCPA.length; x++) {
//         let globalStreetId = 0;

//         for(x=0; x<2; x++) {

            




//             let result3;
//             fileProvinceCPA = fs.readFileSync('./JSON/'+ filesCPA[x], 'utf-8');
//             data=[];
//             //    console.log(fileProvinceCPA); 
//             fileToWork = JSON.parse(fileProvinceCPA); 

//             // res.send(fileToWork);

           

//             //esto es si es caba
//             if(filesCPA[x].includes('CABA')) {
//                 console.log('es caba')
//                 console.log(fileToWork.locations)

//                 result3 = await cpaExtract('caba', 'caba', fileToWork.locations[0].locationLink )
//                 console.log(result3);
//             }
            



//             for(let lo=0; lo<fileToWork.locations.length; lo++) {
//                     if (fileToWork.locations[lo].cpa.codeType=="linkToStreets") {
//                         data.push({
//                             locationId: fileToWork.locations[lo].locationId,
//                             locationName: fileToWork.locations[lo].locationName,
//                             streetLink: fileToWork.locations[lo].cpa.streetsLink
//                         })
//                     }
//             }
//             //recorro data para llamar al buscador de calles y recuperar todos los enlaces
//             let streetId=0;
//             // for(d=0; d<data.length; d++) {
//             for(d=0; d<1; d++) {
//                 let result = await cpaStreetExtract(data[d].streetLink, streetId);
//                 data[d].streets=result.streets;
//                 streetId=result.index;
//             }
//             //data es un arreglo por provincia y los elemento son las localidades(objetos) y tiene locationId, locationName, streetLink y streets este ultimo un arreglo de objetos con streetId, streetName, y link
           
//             //Ahora recorro data y voy mandando los enlaces a streetNumbers para sacar alturas
//             // for(let localidad=0; localidad<data.length; localidad++) {
//             for(let localidad=0; localidad<1; localidad++) {

//                 for(let calle=0; calle<data[localidad].streets.length; calle++) {

//                         let result1 = await streetNumberExtract(data[localidad].streets[calle].link, data[localidad].streets[calle].streetId, data[localidad].streets[calle].streetName);
//                         data[localidad].streets[calle].newCPA = result1;
//                 }
//             } 

//             //voy a guardar los cvs street y numbers recorriendo el objeto data para esta provincia (estoy dentro de un bucle de una provincia)   es el x de arriba de todos
//             let streetFile=[];
//             let numberFile=[];


//             //bucle de location
//             // for (let locationBucle=0; locationBucle<data.length; locationBucle++){
//             for (let locationBucle=0; locationBucle<1; locationBucle++){
//                 //bucle de dtreets
//                 for (let streetBucle=0; streetBucle<data[locationBucle].streets.length; streetBucle++) {
//                 // for (let streetBucle=0; streetBucle<1; streetBucle++) {
//                         globalStreetId++;
//                         streetFile.push({
//                             id: globalStreetId,
//                             type: "",
//                             name: data[locationBucle].streets[streetBucle].streetName,
//                             alternativeName: "",
//                             localityId: data[locationBucle].locationId,
//                             neighborhood: ""
//                         })

//                         //ahora tengo que recorrer todo el archivo newCPA y grabar todas las posibilidad de numeros pares e impares para esa calle
//                         for(let streetCPAList=0; streetCPAList<data[locationBucle].streets[streetBucle].newCPA.length; streetCPAList++) {
//                             let pares = data[locationBucle].streets[streetBucle].newCPA[streetCPAList].odd.includes('impares');

//                             numberFile.push({
//                                 streetId: globalStreetId,
//                                 isOdd: pares,
//                                 from: data[locationBucle].streets[streetBucle].newCPA[streetCPAList].from,
//                                 until: data[locationBucle].streets[streetBucle].newCPA[streetCPAList].until,
//                                 zip: data[locationBucle].streets[streetBucle].newCPA[streetCPAList].cpa,
//                             })
//                         }
//                 }
//             }
//             let provinceWithoutBlanks = filesCPA[x].replace(/\s+/g, '').slice(6);

//             const result = savingCSV(streetFile, provinceWithoutBlanks, 'STREETS-'+ provinceWithoutBlanks, ["id", "type", "name", "alternativeName","localityId", "neighborhood"] );
             	
//             const result2 = savingCSV(numberFile, provinceWithoutBlanks, 'NUMBER-'+ provinceWithoutBlanks, ["streetId", "isOdd", "from", "until","localityId", "zip"] );
          
//         }
      
//         res.send (fileToWork);
//     } catch(e) {
//         res.send (e);
//     }
// })

// module.exports=router;