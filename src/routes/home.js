const home = ({
  path: '/',
  method: 'GET',
  handler: (request, reply) => {
    reply('Hello world');
  }
})

module.exports = home;
