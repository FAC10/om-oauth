const request = require('request');
const bcrypt = require('bcryptjs');
const qs = require('querystring');
require('env2')('config.env');

const welcome = ({
  path: '/welcome',
  method: 'GET',
  handler: (req, reply) => {
    const code = req.url.query.code;
    const url = `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;
    request.post(url, (err, res, body) => {
      const acctok = qs.parse(body).access_token;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(acctok, salt, (err, hash) => {
          if (err) console.log('Error:' + err);
          reply.redirect('/').state('om-cookie', { accessToken: hash });
          })
        })
      })
    }
  })

module.exports = welcome;
