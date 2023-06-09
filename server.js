const express = require('express');
const app = express();

const router = require('./network/routes');

router(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`);
})

