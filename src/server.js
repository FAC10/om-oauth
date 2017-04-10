const hapi = require('hapi');
const inert = require('inert');

const routes = require('./routes');

const server = new hapi.Server();

server.connection({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
});

server.route(routes);

module.exports = server;
