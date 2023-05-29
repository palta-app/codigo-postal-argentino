const express = require("express");
const app = express();
const veri = require("./data");
const port = 3001;

app.get("/", (req, res) => {
  veri.scrape().then((data) => {
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(port);
});
