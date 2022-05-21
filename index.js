const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
//const api = require('./src/api');

//app.use(api);

//const init_db = require('./src/persistence/init-db')
//init_db.initAll()

//const core = require('./src/core')

let server;
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    // setInterval(() => {
    //   core.start()
    // }, 60000)
    return app;
  },
  stop() {
    server.close();
  }
};