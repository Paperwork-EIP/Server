const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const route = require('./src/api/index');

app.use(cors());
app.use(bodyParser.json());

const init_db = require('./src/persistence/init-db')
init_db.initAll()

let server;
module.exports = {
  start(port) {
    app.use(route);
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  },
  stop() {
    server.close();
  }
};