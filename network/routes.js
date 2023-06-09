const scrapper = require('../components/scrapping/scrapping.route');
const streets = require('../components/scrapping/scrappingStreet.route');
const csv = require('../components/processingOutput/processingOutput.route.js');

const router = function(app) {
    app.use('/scrapper', scrapper);
    app.use('/streets', streets);
    app.use('/csv', csv);
}

module.exports = router