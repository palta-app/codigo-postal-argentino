const axios = require('axios')
const cheerio = require('cheerio')

const getOneCPA = async () => {
  const result = await axios.get('https://codigo-postal.co/argentina/cpa/M5501ZZZ/')
  return result.data
}

getOneCPA()
  .then(data => {
    const $ = cheerio.load(data);
    const title = $('title').text()
    if (title.split(" ")[2].length === 8) { console.log('Existe el registro') } else { console.log('No existe el registro') }
  })
  .catch(error => {
    console.error(error);
  });

