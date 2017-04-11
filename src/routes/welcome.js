const request = require('request');
const bcrypt = require('bcryptjs');
const qs = require('querystring');
const jwt = require('jsonwebtoken');
require('env2')('config.env');

const welcome = ({
  path: '/welcome',
  method: 'GET',
  handler: (req, reply) => {
    const code = req.url.query.code;
    const url = `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;
    request.post(url, (err, res, body) => {
      const acctok = qs.parse(body).access_token;
      const headers = {
        'User-Agent': 'oauth_github_jwt',
        Authorization: `token ${acctok}`
      };
      const userURL = 'https://api.github.com/user';
      request.get({ url: userURL, headers }, (err, res, body) => {
        if (err) throw err;
        let options = {
          'expiresIn': Date.now() + 24 * 60 * 60 * 1000,
          'subject': 'github-data'
        };
        const parsedBody = JSON.parse(body);
        let payload = {
          'user': {
              'username': parsedBody.login,
              'img_url': parsedBody.avatar_url,
              'user_id': parsedBody.id
            },
          'accessToken': acctok
        };
        jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
          if (err) return console.log(err);
          console.log(token);
          let config = {
            path: '/',
            isSecure: process.env.NODE_ENV === 'PRODUCTION'
          }

          reply
           .redirect('/secure') //make a new route for the redirect, config it with an authentication strategy
           .state('token', token, config);
        });

      })
    })
  }
})


module.exports = welcome;
