const express = require("express");
const bodyParser = require("body-parser");
const db = require("./Config/db");
const routes = require("./Controllers/ProductController");
const port = process.env.PORT | 8080;
const app = express();

app.listen(port, function () {
  console.log("Server is listening at port:" + port);
});

// Parses the text as url encoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// Parses the text as json
app.use(bodyParser.json());

app.use("/", routes);
