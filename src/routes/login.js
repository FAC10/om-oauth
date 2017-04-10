require('env2')('config.env');

const login = ({
  path: '/login',
  method: 'GET',
  handler: (request, reply) => {
    reply.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`);
  }
})

module.exports = login;
