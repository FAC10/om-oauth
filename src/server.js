const hapi = require('hapi');
const inert = require('inert');
const fs = require('fs');

const routes = require('./routes');

const server = new hapi.Server();

server.connection({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  tls: {
    key: fs.readFileSync('./keys/key.pem'),
    cert: fs.readFileSync('./keys/cert.pem'),
  }
});

server.route(routes);

module.exports = server;
