const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const supplier = require("./app/controller/supplier.controller");
const mustacheExpress = require("mustache-express");
const favicon = require("serve-favicon");
const { loadConfig } = require("./app/config/config");
const fs = require("fs");
const { initDB } = require("./app/config/db");

const app = express();
let appConfig;

// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/img/favicon.ico"));

// list all the students
app.get("/", (req, res) => {
  res.render("home", {});
});
app.get("/students/", supplier.findAll);
// show the add suppler form
app.get("/supplier-add", (req, res) => {
  res.render("supplier-add", {});
});
// receive the add supplier POST
app.post("/supplier-add", supplier.create);
// show the update form
app.get("/supplier-update/:id", supplier.findOne);
// receive the update POST
app.post("/supplier-update", supplier.update);
// receive the POST to delete a supplier
app.post("/supplier-remove/:id", supplier.remove);

app.get("/debug", (req, res) => {
  res.json({
    config: {
      host: appConfig.APP_DB_HOST,
      user: appConfig.APP_DB_USER,
      db: appConfig.APP_DB_NAME,
    },
    time: new Date().toISOString(),
    status: `Server is running on port 3000.`,
  });
});

// handle 404
app.use(function (req, res, next) {
  res.status(404).render("404", {});
});

async function initializeApp() {
  appConfig = await loadConfig();
  await initDB(appConfig);

  app.listen(3000, "0.0.0.0", () => {
    console.log(`Server is running on port 3000.`);
  });
}

initializeApp();
