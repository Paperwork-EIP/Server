const Server = require('../index');

Server.initDatabase(process.env.PORT);
Server.start(process.env.PORT);