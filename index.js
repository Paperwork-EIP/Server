const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const route = require('./src/api/index');
const process = require('./src/process/index');

app.use(cors());
app.use(bodyParser.json());

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