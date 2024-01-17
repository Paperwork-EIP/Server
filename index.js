const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const Process = require('./src/routes/router');
require('dotenv').config();

let corsOptions = {
  origin: '*'
};
if (process.env.PORT === 8080) {
  corsOptions = {
    origin: 'http://54.86.209.237:8080'
  };
} else if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
app.use(cors(corsOptions));
app.use(bodyParser.json());

const init_db = require('./src/persistence/init-db')

let server;
module.exports = {
  async start(port) {
    await init_db.initAll();
    if (!port) {
      return null;
    }
    app.use(Process);
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  },
  stop() {
    if (server) {
      server.close();
    }
  }
};