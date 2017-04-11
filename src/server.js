const hapi = require('hapi');
const inert = require('inert');
const fs = require('fs');
const haj = require('hapi-auth-jwt2');
require('env2')('config.env');

const routes = require('./routes');
const users = require('./users');

const server = new hapi.Server();

server.connection({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  tls: {
    key: fs.readFileSync('./keys/key.pem'),
    cert: fs.readFileSync('./keys/cert.pem'),
  }
});

server.register([inert, haj], (err) => {
  if (err) throw err;

  const validate = (token, request, cb) => {
    if (!users[token.user.user_id]) {
     return cb(null, false);
   }
   return cb(null, true);
  }

  const strategyOptions = {
    key: process.env.JWT_SECRET,
    validateFunc: validate,
    verifyOptions: { algorithms: [ 'HS256' ] }
  }

  server.auth.strategy('jwt', 'jwt', strategyOptions);
  server.route(routes);
})



module.exports = server;
