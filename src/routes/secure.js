const secure = ({
  path: '/secure',
  method: 'GET',
  config: { auth: 'jwt' },
  handler: (request, reply) => {
    reply('Welcome to this ultramegaextra secure thing');
  }
})

module.exports = secure;
