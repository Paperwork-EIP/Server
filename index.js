const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const route = require('./src/api/index');
const process = require('./src/process/index');

const appSecure = express();
appSecure.disable("x-powered-by");

let corsOptions = {
  origin: 'http://localhost:8080/'
};

const app = express();
app.use(helmet.hidePoweredBy());
app.use(cors());
app.use(bodyParser.json());
app.use(cors(corsOptions));

function initDatabase(port) {
  if (port === 3001) {
    return;
  }
  else {
    const init_db = require('./src/persistence/init-db');
    init_db.initAll();
  }
}

let server;

function start(port) {
  app.use(route, process);
  server = app.listen(port, () => {
    console.log(`App started on port ${port}`);
  });
  return server;
}
function stop() {
  server.close();
}

module.exports = { initDatabase, start, stop };