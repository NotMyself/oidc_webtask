'use latest';

import express from 'express';
import jwtAuthz from 'express-jwt-authz';
import jwksRsa from 'jwks-rsa';
import jwt from 'express-jwt';
import { fromExpress } from 'webtask-tools';
import Request from 'request-promise-native';

const request = Request.defaults({
  json: true,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'OIDC Webtask (https://github.com/NotMyself/oidc_webtask)'
  }
});

var app = express();

app.use(jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${module.webtask.secrets.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: module.webtask.secrets.AUDIENCE,
  issuer: `https://${module.webtask.secrets.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
}));

app.get('/', jwtAuthz([ 'read:jokes' ]), function (req, res) {
  request.get(req.webtaskContext.meta.DAD_JOKE_API_URL)
    .then(joke => {
      joke.image = 'https://cdn.auth0.com/website/assets/pages/about/img/leadership/eugenio_pace-1bfa3230d1.jpg';
      res.send(joke);
    })
    .catch(err => {
      res.status(500)
        .send(err.message);
    });
});

module.exports = fromExpress(app);
