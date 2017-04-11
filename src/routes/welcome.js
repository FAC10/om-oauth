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

        let options = {
          'expiresIn': Date.now() + 24 * 60 * 60 * 1000,
          'subject': 'github-data'
        };

        let payload = {
          'user': {
              'username': body.login,
              'img_url': body.avatar_url,
              'user_id': body.id
            },
          'accessToken': acctok
        };
        jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
          if (err) return console.log(err);
          console.log(token);
        });
        reply.redirect('/');
      })
    })
  }
})

module.exports = welcome;
