const cheerio = require ('cheerio');
const axios = require('axios');

async function cpaStreetExtract (link, streetId) {
    try{

        let customHeader = ["Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1", "Mozilla/5.0 (iPhone9,4; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1", "Mozilla/5.0 (Linux; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/47.1.79 like Chrome/47.0.2526.80 Safari/537.36", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1","Dalvik/2.1.0 (Linux; U; Android 9; ADT-2 Build/PTT5.181126.002)","Roku4640X/DVP-7.70 (297.70E04154A)", "Mozilla/5.0 (Linux; U; Android 4.2.2; he-il; NEO-X5-116A Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30", "Dalvik/2.1.0 (Linux; U; Android 6.0.1; Nexus Player Build/MMB29T)", "AppleTV11,1/11.1"]
        let headChoosen = customHeader[Math.floor(Math.random()*customHeader.length)]

        const {data} = await axios.get(link, { headers: {
                                                 'User-Agent': headChoosen }  });
        
        const $ = cheerio.load(data)
        const $patern = $('.three_columns a');
        let streets = []
        
        let index = streetId;
        $patern.each((idx,item)=>{
            index++;
            streets.push({
            streetId: index,    
            streetName : $(item).text(),
            link : $(item).attr('href'),
            
            })
        })
        return {streets, index}    
    }catch(e) {
        res.send(e)
    }
}

module.exports = cpaStreetExtract;