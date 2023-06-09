const ExcelJS = require('exceljs');


async function savingCSV (newWorksheetData, newWorksheetTitle, newFilename, newHeaders) {
    try{
            const workbook = new ExcelJS.Workbook();
            const fileName = "JSON/"+newFilename+".csv";
            const sheet = workbook.addWorksheet(newWorksheetTitle);
            const reColumns=[];
            for(let x=0; x<newHeaders.length; x++) {
                reColumns.push({
                    header: newHeaders[x],
                    key: newHeaders[x]
                })
            }
            sheet.columns = reColumns;
            sheet.addRows(newWorksheetData);
            const options = {
                encoding: "utf-8"
            }
            workbook.csv.writeFile(fileName, options)
            .then((m)=>{
                console.log('Archivo creado exitosamente');
            })
            .catch((e)=>{
                console.log('No se pudo grabar el archivo')
            })
    }catch (e) {
        return e;
    }
}

module.exports=savingCSV;