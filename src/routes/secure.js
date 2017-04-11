const secure = ({
  path: '/secure',
  method: 'GET',
  handler: (request, reply) => {
    reply('Welcome to this ultramegaextra secure thing');
  }
})

module.exports = secure; 
