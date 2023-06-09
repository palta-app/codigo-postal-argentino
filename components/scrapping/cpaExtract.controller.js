const cheerio = require ('cheerio');
const axios = require('axios');

async function cpaExtract (provinceName, name, link) {
    try{
        console.log('lega al cpaextract');
        console.log(link);



        let customHeader = ["Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1", "Mozilla/5.0 (iPhone9,4; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1", "Mozilla/5.0 (Linux; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/47.1.79 like Chrome/47.0.2526.80 Safari/537.36", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1","Dalvik/2.1.0 (Linux; U; Android 9; ADT-2 Build/PTT5.181126.002)","Roku4640X/DVP-7.70 (297.70E04154A)", "Mozilla/5.0 (Linux; U; Android 4.2.2; he-il; NEO-X5-116A Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30", "Dalvik/2.1.0 (Linux; U; Android 6.0.1; Nexus Player Build/MMB29T)", "AppleTV11,1/11.1"]
        let headChoosen = customHeader[Math.floor(Math.random()*customHeader.length)]

        const {data} = await axios.get(link, { headers: {
                                                 'User-Agent': headChoosen }  });
        
        // const {data} = await axios.get(link);
        const $ = cheerio.load(data);

        let valor="";
        let code= [];   //arreglo donde guardo los codigos a devolver
        let codeType="";//valor donde guardo si es un cpa, conjunto de cpa o direccion de 
                        //calles
        let streetsLink= "";
        let CPAfounded = false;
        const $existTable = $('thead').length;
        if ($existTable>0) {
                //Esto es para leer la cabecera si aparece tabla de datos
                const $titleCities = $('thead tr');
                //localidad esta primero en la fila de titulo. Hay varios codigos de la misma localidad
                if ($titleCities.find('tr th:nth-child(1)').text().toLocaleLowerCase()!=="provincia") {
                        const $rowCities = $('tbody tr');
                        $rowCities.each((idx,item)=>{
                            if (($(item).find('tr td:nth-child(1)').text().toLowerCase()==name.toLowerCase()) && ($(item).find('td:nth-child(2)').text().toLowerCase()==provinceName.toLowerCase())) {
                                let CPA = $(item).find('td:nth-child(4)').text();
                                if (CPA!="") {
                                    code.push(CPA);
                                    codeType= 'multiple';
                                    CPAfounded=true;
                                }    
                            }
                        })        
                } else // quiere decir que esta primero provincia es la busqueda normal con un solo codigo y href para buscar
                {
                        const $rowCities = $('tbody tr');
                        $rowCities.each((idx,item)=>{
                            if (($(item).find('tr td:nth-child(2)').text().toLowerCase()==name.toLowerCase()) && ($(item).find('td:first').text().toLowerCase()==provinceName.toLowerCase())) {
                                let CPA=null;
                                CPA= $(item).find('a').attr('href');
                                if (CPA.toLowerCase().includes("/cpa/")==true) {
                                    let oneCode = $(item).find('a').text();
                                    code.push(oneCode);
                                    codeType= 'unique';

                                    CPAfounded=true;
                                } else {
                                    streetsLink = CPA;
                                    codeType= 'linkToStreets'

                                    CPAfounded=true;
                                }  
                                return false;  
                            }
                        })   
                }
        }
        //a partir de aca no aparecio la tabla de datos, pero puede venir un enlace o un codigo unico      
        if (CPAfounded!=true) {
            const weirdCase = $('div.question:nth-child(1) a');
            if ($(weirdCase).text()!="") {
                // console.log('caso tipo abot');
                const divLink = $('.question p').children('a').attr('href'); 
                streetsLink=divLink;
                codeType= 'linkToStreets';
            }else {
            // Caso yecohuyo Catamarca - Nos devuelve un codigo directo CPA
                const divLink = $('.question:nth-child(1) strong').text(); 
                code.push(divLink);
                codeType= 'unique';
            }    
        }
        return {
            code,
            codeType,
            streetsLink
        }

    }catch(e) {
        return e;
    }
}

module.exports = cpaExtract;








































// const cheerio = require ('cheerio');
// const axios = require('axios');

// async function cpaExtract (provinceName, name, link) {
//     try{
//         const {data} = await axios.get(link);
//         const $ = cheerio.load(data);

//         let valor="";
//         let code= [];   //arreglo donde guardo los codigos a devolver
//         let codeType="";//valor donde guardo si es un cpa, conjunto de cpa o direccion de 
//                         //calles
//         let streetsLink= "";

//         let CPAfounded = false;


//         //primero tendria que preguntar si aparece CPA tipo abbot
//         const $existTable = $('thead').length;
//         if ($existTable>0) {
//                 //Esto es para leer la cabecera si aparece tabla de datos
//                 const $titleCities = $('thead tr');
//                 //localidad esta primero en la fila de titulo. Hay varios codigos de la misma localidad
//                 if ($titleCities.find('tr th:nth-child(1)').text().toLocaleLowerCase()!=="provincia") {
//                         const $rowCities = $('tbody tr');
//                         $rowCities.each((idx,item)=>{
//                             if (($(item).find('tr td:nth-child(1)').text().toLowerCase()==name.toLowerCase()) && ($(item).find('td:nth-child(2)').text().toLowerCase()==provinceName.toLowerCase())) {
//                                 let CPA = $(item).find('td:nth-child(4)').text();
//                                 // console.log(CPA);
//                                 code.push(CPA);
//                                 codeType= 'multiple';

//                                 CPAfounded=true;
//                             }
//                         })        
//                 } else // quiere decir que esta primero provincia es la busqueda normal con un solo codigo y href para buscar
//                 {
//                         const $rowCities = $('tbody tr');
//                         $rowCities.each((idx,item)=>{
//                             if (($(item).find('tr td:nth-child(2)').text().toLowerCase()==name.toLowerCase()) && ($(item).find('td:first').text().toLowerCase()==provinceName.toLowerCase())) {
//                                 let CPA=null;
//                                 CPA= $(item).find('a').attr('href');
//                                 if (CPA.toLowerCase().includes("/cpa/")==true) {
//                                     let oneCode = $(item).find('a').text();
//                                     code.push(oneCode);
//                                     codeType= 'unique';

//                                     CPAfounded=true;
//                                 } else {
//                                     streetsLink = CPA;
//                                     codeType= 'linkToStreets'

//                                     CPAfounded=true;
//                                 }  
//                                 return false;  
//                             }
//                         })   
//                 }
//         }
            
            

//         //a partir de aca no aparecio la tabla de datos, pero puede venir un enlace o un codigo unico      
//         if (CPAfounded!=true) {
//             // console.log(`empieza-------------------------`)
//             // const weirdCase = $('div.question:nth-child(1) p');
//             const weirdCase = $('div.question:nth-child(1) a');
//             // console.log(' aver:');
//             // console.log( $(weirdCase).text()=="");
//             // console.log(' imprimio?')

            
//             // console.log(`termina-------------------------`)
//             if ($(weirdCase).text()!="") {
//                 // console.log('caso tipo abot');
//                 const divLink = $('.question p').children('a').attr('href'); 
//                 streetsLink=divLink;
//                 codeType= 'linkToStreets';
//             }else {
//             // Caso yecohuyo Catamarca - Nos devuelve un codigo directo CPA
//                 // console.log('caso yacohuyo catamarca');
//                 const divLink = $('.question:nth-child(1) strong').text(); 
//                 // console.log(divLink);
//                 code.push(divLink);
//                 codeType= 'unique';
//             }    

//         }
        
//         // console.log('termino cpa y voy')
//         return {
//             code,
//             codeType,
//             streetsLink
//         }

//     }catch(e) {
//         return e;
//     }
// }

// module.exports = cpaExtract;













